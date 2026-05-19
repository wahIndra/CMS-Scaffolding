import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/admin/Breadcrumbs";
import { PostForm } from "@/components/admin/PostForm";
import { getAllCategories } from "@/lib/services/category.service";

export const metadata: Metadata = { title: "New Post" };

export default async function NewPostAdminPage() {
  const categories = await getAllCategories();

  return (
    <div className="space-y-6">
      <Breadcrumbs crumbs={[{ label: "Posts", href: "/admin/posts" }, { label: "New Post" }]} />
      <h1 className="text-3xl font-bold tracking-tight">New Post</h1>
      <PostForm mode="create" categories={categories} />
    </div>
  );
}
