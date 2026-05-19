"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { siteSettingsSchema, type SiteSettingsInput } from "@/lib/validators/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

interface Props {
  defaultValues: Record<string, string>;
}

export function SiteSettingsForm({ defaultValues }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<SiteSettingsInput>({
    resolver: zodResolver(siteSettingsSchema),
    defaultValues: defaultValues as Partial<SiteSettingsInput>,
  });

  const onSubmit = async (data: SiteSettingsInput) => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to save settings");
      }
      toast({ title: "Settings saved!" });
      router.refresh();
    } catch (e: unknown) {
      toast({ title: "Error", description: (e as Error).message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
      <Card>
        <CardHeader><CardTitle>General</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="site_name">Site Name *</Label>
            <Input id="site_name" {...register("site_name")} />
            {errors.site_name && <p className="text-xs text-destructive">{errors.site_name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="site_description">Site Description</Label>
            <Textarea id="site_description" rows={3} {...register("site_description")} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="logo_url">Logo URL</Label>
              <Input id="logo_url" placeholder="https://..." {...register("logo_url")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="favicon_url">Favicon URL</Label>
              <Input id="favicon_url" placeholder="https://..." {...register("favicon_url")} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="primary_color">Primary Color</Label>
            <Input id="primary_color" placeholder="#2563eb" {...register("primary_color")} />
            {errors.primary_color && <p className="text-xs text-destructive">{errors.primary_color.message}</p>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Contact Information</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="contact_email">Contact Email</Label>
            <Input id="contact_email" type="email" {...register("contact_email")} />
            {errors.contact_email && <p className="text-xs text-destructive">{errors.contact_email.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact_phone">Phone Number</Label>
            <Input id="contact_phone" {...register("contact_phone")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact_address">Address</Label>
            <Textarea id="contact_address" rows={2} {...register("contact_address")} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Social Media</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: "social_twitter", label: "Twitter" },
            { key: "social_linkedin", label: "LinkedIn" },
            { key: "social_facebook", label: "Facebook" },
            { key: "social_instagram", label: "Instagram" },
          ].map(({ key, label }) => (
            <div key={key} className="space-y-2">
              <Label htmlFor={key}>{label}</Label>
              <Input id={key} placeholder="https://..." {...register(key as keyof SiteSettingsInput)} />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>SEO Defaults</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="seo_default_title">Default Meta Title</Label>
            <Input id="seo_default_title" {...register("seo_default_title")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="seo_default_description">Default Meta Description</Label>
            <Textarea id="seo_default_description" rows={3} {...register("seo_default_description")} />
          </div>
        </CardContent>
      </Card>

      <Button type="submit" size="lg" disabled={saving}>
        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Save Settings
      </Button>
    </form>
  );
}
