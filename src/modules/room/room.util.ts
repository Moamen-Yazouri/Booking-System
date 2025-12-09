import { Prisma, UserRole } from 'generated/prisma';

export const buildWhere = (role: UserRole, roomId: number, userId: number) => {
  const where: Prisma.RoomWhereUniqueInput = { id: roomId };

  if (role !== 'ADMIN') {
    where.ownerId = userId;
  }

  return where;
};
