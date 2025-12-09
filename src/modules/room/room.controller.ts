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

import { RoomService } from './room.service';
import { ZodValidationPipe } from 'src/pipes/zodValidation.pipe';
import type { IPaginationQuery } from 'src/@types/pagination';
import { querySchema } from 'src/validation/normalQuery.validation';
import type { CreateRoomDTO, UpdateRoomDTO } from './dto/room.dto';
import { User } from 'src/decorators/user.dec';
import type { UserForClient } from '../user/dto/user.dto';
import {
  roomValidationSchema,
  updateroomValidationSchema,
} from './validation/room.validation';
import { Roles } from 'src/decorators/roles';
import type { IAvailabelQuery } from './types';
import { availableQuerySchema } from './validation/query.pagination';

@ApiTags('rooms')       
@ApiBearerAuth()        
@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Roles(['ADMIN', 'OWNER'])
  @Post()
  @ApiOperation({ summary: 'Create a new room (admin/owner)' })
  @ApiBody({ type: Object, description: 'Room payload (name, price, capacity, status, etc.)' })
  @ApiResponse({ status: 201, description: 'Room created successfully.' })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  create(
    @Body(new ZodValidationPipe(roomValidationSchema))
    createRoomDto: CreateRoomDTO,
    @User() user: UserForClient,
  ) {
    return this.roomService.create(createRoomDto, user.id);
  }

  @Roles(['ADMIN'])
  @Get()
  @ApiOperation({ summary: 'Get all rooms (admin only, paginated)' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({ status: 200, description: 'List of rooms returned.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  findAll(
    @Query(new ZodValidationPipe(querySchema)) query: IPaginationQuery,
  ) {
    return this.roomService.findAll(query);
  }

  @Roles(['GUEST', 'ADMIN'])
  @Get('/available')
  @ApiOperation({
    summary: 'Get available rooms with filters (guest/admin)',
    description:
      'Returns rooms that are available in the given interval and optionally filtered by price/capacity.',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({ status: 200, description: 'Available rooms returned.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Roles(['GUEST', 'ADMIN'])
  findAvailable(
    @Query(new ZodValidationPipe(availableQuerySchema)) query: IAvailabelQuery,
  ) {
    return this.roomService.findAvailableWithFilter(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a room by id' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Room returned.' })
  @ApiResponse({ status: 404, description: 'Room not found.' })
  @Roles(['OWNER', 'ADMIN'])
  findOne(
    @Param('id') id: string,
    @User() user: UserForClient,
  ) {
    return this.roomService.findOne(Number(id), user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a room by id (owner/admin depending on your logic)' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiBody({ type: Object, description: 'Partial room payload to update.' })
  @ApiResponse({ status: 200, description: 'Room updated successfully.' })
  @ApiResponse({ status: 404, description: 'Room not found.' })
  @Roles(['ADMIN', 'OWNER'])
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateroomValidationSchema))
    updateRoomDto: UpdateRoomDTO,
    @User() user: UserForClient,
  ) {
    return this.roomService.update(user, +id, updateRoomDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a room by id (owner/admin depending on your logic)' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Room deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Room not found.' })
  @Roles(['ADMIN', 'OWNER'])
  remove(@Param('id') id: string, @User() user: UserForClient) {
    return this.roomService.remove(user, +id);
  }
}
