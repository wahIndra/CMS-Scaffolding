"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categorySchema, type CategoryInput } from "@/lib/validators/category";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/ui/form-field";
import { useFormSubmit } from "@/lib/hooks/use-form-submit";
import { toSlug } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface Props {
  defaultValues?: Partial<CategoryInput> & { id?: string };
  mode: "create" | "edit";
}

export function CategoryForm({ defaultValues, mode }: Readonly<Props>) {
  const router = useRouter();

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<CategoryInput>({
    resolver: zodResolver(categorySchema),
    defaultValues,
  });

  const { saving, submit } = useFormSubmit({
    url: mode === "create" ? "/api/admin/categories" : `/api/admin/categories/${defaultValues?.id}`,
    method: mode === "create" ? "POST" : "PATCH",
    successMessage: mode === "create" ? "Category created!" : "Category updated!",
    redirectTo: "/admin/categories",
  });

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <FormField id="name" label="Name" required error={errors.name?.message}>
        <Input
          id="name"
          placeholder="Category name"
          {...register("name")}
          onChange={(e) => {
            register("name").onChange(e);
            if (mode === "create") setValue("slug", toSlug(e.target.value));
          }}
        />
      </FormField>
      <FormField id="slug" label="Slug" required error={errors.slug?.message}>
        <Input id="slug" placeholder="category-slug" {...register("slug")} />
      </FormField>
      <FormField id="description" label="Description">
        <Textarea id="description" rows={3} placeholder="Optional description" {...register("description")} />
      </FormField>
      <div className="flex gap-3">
        <Button type="submit" disabled={saving}>
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {mode === "create" ? "Add Category" : "Save Changes"}
        </Button>
        {mode === "edit" && (
          <Button type="button" variant="outline" onClick={() => router.push("/admin/categories")}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
