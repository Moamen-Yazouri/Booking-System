import { EnvVariables } from '.';
import { AuthResponseDTO } from 'src/modules/auth/dto/auth.dto';

declare global {
  namespace NodeJS {
    interface ProcessEnv extends EnvVariables {}
    interface BigInt {
      toJSON(): string;
    }
  }
  namespace Express {
    interface Request {
      user?: AuthResponseDTO;
    }
  }
}
