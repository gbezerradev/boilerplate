import { db } from "@boilerplate/db";
import { billingCustomer, stripeWebhookEvent, subscription } from "@boilerplate/db/schema/billing";
import { env } from "@boilerplate/env/server";
import { and, desc, eq, inArray, lte } from "drizzle-orm";
import type Stripe from "stripe";

import { getEntitlements, getProPriceId } from "./plans";
import { getStripeClient } from "./stripe";

interface BillingIdentity {
  organizationId: string;
  email: string;
  name: string;
}

async function getOrCreateBillingCustomer(identity: BillingIdentity) {
  const [existing] = await db
    .select()
    .from(billingCustomer)
    .where(eq(billingCustomer.organizationId, identity.organizationId))
    .limit(1);

  if (existing) {
    return existing.stripeCustomerId;
  }

  const stripe = getStripeClient();
  const customer = await stripe.customers.create(
    {
      email: identity.email,
      name: identity.name,
      metadata: { organizationId: identity.organizationId },
    },
    { idempotencyKey: `billing-customer:${identity.organizationId}` },
  );

  await db
    .insert(billingCustomer)
    .values({
      organizationId: identity.organizationId,
      stripeCustomerId: customer.id,
    })
    .onConflictDoNothing();

  const [stored] = await db
    .select()
    .from(billingCustomer)
    .where(eq(billingCustomer.organizationId, identity.organizationId))
    .limit(1);

  if (!stored) {
    throw new Error("Unable to persist the Stripe customer mapping");
  }

  return stored.stripeCustomerId;
}

export async function createCheckoutSession(identity: BillingIdentity) {
  const stripe = getStripeClient();
  const stripeCustomerId = await getOrCreateBillingCustomer(identity);
  const successUrl = new URL("/dashboard", env.CORS_ORIGIN);
  successUrl.searchParams.set("checkout", "success");
  const cancelUrl = new URL("/dashboard", env.CORS_ORIGIN);
  cancelUrl.searchParams.set("checkout", "cancelled");

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: stripeCustomerId,
    client_reference_id: identity.organizationId,
    line_items: [{ price: getProPriceId(), quantity: 1 }],
    allow_promotion_codes: true,
    success_url: successUrl.toString(),
    cancel_url: cancelUrl.toString(),
    metadata: { organizationId: identity.organizationId },
    subscription_data: {
      metadata: { organizationId: identity.organizationId },
    },
  });

  if (!session.url) {
    throw new Error("Stripe did not return a Checkout URL");
  }

  return session.url;
}

export async function createPortalSession(organizationId: string) {
  const [customer] = await db
    .select()
    .from(billingCustomer)
    .where(eq(billingCustomer.organizationId, organizationId))
    .limit(1);

  if (!customer) {
    throw new Error("This workspace does not have a billing customer yet");
  }

  const portal = await getStripeClient().billingPortal.sessions.create({
    customer: customer.stripeCustomerId,
    return_url: new URL("/dashboard", env.CORS_ORIGIN).toString(),
  });

  return portal.url;
}

export async function getOrganizationEntitlements(organizationId: string) {
  const [currentSubscription] = await db
    .select()
    .from(subscription)
    .where(
      and(
        eq(subscription.organizationId, organizationId),
        inArray(subscription.status, ["active", "trialing"]),
      ),
    )
    .orderBy(desc(subscription.stripeEventCreatedAt))
    .limit(1);

  return getEntitlements({
    priceId: currentSubscription?.priceId,
    status: currentSubscription?.status,
  });
}

function getStripeId(value: string | { id: string } | null) {
  return typeof value === "string" ? value : value?.id;
}

export async function processStripeWebhookEvent(event: Stripe.Event) {
  return db.transaction(async (tx) => {
    const stripeObject = event.data.object as { id?: string };
    const [eventRecord] = await tx
      .insert(stripeWebhookEvent)
      .values({
        id: event.id,
        type: event.type,
        objectId: stripeObject.id,
        stripeCreatedAt: new Date(event.created * 1_000),
      })
      .onConflictDoNothing()
      .returning({ id: stripeWebhookEvent.id });

    if (!eventRecord) {
      return { duplicate: true } as const;
    }

    if (event.type === "checkout.session.completed") {
      const checkout = event.data.object as Stripe.Checkout.Session;
      const organizationId = checkout.metadata?.organizationId ?? checkout.client_reference_id;
      const customerId = getStripeId(checkout.customer);

      if (organizationId && customerId) {
        await tx
          .insert(billingCustomer)
          .values({ organizationId, stripeCustomerId: customerId })
          .onConflictDoUpdate({
            target: billingCustomer.organizationId,
            set: { stripeCustomerId: customerId, updatedAt: new Date() },
          });
      }
    }

    if (
      event.type === "customer.subscription.created" ||
      event.type === "customer.subscription.updated" ||
      event.type === "customer.subscription.deleted"
    ) {
      const stripeSubscription = event.data.object as Stripe.Subscription;
      const customerId = getStripeId(stripeSubscription.customer);
      let organizationId = stripeSubscription.metadata.organizationId;

      if (!organizationId && customerId) {
        const [customer] = await tx
          .select({ organizationId: billingCustomer.organizationId })
          .from(billingCustomer)
          .where(eq(billingCustomer.stripeCustomerId, customerId))
          .limit(1);
        organizationId = customer?.organizationId;
      }

      const subscriptionItem = stripeSubscription.items.data[0];
      if (!organizationId || !customerId || !subscriptionItem) {
        throw new Error(`Stripe subscription ${stripeSubscription.id} is missing tenant metadata`);
      }

      const eventCreatedAt = new Date(event.created * 1_000);
      await tx
        .insert(subscription)
        .values({
          id: stripeSubscription.id,
          organizationId,
          stripeCustomerId: customerId,
          priceId: subscriptionItem.price.id,
          status: stripeSubscription.status,
          cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
          currentPeriodEnd: new Date(subscriptionItem.current_period_end * 1_000),
          stripeEventCreatedAt: eventCreatedAt,
        })
        .onConflictDoUpdate({
          target: subscription.id,
          set: {
            organizationId,
            stripeCustomerId: customerId,
            priceId: subscriptionItem.price.id,
            status: stripeSubscription.status,
            cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
            currentPeriodEnd: new Date(subscriptionItem.current_period_end * 1_000),
            stripeEventCreatedAt: eventCreatedAt,
            updatedAt: new Date(),
          },
          setWhere: lte(subscription.stripeEventCreatedAt, eventCreatedAt),
        });
    }

    await tx
      .update(stripeWebhookEvent)
      .set({ processedAt: new Date() })
      .where(eq(stripeWebhookEvent.id, event.id));

    return { duplicate: false } as const;
  });
}
