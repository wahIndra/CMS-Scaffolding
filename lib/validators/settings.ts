import { z } from "zod";

export const siteSettingsSchema = z.object({
  site_name: z.string().min(1, "Site name is required").max(100),
  site_description: z.string().max(300).optional().or(z.literal("")),
  contact_email: z.string().email("Invalid email").optional().or(z.literal("")),
  contact_phone: z.string().max(30).optional().or(z.literal("")),
  contact_address: z.string().max(300).optional().or(z.literal("")),
  social_twitter: z.string().url().optional().or(z.literal("")),
  social_linkedin: z.string().url().optional().or(z.literal("")),
  social_facebook: z.string().url().optional().or(z.literal("")),
  social_instagram: z.string().url().optional().or(z.literal("")),
  seo_default_title: z.string().max(70).optional().or(z.literal("")),
  seo_default_description: z.string().max(160).optional().or(z.literal("")),
  primary_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color").optional().or(z.literal("")),
  logo_url: z.string().url().optional().or(z.literal("")),
  favicon_url: z.string().url().optional().or(z.literal("")),
});

export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;
