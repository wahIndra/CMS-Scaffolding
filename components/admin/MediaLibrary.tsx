"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Upload, Copy, Trash2, ImageIcon, FileIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { formatFileSize, isImage } from "@/lib/utils";

interface MediaItem {
  id: string;
  url: string;
  originalName: string;
  mimeType: string;
  size: number;
  createdAt: Date;
}

interface Props {
  initialItems: MediaItem[];
}

export function MediaLibrary({ initialItems }: Props) {
  const [items, setItems] = useState(initialItems);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    Array.from(files).forEach((f) => formData.append("files", f));

    try {
      const res = await fetch("/api/admin/media", { method: "POST", body: formData });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Upload failed");
      }
      const { data } = await res.json();
      setItems((prev) => [...data, ...prev]);
      toast({ title: `${data.length} file(s) uploaded!` });
    } catch (e: unknown) {
      toast({ title: "Upload failed", description: (e as Error).message, variant: "destructive" });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/media/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setItems((prev) => prev.filter((i) => i.id !== id));
      toast({ title: "File deleted" });
    } catch (e: unknown) {
      toast({ title: "Error", description: (e as Error).message, variant: "destructive" });
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(`${window.location.origin}${url}`);
    toast({ title: "URL copied to clipboard!" });
  };

  return (
    <div className="space-y-6">
      {/* Upload button */}
      <div className="flex items-center gap-4">
        <Button onClick={() => fileInputRef.current?.click()} disabled={uploading}>
          {uploading ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Uploading...</>
          ) : (
            <><Upload className="mr-2 h-4 w-4" />Upload Files</>
          )}
        </Button>
        <p className="text-sm text-muted-foreground">Max 10 MB · Images and PDFs allowed</p>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          multiple
          accept="image/*,application/pdf"
          onChange={handleUpload}
        />
      </div>

      {/* Grid */}
      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-20 text-muted-foreground border-2 border-dashed rounded-lg">
          <Upload className="h-10 w-10 opacity-30" />
          <p>No files uploaded yet.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {items.map((item) => (
            <Card key={item.id} className="group overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-square bg-muted flex items-center justify-center overflow-hidden">
                {isImage(item.mimeType) ? (
                  <img
                    src={item.url}
                    alt={item.originalName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <FileIcon className="h-10 w-10 text-muted-foreground" />
                )}
              </div>
              <CardContent className="p-3 space-y-2">
                <p className="text-xs font-medium truncate">{item.originalName}</p>
                <p className="text-xs text-muted-foreground">{formatFileSize(item.size)}</p>
                <div className="flex gap-1.5">
                  <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => copyUrl(item.url)}>
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7 text-destructive hover:bg-destructive hover:text-white"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
