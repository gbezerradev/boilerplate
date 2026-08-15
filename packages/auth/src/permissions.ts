import { createAccessControl } from "better-auth/plugins/access";
import {
  adminAc,
  defaultStatements,
  memberAc,
  ownerAc,
} from "better-auth/plugins/organization/access";

const statement = {
  ...defaultStatements,
  data: ["read", "create", "update", "delete"],
  billing: ["read", "manage"],
  audit: ["read"],
  integrations: ["read", "manage"],
} as const;

export const organizationAccessControl = createAccessControl(statement);

const dataPermissions = ["read", "create", "update", "delete"] as const;

export const memberRole = organizationAccessControl.newRole({
  ...memberAc.statements,
  data: dataPermissions,
  integrations: ["read"],
});

export const adminRole = organizationAccessControl.newRole({
  ...adminAc.statements,
  data: dataPermissions,
  billing: ["read"],
  audit: ["read"],
  integrations: ["read", "manage"],
});

export const ownerRole = organizationAccessControl.newRole({
  ...ownerAc.statements,
  data: dataPermissions,
  billing: ["read", "manage"],
  audit: ["read"],
  integrations: ["read", "manage"],
});

export const organizationRoles = {
  owner: ownerRole,
  admin: adminRole,
  member: memberRole,
};
