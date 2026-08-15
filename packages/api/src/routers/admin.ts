import { db } from "@boilerplate/db";
import { organization, user } from "@boilerplate/db/schema/auth";
import { subscription } from "@boilerplate/db/schema/billing";
import { backgroundJob } from "@boilerplate/db/schema/operations";
import { count, desc } from "drizzle-orm";

import { adminProcedure, router } from "../index";

export const adminRouter = router({
  overview: adminProcedure.query(async () => {
    const [userCount, organizationCount, subscriptionCount, jobCounts, recentUsers, recentJobs] =
      await Promise.all([
        db.select({ value: count() }).from(user),
        db.select({ value: count() }).from(organization),
        db.select({ value: count() }).from(subscription),
        db
          .select({ status: backgroundJob.status, value: count() })
          .from(backgroundJob)
          .groupBy(backgroundJob.status),
        db
          .select({ id: user.id, name: user.name, email: user.email, createdAt: user.createdAt })
          .from(user)
          .orderBy(desc(user.createdAt))
          .limit(10),
        db
          .select({
            id: backgroundJob.id,
            type: backgroundJob.type,
            status: backgroundJob.status,
            attempts: backgroundJob.attempts,
            lastError: backgroundJob.lastError,
            createdAt: backgroundJob.createdAt,
          })
          .from(backgroundJob)
          .orderBy(desc(backgroundJob.createdAt))
          .limit(10),
      ]);

    return {
      counts: {
        users: userCount[0]?.value ?? 0,
        organizations: organizationCount[0]?.value ?? 0,
        subscriptions: subscriptionCount[0]?.value ?? 0,
        jobs: Object.fromEntries(jobCounts.map((row) => [row.status, row.value])),
      },
      recentUsers,
      recentJobs,
    };
  }),
});
