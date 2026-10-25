import "server-only";
import { prisma } from "./db";

export interface AddressInput {
  name: string;
  phone: string;
  line: string;
  city: string;
  state: string;
  postalCode: string;
}

export async function getUserAddresses(userId: number) {
  return prisma.address.findMany({
    where: { userId },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });
}

export async function createAddress(
  userId: number,
  input: AddressInput,
  makeDefault = false,
): Promise<void> {
  const count = await prisma.address.count({ where: { userId } });
  const isDefault = makeDefault || count === 0; // first address is the default
  if (isDefault) {
    await prisma.address.updateMany({ where: { userId }, data: { isDefault: false } });
  }
  await prisma.address.create({ data: { userId, ...input, isDefault } });
}

export async function updateAddress(
  userId: number,
  id: number,
  input: AddressInput,
): Promise<void> {
  // Scope to the owner so one user can't edit another's address.
  await prisma.address.updateMany({ where: { id, userId }, data: input });
}

export async function deleteAddress(userId: number, id: number): Promise<void> {
  await prisma.address.deleteMany({ where: { id, userId } });
}

export async function setDefaultAddress(userId: number, id: number): Promise<void> {
  await prisma.address.updateMany({ where: { userId }, data: { isDefault: false } });
  await prisma.address.updateMany({ where: { id, userId }, data: { isDefault: true } });
}
