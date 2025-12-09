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

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Roles(['ADMIN', 'OWNER'])
  @Post()
  create(
    @Body(new ZodValidationPipe(roomValidationSchema))
    createRoomDto: CreateRoomDTO,
    @User() user: UserForClient,
  ) {
    return this.roomService.create(createRoomDto, user.id);
  }

  @Roles(['ADMIN'])
  @Get()
  findAll(
    @Query(new ZodValidationPipe(querySchema)) query: IPaginationQuery,
  ) {
    console.log(query)
    return this.roomService.findAll(query);
  }

  @Roles(['GUEST', 'ADMIN'])
  @Get('/available')
  findAvailable(
    @Query(new ZodValidationPipe(availableQuerySchema)) query: IAvailabelQuery
  ) {
    console.log(query)
    return this.roomService.findAvailableWithFilter(query);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @User() user: UserForClient,
  ) {
    return this.roomService.findOne(Number(id), user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateroomValidationSchema))
    updateRoomDto: UpdateRoomDTO,
    @User() user: UserForClient,
  ) {
    return this.roomService.update(user, +id, updateRoomDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user: UserForClient) {
    return this.roomService.remove(user, +id);
  }
}
