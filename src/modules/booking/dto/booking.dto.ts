import { Booking } from "@prisma/client";

export type CreateBookingDTO = Pick<Booking, 'roomId' | 'guestId' | 'checkIn' | 'checkOut'>

