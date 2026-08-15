import Stripe from "stripe";
import { describe, expect, it } from "vitest";

import { constructStripeEvent } from "./stripe";

const webhookSecret = "whsec_test_secret";
const client = new Stripe("sk_test_example");
const payload = JSON.stringify({
  id: "evt_test",
  object: "event",
  created: 1_700_000_000,
  type: "customer.subscription.updated",
  data: { object: { id: "sub_test" } },
});

describe("Stripe webhook signatures", () => {
  it("accepts an authentic raw payload", async () => {
    const signature = client.webhooks.generateTestHeaderString({ payload, secret: webhookSecret });

    await expect(
      constructStripeEvent(payload, signature, { client, webhookSecret }),
    ).resolves.toMatchObject({ id: "evt_test" });
  });

  it("rejects a modified payload", async () => {
    const signature = client.webhooks.generateTestHeaderString({ payload, secret: webhookSecret });

    await expect(
      constructStripeEvent(`${payload} `, signature, { client, webhookSecret }),
    ).rejects.toThrow();
  });
});
