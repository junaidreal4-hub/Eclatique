import "server-only";
import { prisma } from "./db";

export interface Reel {
  id: number;
  videoUrl: string;
  sortOrder: number;
}

export async function getReels(): Promise<Reel[]> {
  const rows = await prisma.reel.findMany({
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
  });
  return rows.map((r) => ({ id: r.id, videoUrl: r.videoUrl, sortOrder: r.sortOrder }));
}

export async function addReel(videoUrl: string): Promise<void> {
  const max = await prisma.reel.aggregate({ _max: { sortOrder: true } });
  const nextOrder = (max._max.sortOrder ?? -1) + 1;
  await prisma.reel.create({ data: { videoUrl, sortOrder: nextOrder } });
}

export async function deleteReel(id: number): Promise<void> {
  await prisma.reel.delete({ where: { id } });
}

export async function updateReelOrder(id: number, sortOrder: number): Promise<void> {
  await prisma.reel.update({ where: { id }, data: { sortOrder } });
}
