import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { AllBookingsResponseDTO, CreateBookingDTO } from './dto/booking.dto';
import { DatabaseService } from '../database/database.service';
import { IPaginationQuery, IPaginationResult } from 'src/@types/pagination';
import { Booking, Prisma } from 'generated/prisma';
import { UserForClient } from '../user/dto/user.dto';


@Injectable()
export class BookingService {
  constructor(private prismaClient: DatabaseService) {}
  create(data: CreateBookingDTO, guestId: number) {
    
    const { roomId, checkIn, checkOut } = data;
    
    const newRoom = this.prismaClient.$transaction(async (tx) => {
      const booingOverlap = await tx.booking.findFirst({
        where: {
          roomId: roomId,
          checkIn: {
            lte: checkOut,
          },
          checkOut: {
            gte: checkIn,
          },
        },
      });

      if (booingOverlap) {
        throw new ConflictException('Room is not available for these dates');
      }

      return await tx.booking.create({
        data: {
          guestId: guestId,
          roomId: data.roomId,
          checkIn: data.checkIn,
          checkOut: data.checkOut,

        },
      });
    });

    return newRoom;
  }

  async findAll(query: IPaginationQuery): Promise<IPaginationResult<AllBookingsResponseDTO>> {
    const allBookings = await this.prismaClient.$transaction(async(tx) => {
      const pagination =  this.prismaClient.createPaginationForPrisma(query);

      const bookings = await tx.booking.findMany({
        include: {
          room: true,
          guest: true
        },
        ...pagination
      });

      const total = await tx.booking.count();

      const meta = this.prismaClient.createPaginationMetaData(query.limit, query.limit, total);

      return {
        data: bookings,
        meta
      }
    });

    return allBookings;
  }

  findOne(id: number): Promise<AllBookingsResponseDTO> {
    return this.prismaClient.booking.findUniqueOrThrow({
      where: {
        id,
      },
      include: {
        guest: true,
        room: true,
      }
    })
  }

  async confirmBooking(id: number, user: UserForClient): Promise<Booking> {
    const confirmedBooking = await this.prismaClient.$transaction(async (tx) =>{
        const where = this.getConfirmBookingWhere(user, id);
        const booking = await tx.booking.findUniqueOrThrow({
          where
        });

        if(booking.status === "CANCELLED") {
          throw new ConflictException("This booking is canceld");
        }
        
        if(booking.status === "CONFIRMED") {
          throw new ConflictException("This booking is confirmed");
        }
 
        return await tx.booking.update({
          where: {
            id
          },
          data: {
            status: "CONFIRMED"
          }
        })
    })
    
    return confirmedBooking;
  }

  async cancleBooking(id: number, user: UserForClient): Promise<Booking> {
    const confirmedBooking = await this.prismaClient.$transaction(async (tx) =>{
      const where = this.getCancelBookingWhere(user, id);
    const booking = await tx.booking.findUniqueOrThrow({
      where,
    });

  const now = new Date();
  if (now >= booking.checkIn) {
    throw new BadRequestException(
      'You cannot cancel a booking after the check-in time',
    );
  }

    return await tx.booking.update({
      where: {
        id
      },
      data: {
        status: "CANCELLED"
      }
    })
  })
    
    return confirmedBooking;
  }


  private getCancelBookingWhere(user: UserForClient, id: number): Prisma.BookingWhereUniqueInput {
    const where: Prisma.BookingWhereUniqueInput = {id};
  
    if(user.role === "ADMIN") {
      return where;
    }
  
    if(user.role === "OWNER") {
      where.room = {
          ownerId: user.id
      };
    }
  
    if(user.role === "GUEST") {
      where.guestId = user.id;
    }
  
    return where;
  }

  getConfirmBookingWhere(user: UserForClient, id: number): Prisma.BookingWhereUniqueInput {
    const where: Prisma.BookingWhereUniqueInput = {id};

    if(user.role === "ADMIN") {
      return where;
    }

    if(user.role === "OWNER") {
      where.room = {
          ownerId: user.id
      };
    }

    return where;
  }
}


