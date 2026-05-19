import { z } from "zod";

const statusEnum = z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]);

export const pageSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase and hyphen-separated"),
  content: z.string().min(1, "Content is required"),
  featuredImage: z.string().url().optional().or(z.literal("")),
  status: statusEnum.default("DRAFT"),
  metaTitle: z.string().max(70).optional().or(z.literal("")),
  metaDescription: z.string().max(160).optional().or(z.literal("")),
  ogImage: z.string().url().optional().or(z.literal("")),
});

export const updatePageSchema = pageSchema.partial().extend({
  id: z.string().cuid(),
});

export type PageInput = z.infer<typeof pageSchema>;
export type UpdatePageInput = z.infer<typeof updatePageSchema>;
