import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

import { organization, user } from "./auth";

export const storedObject = pgTable(
  "stored_object",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    key: text("key").notNull().unique(),
    name: text("name").notNull(),
    contentType: text("content_type").notNull(),
    size: integer("size").notNull(),
    status: text("status").default("pending").notNull(),
    uploadedBy: text("uploaded_by")
      .notNull()
      .references(() => user.id, { onDelete: "restrict" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("stored_object_organization_status_idx").on(table.organizationId, table.status),
    index("stored_object_organization_created_at_idx").on(table.organizationId, table.createdAt),
  ],
);

export const featureFlag = pgTable("feature_flag", {
  id: text("id").primaryKey(),
  key: text("key").notNull().unique(),
  description: text("description"),
  enabled: boolean("enabled").default(false).notNull(),
  rolloutPercentage: integer("rollout_percentage").default(100).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const featureFlagOverride = pgTable(
  "feature_flag_override",
  {
    id: text("id").primaryKey(),
    flagId: text("flag_id")
      .notNull()
      .references(() => featureFlag.id, { onDelete: "cascade" }),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    enabled: boolean("enabled").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex("feature_flag_override_flag_organization_uidx").on(
      table.flagId,
      table.organizationId,
    ),
    index("feature_flag_override_organization_idx").on(table.organizationId),
  ],
);

export const webhookEndpoint = pgTable(
  "webhook_endpoint",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    url: text("url").notNull(),
    secretEncrypted: text("secret_encrypted").notNull(),
    events: jsonb("events").$type<string[]>().notNull(),
    active: boolean("active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("webhook_endpoint_organization_idx").on(table.organizationId)],
);

export const webhookDelivery = pgTable(
  "webhook_delivery",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    endpointId: text("endpoint_id")
      .notNull()
      .references(() => webhookEndpoint.id, { onDelete: "cascade" }),
    eventId: text("event_id").notNull(),
    eventType: text("event_type").notNull(),
    status: text("status").default("pending").notNull(),
    responseStatus: integer("response_status"),
    lastError: text("last_error"),
    completedAt: timestamp("completed_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex("webhook_delivery_event_endpoint_uidx").on(table.eventId, table.endpointId),
    index("webhook_delivery_organization_created_idx").on(table.organizationId, table.createdAt),
  ],
);

export const storedObjectRelations = relations(storedObject, ({ one }) => ({
  organization: one(organization, {
    fields: [storedObject.organizationId],
    references: [organization.id],
  }),
  uploader: one(user, { fields: [storedObject.uploadedBy], references: [user.id] }),
}));

export const featureFlagOverrideRelations = relations(featureFlagOverride, ({ one }) => ({
  flag: one(featureFlag, {
    fields: [featureFlagOverride.flagId],
    references: [featureFlag.id],
  }),
  organization: one(organization, {
    fields: [featureFlagOverride.organizationId],
    references: [organization.id],
  }),
}));

export const webhookEndpointRelations = relations(webhookEndpoint, ({ one, many }) => ({
  organization: one(organization, {
    fields: [webhookEndpoint.organizationId],
    references: [organization.id],
  }),
  deliveries: many(webhookDelivery),
}));

export const webhookDeliveryRelations = relations(webhookDelivery, ({ one }) => ({
  endpoint: one(webhookEndpoint, {
    fields: [webhookDelivery.endpointId],
    references: [webhookEndpoint.id],
  }),
}));
