import { UserRole } from "generated/prisma/enums";
import { UserForClient } from "src/modules/user/dto/user.dto";

export interface EnvVariables {
    JWT_SECRET: string;
}

export interface IJWTPayload {
    sub: number;
    role: UserRole;
    email: string;
    name: string;
}

export type TUserForToken = Pick<UserForClient, "id" | "role" | "email" | "name">