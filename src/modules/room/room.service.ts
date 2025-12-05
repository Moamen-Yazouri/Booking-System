import { Injectable } from '@nestjs/common';
import { UpdateRoomDto } from './dto/update-room.dto';
import { IPaginationQuery, IPaginationResult } from 'src/@types/pagination';
import { DatabaseService } from '../database/database.service';
import { AllRoomsDTO, CreateRoomDTO } from './dto/room.dto';

@Injectable()
export class RoomService {
  constructor(private prismaClient: DatabaseService) {}
  create(createRoomDto: CreateRoomDTO, ownerId: number) {
    return this.prismaClient.room.create({
      data: {
        ...createRoomDto,
        ownerId
      },
    })
  }
  //For the admin
  async findAll(query: IPaginationQuery): Promise<IPaginationResult<AllRoomsDTO>> {
    const allRooms = await this.prismaClient.$transaction(async (tx) => {
      const pagination = this.prismaClient.createPaginationForPrisma(query);
      const roomsPaginated = await tx.room.findMany({
        include:{
          owner: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                }
          },
          _count: {
                select: {
                    bookings: true
                }
          }
        },
        ...pagination,
      });

      const total = await tx.room.count();

      const paginationMetadata = this.prismaClient.createPaginationMetaData(
        query.limit,
        query.page,
        total,
      );

      return {
        data: roomsPaginated,
        meta: paginationMetadata
      }
    })
    return allRooms
  }

  async findAvailableWithFilter () {

  }
  findOne(id: number) {
    return `This action returns a #${id} room`;
  }

  update(id: number, updateRoomDto: UpdateRoomDto) {
    return `This action updates a #${id} room`;
  }

  remove(id: number) {
    return `This action removes a #${id} room`;
  }
}
