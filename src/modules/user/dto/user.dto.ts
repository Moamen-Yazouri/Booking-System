import { User } from "generated/prisma/client";

export type CreateUserDTO = Pick<User, "email" | "password" | "name">;

export type UpdateUserDTO = Partial<CreateUserDTO>;

export type UserResponseDTO = Omit<User, 'password'>;