import { Injectable } from '@nestjs/common';
import { IPaginationQuery, IPaginationResult } from 'src/@types/pagination';
import { DatabaseService } from '../database/database.service';
import { AllRoomsDTO, AvailableRoomsDTO, CreateRoomDTO, UpdateRoomDTO } from './dto/room.dto';
import { IAvailabelQuery } from './types';
import { BookingStatus, Prisma, RoomStatus } from 'generated/prisma';
import { UserForClient } from '../user/dto/user.dto';
import { buildWhere } from './room.util';

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

  async findAvailableWithFilter (query: IAvailabelQuery): Promise<IPaginationResult<AvailableRoomsDTO>> {
    const availableRooms = await this.prismaClient.$transaction(async(tx) => {
      const {limit, page, ...filtering } = query
      const pagination = this.prismaClient.createPaginationForPrisma({
        limit,
        page
      }); 

      const where = this.generateWhereForAvailable(filtering);

      const availableRoomsPaginated = await tx.room.findMany({
        where,
        ...pagination,
        select: {
          id: true,
          name: true,
          price: true,
          capacity: true,
          status: true,
        }
      });

      const total = await tx.room.count();

      const meta = this.prismaClient.createPaginationMetaData(
        limit,
        page,
        total,
      );
      
      return {
        data: availableRoomsPaginated,
        meta
      }
    });

    return availableRooms;
  }

  findOne(id: number) {
    return this.prismaClient.room.findUnique({
      where: {
        id
      },
      include: {
        bookings: true,
        owner: {
          select: {
              id: true,
              name: true,
              email: true,
          }
        },
      }
    })
  }

  update(user: UserForClient, roomId: number, data: UpdateRoomDTO) {
    const where = buildWhere(user.role, roomId, user.id)
    return this.prismaClient.room.update({
      data,
      where,
      include: {
        bookings: true
      }

    })
  }

  remove(user: UserForClient, id: number) {
    const where = buildWhere(user.role, id, user.id);
    return this.prismaClient.room.delete({
      where,
    });
  }

  private generateWhereForAvailable(query: Omit<IAvailabelQuery, 'limit' | 'page'>) {
    const where: Prisma.RoomWhereInput = {status: RoomStatus.ACTIVE}

    if(query.interval) {
      where.bookings = {
        none: {
          status: BookingStatus.CANCELLED,
          NOT: {
            OR: [
              { checkOut: { lte: query.interval.checkIn } },
              { checkIn: { gte: query.interval.checkOut } },
            ],
          },
        }
      }
    }

    if(query.capacityRange) {
      where.capacity = {
        gte: query.capacityRange.minCapacity ?? undefined,
        lte: query.capacityRange.maxCapacity ?? undefined,
      }
    }

    if(query.priceRange) {
      where.price = {
        gte: query.priceRange.minPrice ?? undefined,
        lte: query.priceRange.maxPrice ?? undefined,
      }
    }

    return where;
  }
}
