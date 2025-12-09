import { Room, RoomStatus } from "generated/prisma";
import { faker } from "@faker-js/faker";

export const generateRoomForSeed = (ownerId: number) => {
  const roomForSeed: Omit<
    Room,
    | "id"
    | "createdAt"
    | "updatedAt"
    | "bookings"
    | "owner"
  > = {
    ownerId,
    name: `${faker.word.adjective()} ${faker.word.noun()} Room`, 
    price: faker.number.int({ min: 30, max: 500 }),
    capacity: faker.number.int({ min: 1, max: 6 }),
    status: RoomStatus.ACTIVE, 
  };

  return roomForSeed;
};
