import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/admin/Breadcrumbs";
import { MediaLibrary } from "@/components/admin/MediaLibrary";
import { getAllMedia } from "@/lib/services/media.service";

export const metadata: Metadata = { title: "Media Library" };

export default async function MediaAdminPage() {
  const { items } = await getAllMedia(1, 100);

  return (
    <div className="space-y-6">
      <Breadcrumbs crumbs={[{ label: "Media" }]} />
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Media Library</h1>
        <p className="text-muted-foreground">{items.length} files</p>
      </div>
      <MediaLibrary initialItems={items} />
    </div>
  );
}
