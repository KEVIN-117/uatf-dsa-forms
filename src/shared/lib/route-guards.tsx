import { redirect } from "@tanstack/react-router";
import { auth } from "#/shared/lib/firebase";
import type { Role } from "#/shared/types";

async function getCurrentRole(): Promise<Role | null> {
	const currentUser = auth.currentUser;
	if (!currentUser) return null;
	const token = await currentUser.getIdTokenResult();
	return (token.claims.role as Role) ?? null;
}

export async function requireRole(allowedRoles: Role[]) {
	const currentUser = auth.currentUser;
	if (!currentUser) {
		throw redirect({ to: "/" });
	}
	const role = await getCurrentRole();
	if (!role || !allowedRoles.includes(role)) {
		throw redirect({ to: "/dashboard" });
	}
}
