import { prisma } from "@/lib/db";
import type { PostInput } from "@/lib/validators/post";

const postSelect = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  content: true,
  featuredImage: true,
  status: true,
  publishedAt: true,
  metaTitle: true,
  metaDescription: true,
  ogImage: true,
  createdAt: true,
  updatedAt: true,
  author: { select: { id: true, name: true } },
  category: { select: { id: true, name: true, slug: true } },
  tags: { select: { tag: { select: { id: true, name: true, slug: true } } } },
};

export async function getPublishedPosts(page = 1, pageSize = 10, categorySlug?: string) {
  const skip = (page - 1) * pageSize;
  const where = {
    status: "PUBLISHED",
    ...(categorySlug ? { category: { slug: categorySlug } } : {}),
  };

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { publishedAt: "desc" },
      select: postSelect,
    }),
    prisma.post.count({ where }),
  ]);

  return { posts, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}

export async function getPublishedPostBySlug(slug: string) {
  return prisma.post.findFirst({
    where: { slug, status: "PUBLISHED" },
    select: postSelect,
  });
}

export async function getAllPosts(page = 1, pageSize = 20) {
  const skip = (page - 1) * pageSize;
  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      skip,
      take: pageSize,
      orderBy: { updatedAt: "desc" },
      select: postSelect,
    }),
    prisma.post.count(),
  ]);
  return { posts, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}

export async function getPostById(id: string) {
  return prisma.post.findUnique({ where: { id }, select: postSelect });
}

export async function createPost(data: PostInput, authorId: string) {
  const { tagIds, ...rest } = data;
  return prisma.post.create({
    data: {
      ...rest,
      authorId,
      ...(tagIds?.length
        ? { tags: { create: tagIds.map((tagId) => ({ tagId })) } }
        : {}),
    },
    select: postSelect,
  });
}

export async function updatePost(id: string, data: Partial<PostInput>) {
  const { tagIds, ...rest } = data;

  // Replace tag relations when provided
  const tagsUpdate = tagIds !== undefined
    ? {
        tags: {
          deleteMany: {},
          create: tagIds.map((tagId) => ({ tagId })),
        },
      }
    : {};

  return prisma.post.update({
    where: { id },
    data: { ...rest, ...tagsUpdate },
    select: postSelect,
  });
}

export async function deletePost(id: string) {
  return prisma.post.delete({ where: { id } });
}

export async function publishPost(id: string) {
  return prisma.post.update({
    where: { id },
    data: { status: "PUBLISHED", publishedAt: new Date() },
    select: postSelect,
  });
}

export async function unpublishPost(id: string) {
  return prisma.post.update({
    where: { id },
    data: { status: "DRAFT" },
    select: postSelect,
  });
}
