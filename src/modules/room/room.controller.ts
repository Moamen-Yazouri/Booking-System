import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { RoomService } from './room.service';
import { ZodValidationPipe } from 'src/pipes/zodValidation.pipe';
import type { IPaginationQuery } from 'src/@types/pagination';
import { PaginationSchema } from 'src/validation/normalQuery.validation';
import type { CreateRoomDTO, UpdateRoomDTO } from './dto/room.dto';
import { User } from 'src/decorators/user.dec';
import type { UserForClient } from '../user/dto/user.dto';
import { roomValidationSchema, updateroomValidationSchema } from './validation/room.validation';
import { Roles } from 'src/decorators/roles';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Roles(['ADMIN', 'OWNER'])
  @Post()
  create(
    @Body(new ZodValidationPipe(roomValidationSchema)) createRoomDto: CreateRoomDTO,
    @User() user: UserForClient
  ) {
    return this.roomService.create(createRoomDto, user.id);
  }

  @Roles(['ADMIN'])
  @Get()
  findAll(
    @Query(new ZodValidationPipe(PaginationSchema)) query: IPaginationQuery,
  ) {
    return this.roomService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomService.findOne(Number(id));
  }

  @Patch(':id')
  update(
    @Param('id') id: string, 
    @Body(new ZodValidationPipe(updateroomValidationSchema)) updateRoomDto: UpdateRoomDTO,
    @User() user: UserForClient
  ) {
    return this.roomService.update(user, +id, updateRoomDto);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @User() user: UserForClient
  ) {
    return this.roomService.remove(user, +id);
  }
}
