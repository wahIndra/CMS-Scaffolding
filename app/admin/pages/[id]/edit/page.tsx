import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/admin/Breadcrumbs";
import { PageForm } from "@/components/admin/PageForm";
import { getPageById } from "@/lib/services/page.service";

export const metadata: Metadata = { title: "Edit Page" };

interface Props {
  params: { id: string };
}

export default async function EditPageAdminPage({ params }: Props) {
  const page = await getPageById(params.id);
  if (!page) notFound();

  return (
    <div className="space-y-6">
      <Breadcrumbs crumbs={[{ label: "Pages", href: "/admin/pages" }, { label: `Edit: ${page.title}` }]} />
      <h1 className="text-3xl font-bold tracking-tight">Edit Page</h1>
      <PageForm
        mode="edit"
        defaultValues={{
          id: page.id,
          title: page.title,
          slug: page.slug,
          content: page.content,
          featuredImage: page.featuredImage ?? "",
          status: page.status,
          metaTitle: page.metaTitle ?? "",
          metaDescription: page.metaDescription ?? "",
        }}
      />
    </div>
  );
}
