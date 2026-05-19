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
import { getAllPages, deletePage } from "@/lib/services/page.service";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Pages" };

const statusVariant: Record<string, "success" | "warning" | "secondary"> = {
  PUBLISHED: "success",
  DRAFT: "warning",
  ARCHIVED: "secondary",
};

export default async function PagesAdminPage() {
  const { pages, total } = await getAllPages();

  return (
    <div className="space-y-6">
      <Breadcrumbs crumbs={[{ label: "Pages" }]} />

      <AdminPageHeader
        title="Pages"
        total={total}
        countLabel="total pages"
        newHref="/admin/pages/new"
        newLabel="New Page"
      />

      <Card>
        <CardContent className="p-0">
          {pages.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16 text-muted-foreground">
              <p>No pages yet.</p>
              <Button asChild size="sm"><Link href="/admin/pages/new">Create your first page</Link></Button>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/30">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Title</th>
                  <th className="px-4 py-3 text-left font-medium">Slug</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                  <th className="px-4 py-3 text-left font-medium">Updated</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {pages.map((page) => (
                  <tr key={page.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 font-medium">{page.title}</td>
                    <td className="px-4 py-3 text-muted-foreground">/{page.slug}</td>
                    <td className="px-4 py-3">
                      <Badge variant={statusVariant[page.status]}>{page.status}</Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(page.updatedAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/admin/pages/${page.id}/edit`}><Pencil className="h-4 w-4" /></Link>
                        </Button>
                        <DeleteConfirmDialog
                          title={`Delete "${page.title}"?`}
                          description="This will permanently delete the page."
                          onConfirm={async () => {
                            "use server";
                            await deletePage(page.id);
                            revalidatePath("/admin/pages");
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
  );
}
