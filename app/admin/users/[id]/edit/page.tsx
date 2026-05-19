import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/admin/Breadcrumbs";
import { UserForm } from "@/components/admin/UserForm";
import { getUserById } from "@/lib/services/user.service";
import { requirePermission } from "@/lib/permissions";

export const metadata: Metadata = { title: "Edit User" };

interface PageProps {
  params: { id: string };
}

export default async function EditUserPage({ params }: PageProps) {
  await requirePermission("manage:users");
  const user = await getUserById(params.id);
  if (!user) notFound();

  return (
    <div className="space-y-6">
      <Breadcrumbs
        crumbs={[
          { label: "Users", href: "/admin/users" },
          { label: `Edit: ${user.name}` },
        ]}
      />
      <h1 className="text-3xl font-bold tracking-tight">Edit User</h1>
      <UserForm
        mode="edit"
        userId={user.id}
        defaultValues={{
          name: user.name,
          role: user.role as any,
          status: user.status as any,
          email: user.email,
        }}
      />
    </div>
  );
}
