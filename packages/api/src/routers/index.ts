import { organizationProcedure, publicProcedure, router } from "../index";
import { adminRouter } from "./admin";
import { auditRouter } from "./audit";
import { billingRouter } from "./billing";
import { featureFlagsRouter } from "./feature-flags";
import { integrationsRouter } from "./integrations";
import { projectsRouter } from "./projects";
import { storageRouter } from "./storage";

export const appRouter = router({
  admin: adminRouter,
  audit: auditRouter,
  billing: billingRouter,
  featureFlags: featureFlagsRouter,
  integrations: integrationsRouter,
  projects: projectsRouter,
  storage: storageRouter,
  healthCheck: publicProcedure.query(() => {
    return "OK";
  }),
  privateData: organizationProcedure.query(({ ctx }) => {
    return {
      message: "This is private",
      user: ctx.session.user,
      organizationId: ctx.organizationId,
      role: ctx.member.role,
    };
  }),
});
export type AppRouter = typeof appRouter;
