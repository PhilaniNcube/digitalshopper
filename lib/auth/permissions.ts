import { createAccessControl } from "better-auth/plugins/access";
import {
	adminAc,
	defaultStatements,
} from "better-auth/plugins/admin/access";

const statements = {
	...defaultStatements,
	dashboard: ["read"],
	catalog: ["manage"],
	orders: ["manage"],
} as const;

export const ac = createAccessControl(statements);

export const user = ac.newRole({});

export const admin = ac.newRole({
	...adminAc.statements,
	dashboard: ["read"],
	catalog: ["manage"],
	orders: ["manage"],
});