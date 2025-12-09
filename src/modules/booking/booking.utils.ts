import { Prisma } from "generated/prisma"
import { UserForClient } from "../user/dto/user.dto"

export const getCancelBookingWhere = (user: UserForClient, id: number): Prisma.BookingWhereUniqueInput => {
  const where: Prisma.BookingWhereUniqueInput = {id};

  if(user.role === "ADMIN") {
    return where;
  }

  if(user.role === "OWNER") {
    where.room = {
        ownerId: user.id
    };
  }

  if(user.role === "GUEST") {
    where.guestId = user.id;
  }

  return where;
}

export const getConfirmBookingWhere = (user: UserForClient, id: number): Prisma.BookingWhereUniqueInput => {
  const where: Prisma.BookingWhereUniqueInput = {id};

  if(user.role === "ADMIN") {
    return where;
  }

  if(user.role === "OWNER") {
    where.room = {
        ownerId: user.id
    };
  }

  return where;
}
