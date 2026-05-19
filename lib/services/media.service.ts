import { prisma } from "@/lib/db";
import { writeFile, unlink } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const UPLOAD_DIR = process.env.UPLOAD_DIR ?? "./public/uploads";
const MAX_SIZE_BYTES = parseInt(process.env.UPLOAD_MAX_SIZE_MB ?? "10") * 1024 * 1024;
const ALLOWED_TYPES = (
  process.env.UPLOAD_ALLOWED_TYPES ?? "image/jpeg,image/png,image/webp,image/gif,application/pdf"
).split(",");

export interface UploadResult {
  id: string;
  url: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
}

export async function uploadFile(
  file: File,
  uploadedById?: string
): Promise<UploadResult> {
  if (file.size > MAX_SIZE_BYTES) {
    throw new Error(`File exceeds maximum size of ${process.env.UPLOAD_MAX_SIZE_MB ?? 10} MB`);
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error(`File type "${file.type}" is not allowed`);
  }

  const ext = path.extname(file.name);
  const safeName = `${randomUUID()}${ext}`;
  const absolutePath = path.join(process.cwd(), UPLOAD_DIR.replace("./", ""), safeName);

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(absolutePath, buffer);

  const publicUrl = `/uploads/${safeName}`;

  const media = await prisma.media.create({
    data: {
      filename: safeName,
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      url: publicUrl,
      uploadedById: uploadedById ?? null,
    },
  });

  return {
    id: media.id,
    url: media.url,
    filename: media.filename,
    originalName: media.originalName,
    mimeType: media.mimeType,
    size: media.size,
  };
}

export async function getAllMedia(page = 1, pageSize = 30) {
  const skip = (page - 1) * pageSize;
  const [items, total] = await Promise.all([
    prisma.media.findMany({ skip, take: pageSize, orderBy: { createdAt: "desc" } }),
    prisma.media.count(),
  ]);
  return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}

export async function getMediaById(id: string) {
  return prisma.media.findUnique({ where: { id } });
}

export async function deleteMedia(id: string) {
  const media = await prisma.media.findUnique({ where: { id } });
  if (!media) throw new Error("Media not found");

  // Remove physical file
  try {
    const absolutePath = path.join(process.cwd(), "public", media.url);
    await unlink(absolutePath);
  } catch {
    // File may already be missing — continue
  }

  return prisma.media.delete({ where: { id } });
}
