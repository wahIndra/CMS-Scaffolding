import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/admin/Breadcrumbs";
import { PostForm } from "@/components/admin/PostForm";
import { getPostById } from "@/lib/services/post.service";
import { getAllCategories } from "@/lib/services/category.service";

export const metadata: Metadata = { title: "Edit Post" };

interface Props {
  params: { id: string };
}

export default async function EditPostAdminPage({ params }: Props) {
  const [post, categories] = await Promise.all([
    getPostById(params.id),
    getAllCategories(),
  ]);

  if (!post) notFound();

  return (
    <div className="space-y-6">
      <Breadcrumbs crumbs={[{ label: "Posts", href: "/admin/posts" }, { label: `Edit: ${post.title}` }]} />
      <h1 className="text-3xl font-bold tracking-tight">Edit Post</h1>
      <PostForm
        mode="edit"
        categories={categories}
        defaultValues={{
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt ?? "",
          content: post.content,
          featuredImage: post.featuredImage ?? "",
          status: post.status,
          categoryId: post.category?.id ?? null,
          metaTitle: post.metaTitle ?? "",
          metaDescription: post.metaDescription ?? "",
        }}
      />
    </div>
  );
}
