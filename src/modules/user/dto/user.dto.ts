import { User } from "generated/prisma/client";




export type CreateUserDTO = Pick<User, 'email' | 'password' | 'name' | 'role'>;

export type UpdateUserDTO = Partial<CreateUserDTO>;

export type UserForClient = Omit<User, 'password'>;
