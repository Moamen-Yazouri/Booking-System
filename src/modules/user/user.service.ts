import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateUserDTO, UpdateUserDTO } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(private prismaClient: DatabaseService) {}
  create(data: CreateUserDTO) {
    return this.prismaClient.user.create({
      data,
    });
  }

  findUserByEmail(email: string) {
    return this.prismaClient.user.findUnique({
      where: {
        email,
      },
    });
  }
  findAll() {
    return `This action returns all user`;
  }

  findById(id: number) {
    return this.prismaClient.user.findUniqueOrThrow({
      where: {
        id,
      },
    });
  }

  update(id: number, updateUserDto: UpdateUserDTO) {
    return this.prismaClient.user.update({
      where: {
        id,
      },
      data: updateUserDto,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
