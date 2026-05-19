import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/admin/Breadcrumbs";
import { UserForm } from "@/components/admin/UserForm";
import { requirePermission } from "@/lib/permissions";

export const metadata: Metadata = { title: "New User" };

export default async function NewUserPage() {
  await requirePermission("manage:users");

  return (
    <div className="space-y-6">
      <Breadcrumbs
        crumbs={[
          { label: "Users", href: "/admin/users" },
          { label: "New User" },
        ]}
      />
      <h1 className="text-3xl font-bold tracking-tight">Create User</h1>
      <UserForm mode="create" />
    </div>
  );
}
