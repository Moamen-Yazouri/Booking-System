// prisma/room-user.seed.ts (or prisma/seed.ts)
import { faker } from "@faker-js/faker";
import { PrismaClient } from 'generated/prisma/client';
import * as argon from "argon2";

import { generateUserForSeed } from "./user.seeds";
import { generateRoomForSeed } from "./room.seeds";
import { CreateUserDTO } from "src/modules/user/dto/user.dto";

const prisma = new PrismaClient();

const main = async () => {
  // Clear existing data (order matters if you have FKs)
  // If you have bookings, delete them first:
  // await prisma.booking.deleteMany({});
  await prisma.room.deleteMany({});
  await prisma.user.deleteMany({});

  // Passwords
  const hashedAdminPass = await argon.hash("123456");
  const hashedOwnerPass = await argon.hash("123456");

  // Base admin
  const adminForSeed: CreateUserDTO = {
    email: "admin@email.com",
    name: "Admin User",
    password: hashedAdminPass,
    role: "ADMIN", // make sure this matches your enum
  };

  // A few explicit owners
  const ownersForSeed: CreateUserDTO[] = Array.from({ length: 3 }).map(() => ({
    email: faker.internet.email(),
    name: faker.person.fullName(),
    password: hashedOwnerPass,
    role: "OWNER", // ensure "OWNER" exists in your role enum
  }));

  // Random users (GUEST / ADMIN from your generator)
  const randomUsersForSeed = faker.helpers.multiple(generateUserForSeed, {
    count: 10,
  });

  const usersForSeed: CreateUserDTO[] = [
    adminForSeed,
    ...ownersForSeed,
    ...randomUsersForSeed,
  ];

  await prisma.user.createMany({
    data: usersForSeed,
  });

  // Fetch owners to attach rooms to them
  const owners = await prisma.user.findMany({
    where: {
      role: "OWNER",
    },
  });

  for (const owner of owners) {
    const roomsForSeed = faker.helpers.multiple(
      () => generateRoomForSeed(owner.id),
      { count: 5 },
    );

    await prisma.room.createMany({
      data: roomsForSeed,
    });
  }

  console.log("Database seeded successfully!");
};

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

export default main;
