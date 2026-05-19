import { auth } from "@/lib/auth";

export type Permission =
  | "manage:all"
  | "manage:content"
  | "manage:users"
  | "view:dashboard";

type UserRole = "SUPER_ADMIN" | "ADMIN" | "EDITOR" | "VIEWER";

const rolePermissions: Record<UserRole, Permission[]> = {
  SUPER_ADMIN: ["manage:all", "manage:content", "manage:users", "view:dashboard"],
  ADMIN: ["manage:content", "manage:users", "view:dashboard"],
  EDITOR: ["manage:content", "view:dashboard"],
  VIEWER: ["view:dashboard"],
};

export function hasPermission(role: UserRole, permission: Permission): boolean {
  const perms = rolePermissions[role] ?? [];
  return perms.includes("manage:all") || perms.includes(permission);
}

/** Use in server components / API routes to get the current session */
export async function getSession() {
  return auth();
}

/** Throws if user is not authenticated */
export async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return session;
}

/** Throws if user lacks the required permission */
export async function requirePermission(permission: Permission) {
  const session = await requireAuth();
  const role = session.user.role as UserRole;
  if (!hasPermission(role, permission)) {
    throw new Error("Forbidden");
  }
  return session;
}
