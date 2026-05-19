import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/admin/Breadcrumbs";
import { SiteSettingsForm } from "@/components/admin/SiteSettingsForm";
import { getAllSettings } from "@/lib/services/settings.service";
import { requirePermission } from "@/lib/permissions";

export const metadata: Metadata = { title: "Site Settings" };

export default async function SettingsAdminPage() {
  await requirePermission("manage:content");
  const settings = await getAllSettings();

  return (
    <div className="space-y-6">
      <Breadcrumbs crumbs={[{ label: "Settings" }]} />
      <h1 className="text-3xl font-bold tracking-tight">Site Settings</h1>
      <SiteSettingsForm defaultValues={settings} />
    </div>
  );
}
