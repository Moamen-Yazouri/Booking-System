import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import type { CreateBookingDTO } from './dto/booking.dto';
import { User } from 'src/decorators/user.dec';
import type{ UserForClient } from '../user/dto/user.dto';
import { ZodValidationPipe } from 'src/pipes/zodValidation.pipe';
import { PaginationSchema } from 'src/validation/normalQuery.validation';
import type { IPaginationQuery } from 'src/@types/pagination';
import { Roles } from 'src/decorators/roles';
import { bookingValidationSchema } from './validation/booking.validation';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}


  @Post()
  create(
    @Body(new ZodValidationPipe(bookingValidationSchema)) createBookingDto: CreateBookingDTO,
    @User() user: UserForClient
  ) {
    return this.bookingService.create(createBookingDto, user.id);
  }

  @Roles(['ADMIN'])
  @Get()
  findAll(
    @Query(new ZodValidationPipe(PaginationSchema)) query: IPaginationQuery
  ) {
    return this.bookingService.findAll(query);
  }
  
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingService.findOne(+id);
  }

  @Roles(['ADMIN', 'OWNER'])
  @Patch(':id')
  confirm(
    @User() user: UserForClient,
    @Param('id') id: string) {
    return this.bookingService.confirmBooking(+id, user);
  }

  @Roles(['ADMIN', 'OWNER', 'GUEST'])
  @Delete(':id')
  cancel(
    @User() user: UserForClient,
    @Param('id') id: string) {
    return this.bookingService.cancleBooking(+id, user);
  }
}
