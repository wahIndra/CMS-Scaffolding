"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postSchema, type PostInput } from "@/lib/validators/post";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { useFormSubmit } from "@/lib/hooks/use-form-submit";
import { toSlug } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

interface Props {
  defaultValues?: Partial<PostInput> & { id?: string };
  mode: "create" | "edit";
  categories: Category[];
}

export function PostForm({ defaultValues, mode, categories }: Readonly<Props>) {

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PostInput>({
    resolver: zodResolver(postSchema),
    defaultValues: { status: "DRAFT", ...defaultValues },
  });

  const { saving, submit } = useFormSubmit({
    url: mode === "create" ? "/api/admin/posts" : `/api/admin/posts/${defaultValues?.id}`,
    method: mode === "create" ? "POST" : "PATCH",
    successMessage: mode === "create" ? "Post created!" : "Post updated!",
    redirectTo: "/admin/posts",
  });

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle>Content</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <FormField id="title" label="Title" required error={errors.title?.message}>
                <Input
                  id="title"
                  placeholder="Post title"
                  {...register("title")}
                  onChange={(e) => {
                    register("title").onChange(e);
                    if (mode === "create") setValue("slug", toSlug(e.target.value), { shouldValidate: true });
                  }}
                />
              </FormField>
              <FormField id="slug" label="Slug" required error={errors.slug?.message}>
                <Input id="slug" placeholder="post-slug" {...register("slug")} />
              </FormField>
              <FormField id="excerpt" label="Excerpt">
                <Textarea id="excerpt" rows={3} placeholder="Short summary..." {...register("excerpt")} />
              </FormField>
              <FormField id="content" label="Content" required error={errors.content?.message}>
                <Textarea id="content" rows={16} placeholder="Post content (HTML supported)" {...register("content")} />
              </FormField>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>SEO</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <FormField id="metaTitle" label="Meta Title">
                <Input id="metaTitle" placeholder="SEO title" {...register("metaTitle")} />
              </FormField>
              <FormField id="metaDescription" label="Meta Description">
                <Textarea id="metaDescription" rows={3} placeholder="SEO description" {...register("metaDescription")} />
              </FormField>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Publish</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <FormField label="Status">
                <Select
                  defaultValue={defaultValues?.status ?? "DRAFT"}
                  onValueChange={(v) => setValue("status", v as PostInput["status"])}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="PUBLISHED">Published</SelectItem>
                    <SelectItem value="ARCHIVED">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
              <Button type="submit" className="w-full" disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {mode === "create" ? "Create Post" : "Save Changes"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Category</CardTitle></CardHeader>
            <CardContent>
              <Select
                defaultValue={defaultValues?.categoryId ?? "none"}
                onValueChange={(v) => setValue("categoryId", v === "none" ? null : v)}
              >
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No category</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Featured Image</CardTitle></CardHeader>
            <CardContent>
              <Input placeholder="https://..." {...register("featuredImage")} />
              <p className="text-xs text-muted-foreground mt-2">Enter image URL or use Media Library.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
