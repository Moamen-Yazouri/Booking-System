import z, { ZodType } from "zod";
import { CreateUserDTO } from "../dto/user.dto";

export const userValidationSchmea = z.object({
    name: z.string().min(3).max(100),
    email: z.email().toLowerCase(),
    password: z.string().min(6).max(100),
    role: z.enum(['OWNER', 'ADMIN', 'GUEST']),

}) satisfies ZodType<CreateUserDTO>;