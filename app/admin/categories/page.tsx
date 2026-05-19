import type { Metadata } from "next";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/admin/Breadcrumbs";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";
import { getAllCategories, deleteCategory } from "@/lib/services/category.service";
import { CategoryForm } from "@/components/admin/CategoryForm";

export const metadata: Metadata = { title: "Categories" };

export default async function CategoriesAdminPage() {
  const categories = await getAllCategories();

  return (
    <div className="space-y-6">
      <Breadcrumbs crumbs={[{ label: "Categories" }]} />

      <AdminPageHeader title="Categories" />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Create form */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Add Category</h2>
            <CategoryForm mode="create" />
          </CardContent>
        </Card>

        {/* List */}
        <Card>
          <CardContent className="p-0">
            {categories.length === 0 ? (
              <p className="p-6 text-center text-muted-foreground">No categories yet.</p>
            ) : (
              <table className="w-full text-sm">
                <thead className="border-b bg-muted/30">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Name</th>
                    <th className="px-4 py-3 text-left font-medium">Posts</th>
                    <th className="px-4 py-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {categories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-muted/20">
                      <td className="px-4 py-3 font-medium">{cat.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{cat._count.posts}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/admin/categories/${cat.id}/edit`}><Pencil className="h-4 w-4" /></Link>
                          </Button>
                          <DeleteConfirmDialog
                            title={`Delete "${cat.name}"?`}
                            description="Posts in this category will lose their category assignment."
                            onConfirm={async () => {
                              "use server";
                              await deleteCategory(cat.id);
                              revalidatePath("/admin/categories");
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
