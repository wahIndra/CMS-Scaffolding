import { prisma } from "@/lib/db";

export async function logActivity(
  action: string,
  entity: string,
  options?: { entityId?: string; detail?: string; userId?: string }
) {
  await prisma.activityLog.create({
    data: {
      action,
      entity,
      entityId: options?.entityId,
      detail: options?.detail,
      userId: options?.userId,
    },
  });
}

export async function getRecentActivity(limit = 10) {
  return prisma.activityLog.findMany({
    take: limit,
    orderBy: { createdAt: "desc" },
    include: { user: { select: { id: true, name: true } } },
  });
}
