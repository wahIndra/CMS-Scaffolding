import { prisma } from "@/lib/db";
import type { SiteSettingsInput } from "@/lib/validators/settings";

export async function getAllSettings(): Promise<Record<string, string>> {
  const rows = await prisma.siteSetting.findMany();
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
}

export async function getSetting(key: string): Promise<string | null> {
  const row = await prisma.siteSetting.findUnique({ where: { key } });
  return row?.value ?? null;
}

export async function updateSettings(data: SiteSettingsInput): Promise<void> {
  const entries = Object.entries(data) as [string, string][];
  await Promise.all(
    entries.map(([key, value]) =>
      prisma.siteSetting.upsert({
        where: { key },
        update: { value: value ?? "" },
        create: { key, value: value ?? "" },
      })
    )
  );
}
