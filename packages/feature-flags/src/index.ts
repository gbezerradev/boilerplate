import { createHash } from "node:crypto";

import { db } from "@boilerplate/db";
import { featureFlag, featureFlagOverride } from "@boilerplate/db/schema/product";
import { and, eq } from "drizzle-orm";

export function isInRollout(flagKey: string, subjectId: string, percentage: number) {
  if (percentage <= 0) return false;
  if (percentage >= 100) return true;
  const hash = createHash("sha256").update(`${flagKey}:${subjectId}`).digest();
  return hash.readUInt32BE(0) % 10_000 < percentage * 100;
}

export async function evaluateFeatureFlag(input: {
  key: string;
  organizationId: string;
  subjectId: string;
}) {
  const [result] = await db
    .select({
      enabled: featureFlag.enabled,
      rolloutPercentage: featureFlag.rolloutPercentage,
      override: featureFlagOverride.enabled,
    })
    .from(featureFlag)
    .leftJoin(
      featureFlagOverride,
      and(
        eq(featureFlagOverride.flagId, featureFlag.id),
        eq(featureFlagOverride.organizationId, input.organizationId),
      ),
    )
    .where(eq(featureFlag.key, input.key))
    .limit(1);

  if (!result) return false;
  if (result.override !== null) return result.override;
  return result.enabled && isInRollout(input.key, input.subjectId, result.rolloutPercentage);
}
