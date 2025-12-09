import { userValidationSchmea } from 'src/modules/user/validation/user.validation';
import { SignInDTO } from '../dto/auth.dto';
import z, { ZodType } from 'zod';

export const signInValidationSchema = userValidationSchmea.pick({
  email: true,
  password: true,
}) satisfies ZodType<SignInDTO>;

export const signUpValidationSchema = userValidationSchmea.omit({
  role: true,
}).extend({
  role: z.enum(["GUEST", "OWNER"]).default("GUEST"),
});
