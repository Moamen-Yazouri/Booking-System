import type { Prisma, Room } from "generated/prisma";



export type AllRoomsDTO =  Prisma.RoomGetPayload<{
    include: {
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
    }
}>;

export type CreateRoomDTO = Pick<Room, 'name' | 'price' | 'status' | 'capacity'>;

export type AvailableRoomsDTO = Pick<Room, 'id' | 'name' | 'price' | 'status' | 'capacity'>;

export type RoomDetailDTO = Prisma.RoomGetPayload<{
    include: {
        owner: {
            select: {
                id: true,
                name: true,
                email: true,
            }
        },
        bookings: true,
    }
}>;

export type UpdateRoomDTO = Partial<CreateRoomDTO> 