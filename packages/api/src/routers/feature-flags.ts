import { db } from "@boilerplate/db";
import { organization } from "@boilerplate/db/schema/auth";
import { featureFlag, featureFlagOverride } from "@boilerplate/db/schema/product";
import { evaluateFeatureFlag } from "@boilerplate/feature-flags";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { adminProcedure, organizationProcedure, router } from "../index";

const flagKey = z
  .string()
  .trim()
  .min(2)
  .max(80)
  .regex(/^[a-z][a-z0-9._-]*$/);
const createFlagInput = z
  .object({
    key: flagKey,
    description: z.string().trim().max(500).optional(),
    enabled: z.boolean().default(false),
    rolloutPercentage: z.number().int().min(0).max(100).default(100),
  })
  .strict();
const updateFlagInput = z
  .object({
    id: z.string().min(1),
    description: z.string().trim().max(500).nullable().optional(),
    enabled: z.boolean().optional(),
    rolloutPercentage: z.number().int().min(0).max(100).optional(),
  })
  .strict();
const overrideInput = z
  .object({ flagId: z.string().min(1), organizationId: z.string().min(1), enabled: z.boolean() })
  .strict();

export const featureFlagsRouter = router({
  evaluated: organizationProcedure.query(async ({ ctx }): Promise<Record<string, boolean>> => {
    const flags = await db.select({ key: featureFlag.key }).from(featureFlag);
    return Object.fromEntries(
      await Promise.all(
        flags.map(async ({ key }) => [
          key,
          await evaluateFeatureFlag({
            key,
            organizationId: ctx.organizationId,
            subjectId: ctx.session.user.id,
          }),
        ]),
      ),
    );
  }),
  adminList: adminProcedure.query(async () => {
    const [flags, overrides, organizations] = await Promise.all([
      db.select().from(featureFlag),
      db.select().from(featureFlagOverride),
      db.select({ id: organization.id, name: organization.name }).from(organization),
    ]);
    return { flags, overrides, organizations };
  }),
  create: adminProcedure.input(createFlagInput).mutation(async ({ input }) => {
    const [created] = await db
      .insert(featureFlag)
      .values({ id: crypto.randomUUID(), ...input })
      .returning();
    return created;
  }),
  update: adminProcedure.input(updateFlagInput).mutation(async ({ input }) => {
    const { id, ...data } = input;
    const [updated] = await db
      .update(featureFlag)
      .set(data)
      .where(eq(featureFlag.id, id))
      .returning();
    return updated;
  }),
  setOverride: adminProcedure.input(overrideInput).mutation(async ({ input }) => {
    const [override] = await db
      .insert(featureFlagOverride)
      .values({ id: crypto.randomUUID(), ...input })
      .onConflictDoUpdate({
        target: [featureFlagOverride.flagId, featureFlagOverride.organizationId],
        set: { enabled: input.enabled },
      })
      .returning();
    return override;
  }),
});
