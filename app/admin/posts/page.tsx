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
import { getAllPosts, deletePost } from "@/lib/services/post.service";
import { formatDate } from "@/lib/utils";
import { ContentStatus } from "@prisma/client";

export const metadata: Metadata = { title: "Posts" };

const statusVariant: Record<ContentStatus, "success" | "warning" | "secondary"> = {
  PUBLISHED: "success",
  DRAFT: "warning",
  ARCHIVED: "secondary",
};

export default async function PostsAdminPage() {
  const { posts, total } = await getAllPosts();

  return (
    <div className="space-y-6">
      <Breadcrumbs crumbs={[{ label: "Posts" }]} />

      <AdminPageHeader
        title="Posts"
        total={total}
        countLabel="total posts"
        newHref="/admin/posts/new"
        newLabel="New Post"
      />

      <Card>
        <CardContent className="p-0">
          {posts.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16 text-muted-foreground">
              <p>No posts yet.</p>
              <Button asChild size="sm"><Link href="/admin/posts/new">Write your first post</Link></Button>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/30">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Title</th>
                  <th className="px-4 py-3 text-left font-medium">Category</th>
                  <th className="px-4 py-3 text-left font-medium">Author</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                  <th className="px-4 py-3 text-left font-medium">Published</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 font-medium max-w-xs truncate">{post.title}</td>
                    <td className="px-4 py-3 text-muted-foreground">{post.category?.name ?? "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{post.author.name}</td>
                    <td className="px-4 py-3">
                      <Badge variant={statusVariant[post.status]}>{post.status}</Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(post.publishedAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/admin/posts/${post.id}/edit`}><Pencil className="h-4 w-4" /></Link>
                        </Button>
                        <DeleteConfirmDialog
                          title={`Delete "${post.title}"?`}
                          description="This will permanently delete the post and all its data."
                          onConfirm={async () => {
                            "use server";
                            await deletePost(post.id);
                            revalidatePath("/admin/posts");
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
