import type { Metadata } from "next";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/admin/Breadcrumbs";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";
import { getAllUsers, deleteUser } from "@/lib/services/user.service";
import { formatDate } from "@/lib/utils";
import { requirePermission } from "@/lib/permissions";

export const metadata: Metadata = { title: "Users" };

const roleBadge: Record<string, "default" | "secondary" | "outline"> = {
  SUPER_ADMIN: "default",
  ADMIN: "secondary",
  EDITOR: "outline",
  VIEWER: "outline",
};

export default async function UsersAdminPage() {
  await requirePermission("manage:users");
  const { users, total } = await getAllUsers();

  return (
    <div className="space-y-6">
      <Breadcrumbs crumbs={[{ label: "Users" }]} />

      <AdminPageHeader
        title="Users"
        total={total}
        countLabel="total users"
        newHref="/admin/users/new"
        newLabel="Add User"
      />

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/30">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Name</th>
                <th className="px-4 py-3 text-left font-medium">Email</th>
                <th className="px-4 py-3 text-left font-medium">Role</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">Joined</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-muted/20">
                  <td className="px-4 py-3 font-medium">{user.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                  <td className="px-4 py-3">
                    <Badge variant={roleBadge[user.role]}>{user.role.replace("_", " ")}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={user.status === "ACTIVE" ? "success" : "secondary"}>
                      {user.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(user.createdAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/users/${user.id}/edit`}><Pencil className="h-4 w-4" /></Link>
                      </Button>
                      {user.role !== "SUPER_ADMIN" && (
                        <DeleteConfirmDialog
                          title={`Delete "${user.name}"?`}
                          description="This will permanently delete the user account."
                          onConfirm={async () => {
                            "use server";
                            await deleteUser(user.id);
                            revalidatePath("/admin/users");
                          }}
                        />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
