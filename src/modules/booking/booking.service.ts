import { ConflictException, Injectable } from '@nestjs/common';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { CreateBookingDTO } from './dto/booking.dto';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class BookingService {
  constructor(private  prismaClient: DatabaseService){}
  create(data: CreateBookingDTO) {
    const { roomId, checkIn, checkOut } = data;

    const newRoom = this.prismaClient.$transaction(async(tx) => {
      const booingOverlap = await tx.booking.findFirst({
        where: {
          roomId,
          checkIn: {
            lte: checkOut,
          },
          checkOut: {
            gte: checkIn,
          },
        },
      });

      if(booingOverlap) {
        throw new ConflictException('Room is not available for these dates');
      }

      return await tx.booking.create({
        data,
      });
    });

    return newRoom;
  }

  findAll() {
    return `This action returns all booking`;
  }

  findOne(id: number) {
    return `This action returns a #${id} booking`;
  }

  update(id: number, updateBookingDto: UpdateBookingDto) {
    console.log(updateBookingDto)
    return `This action updates a #${id} booking`;
  }

  remove(id: number) {
    return `This action removes a #${id} booking`;
  }
}
