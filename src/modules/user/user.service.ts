import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateUserDTO } from './dto/user.dto';


@Injectable()
export class UserService {
  constructor(private prismaClient: DatabaseService) {}
  create(data: CreateUserDTO) {
      return this.prismaClient.user.create({
        data
      });
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
