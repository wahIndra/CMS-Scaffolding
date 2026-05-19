"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { pageSchema, type PageInput } from "@/lib/validators/page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { useFormSubmit } from "@/lib/hooks/use-form-submit";
import { toSlug } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface Props {
  defaultValues?: Partial<PageInput> & { id?: string };
  mode: "create" | "edit";
}

export function PageForm({ defaultValues, mode }: Readonly<Props>) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PageInput>({
    resolver: zodResolver(pageSchema),
    defaultValues: { status: "DRAFT", ...defaultValues },
  });

  const { saving, submit } = useFormSubmit({
    url: mode === "create" ? "/api/admin/pages" : `/api/admin/pages/${defaultValues?.id}`,
    method: mode === "create" ? "POST" : "PATCH",
    successMessage: mode === "create" ? "Page created!" : "Page updated!",
    redirectTo: "/admin/pages",
  });

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">

        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle>Content</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <FormField id="title" label="Title" required error={errors.title?.message}>
                <Input
                  id="title"
                  placeholder="Page title"
                  {...register("title")}
                  onChange={(e) => {
                    register("title").onChange(e);
                    if (mode === "create") setValue("slug", toSlug(e.target.value), { shouldValidate: true });
                  }}
                />
              </FormField>
              <FormField id="slug" label="Slug" required error={errors.slug?.message}>
                <Input id="slug" placeholder="page-slug" {...register("slug")} />
              </FormField>
              <FormField id="content" label="Content" required error={errors.content?.message}>
                <Textarea id="content" rows={16} placeholder="Page content (HTML supported)" {...register("content")} />
              </FormField>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>SEO</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <FormField
                id="metaTitle"
                label={<>Meta Title <span className="text-muted-foreground text-xs">(max 70)</span></>}
              >
                <Input id="metaTitle" placeholder="SEO title" {...register("metaTitle")} />
              </FormField>
              <FormField
                id="metaDescription"
                label={<>Meta Description <span className="text-muted-foreground text-xs">(max 160)</span></>}
              >
                <Textarea id="metaDescription" rows={3} placeholder="SEO description" {...register("metaDescription")} />
              </FormField>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Publish</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <FormField label="Status">
                <Select
                  defaultValue={defaultValues?.status ?? "DRAFT"}
                  onValueChange={(v) => setValue("status", v as PageInput["status"])}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="PUBLISHED">Published</SelectItem>
                    <SelectItem value="ARCHIVED">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1" disabled={saving}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {mode === "create" ? "Create Page" : "Save Changes"}
                </Button>
                {mode === "edit" && (
                  <Button type="button" variant="outline" onClick={() => router.push("/admin/pages")}>
                    Cancel
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Featured Image</CardTitle></CardHeader>
            <CardContent>
              <Input placeholder="https://..." {...register("featuredImage")} />
              <p className="text-xs text-muted-foreground mt-2">Enter image URL or upload via Media Library.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
