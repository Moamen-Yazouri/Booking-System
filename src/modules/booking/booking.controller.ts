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
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiParam,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';

import { BookingService } from './booking.service';
import type { CreateBookingDTO } from './dto/booking.dto';
import { User } from 'src/decorators/user.dec';
import type { UserForClient } from '../user/dto/user.dto';
import { ZodValidationPipe } from 'src/pipes/zodValidation.pipe';

import type { IPaginationQuery } from 'src/@types/pagination';
import { Roles } from 'src/decorators/roles';
import { bookingValidationSchema } from './validation/booking.validation';
import { querySchema } from 'src/validation/normalQuery.validation';

@ApiTags('bookings')      
@ApiBearerAuth()          
@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new booking (guest)' })
  @ApiBody({ type: Object, description: 'Booking payload (roomId, checkIn, checkOut)' })
  @ApiResponse({ status: 201, description: 'Booking created successfully.' })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  create(
    @Body(new ZodValidationPipe(bookingValidationSchema)) createBookingDto: CreateBookingDTO,
    @User() user: UserForClient,
  ) {
    return this.bookingService.create(createBookingDto, user.id);
  }

  @Roles(['ADMIN'])
  @Get()
  @ApiOperation({ summary: 'Get all bookings (admin only, paginated)' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({ status: 200, description: 'List of bookings returned.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  findAll(
    @Query(new ZodValidationPipe(querySchema)) query: IPaginationQuery,
  ) {
    return this.bookingService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a booking by id' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Booking returned.' })
  @ApiResponse({ status: 404, description: 'Booking not found.' })
  findOne(@Param('id') id: string) {
    return this.bookingService.findOne(+id);
  }

  @Roles(['ADMIN', 'OWNER'])
  @Patch(':id')
  @ApiOperation({ summary: 'Confirm a booking (admin/owner)' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Booking confirmed.' })
  @ApiResponse({ status: 403, description: 'Forbidden (not owner/admin).' })
  confirm(
    @User() user: UserForClient,
    @Param('id') id: string,
  ) {
    return this.bookingService.confirmBooking(+id, user);
  }

  @Roles(['ADMIN', 'OWNER', 'GUEST'])
  @Delete(':id')
  @ApiOperation({ summary: 'Cancel a booking (admin/owner/guest)' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Booking cancelled.' })
  @ApiResponse({ status: 403, description: 'Forbidden (cannot cancel this booking).' })
  cancel(
    @User() user: UserForClient,
    @Param('id') id: string,
  ) {
    return this.bookingService.cancleBooking(+id, user);
  }
}
