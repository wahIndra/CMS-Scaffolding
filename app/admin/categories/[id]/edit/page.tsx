import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/admin/Breadcrumbs";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { getCategoryById } from "@/lib/services/category.service";
import { requirePermission } from "@/lib/permissions";

export const metadata: Metadata = { title: "Edit Category" };

interface PageProps {
  params: { id: string };
}

export default async function EditCategoryPage({ params }: PageProps) {
  await requirePermission("manage:content");
  const category = await getCategoryById(params.id);
  if (!category) notFound();

  return (
    <div className="space-y-6">
      <Breadcrumbs
        crumbs={[
          { label: "Categories", href: "/admin/categories" },
          { label: `Edit: ${category.name}` },
        ]}
      />
      <h1 className="text-3xl font-bold tracking-tight">Edit Category</h1>
      <div className="max-w-lg">
        <CategoryForm
          mode="edit"
          defaultValues={{
            id: category.id,
            name: category.name,
            slug: category.slug,
            description: category.description ?? "",
          }}
        />
      </div>
    </div>
  );
}
