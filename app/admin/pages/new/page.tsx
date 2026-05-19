import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/admin/Breadcrumbs";
import { PageForm } from "@/components/admin/PageForm";

export const metadata: Metadata = { title: "New Page" };

export default function NewPageAdminPage() {
  return (
    <div className="space-y-6">
      <Breadcrumbs crumbs={[{ label: "Pages", href: "/admin/pages" }, { label: "New Page" }]} />
      <h1 className="text-3xl font-bold tracking-tight">New Page</h1>
      <PageForm mode="create" />
    </div>
  );
}
