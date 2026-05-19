"use client";

import { useRouter } from "next/navigation";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUserSchema, updateUserSchema, type UpdateUserInput } from "@/lib/validators/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField } from "@/components/ui/form-field";
import { useFormSubmit } from "@/lib/hooks/use-form-submit";
import { Loader2 } from "lucide-react";

type Mode = "create" | "edit";

// Superset of both create and edit schemas so all fields are typed without union narrowing issues
type UserFormData = {
  name?: string;
  email?: string;
  password?: string;
  role?: "SUPER_ADMIN" | "ADMIN" | "EDITOR" | "VIEWER";
  status?: "ACTIVE" | "INACTIVE" | "SUSPENDED";
};

interface Props {
  mode: Mode;
  userId?: string;
  defaultValues?: Partial<UpdateUserInput & { email?: string }>;
}

export function UserForm({ mode, userId, defaultValues }: Readonly<Props>) {
  const router = useRouter();
  const schema = mode === "create" ? createUserSchema : updateUserSchema;

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<UserFormData>({
    resolver: zodResolver(schema) as Resolver<UserFormData>,
    defaultValues: defaultValues ?? {},
  });

  const { saving, submit } = useFormSubmit({
    url: mode === "create" ? "/api/admin/users" : `/api/admin/users/${userId}`,
    method: mode === "create" ? "POST" : "PATCH",
    successMessage: mode === "create" ? "User created!" : "User updated!",
    redirectTo: "/admin/users",
  });

  return (
    <form onSubmit={handleSubmit(submit)} className="max-w-lg space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{mode === "create" ? "Create User" : "Edit User"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField id="name" label="Full Name" required error={errors.name?.message}>
            <Input id="name" {...register("name")} />
          </FormField>

          {mode === "create" && (
            <FormField id="email" label="Email" required error={errors.email?.message}>
              <Input id="email" type="email" {...register("email")} />
            </FormField>
          )}

          {mode === "edit" && defaultValues?.email && (
            <p className="text-sm text-muted-foreground">Email: <strong>{defaultValues.email}</strong></p>
          )}

          <FormField
            id="password"
            label={mode === "create" ? "Password" : "New Password (leave blank to keep current)"}
            required={mode === "create"}
            error={errors.password?.message}
          >
            <Input id="password" type="password" {...register("password")} />
          </FormField>

          <div className="space-y-2">
            <Label>Role *</Label>
            <Select
              defaultValue={defaultValues?.role ?? "EDITOR"}
              onValueChange={(val) => setValue("role", val as UserFormData["role"])}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="EDITOR">Editor</SelectItem>
                <SelectItem value="VIEWER">Viewer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {mode === "edit" && (
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                defaultValue={defaultValues?.status ?? "ACTIVE"}
                onValueChange={(val) => setValue("status", val as UserFormData["status"])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                  <SelectItem value="SUSPENDED">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button type="submit" disabled={saving}>
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {mode === "create" ? "Create User" : "Save Changes"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/users")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
