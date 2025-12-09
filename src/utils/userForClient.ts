import { User } from 'generated/prisma/client';
import { UserForClient } from 'src/modules/user/dto/user.dto';
import { removeFields } from './object.utils';

export const userForClient = (user: User): UserForClient => {
  return removeFields(user, ['password']);
};
