import { prisma } from "@/lib/db";
import type { Page } from "@prisma/client";
import type { PageInput, UpdatePageInput } from "@/lib/validators/page";

export async function getPublishedPages(): Promise<Page[]> {
  return prisma.page.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getPublishedPageBySlug(slug: string): Promise<Page | null> {
  return prisma.page.findFirst({
    where: { slug, status: "PUBLISHED" },
  });
}

export async function getAllPages(page = 1, pageSize = 20) {
  const skip = (page - 1) * pageSize;
  const [pages, total] = await Promise.all([
    prisma.page.findMany({ skip, take: pageSize, orderBy: { updatedAt: "desc" } }),
    prisma.page.count(),
  ]);
  return { pages, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}

export async function getPageById(id: string): Promise<Page | null> {
  return prisma.page.findUnique({ where: { id } });
}

export async function createPage(data: PageInput): Promise<Page> {
  return prisma.page.create({ data });
}

export async function updatePage(id: string, data: Partial<PageInput>): Promise<Page> {
  return prisma.page.update({ where: { id }, data });
}

export async function deletePage(id: string): Promise<Page> {
  return prisma.page.delete({ where: { id } });
}

export async function publishPage(id: string): Promise<Page> {
  return prisma.page.update({
    where: { id },
    data: { status: "PUBLISHED" },
  });
}

export async function unpublishPage(id: string): Promise<Page> {
  return prisma.page.update({
    where: { id },
    data: { status: "DRAFT" },
  });
}
