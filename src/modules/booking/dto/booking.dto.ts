
import { Booking, Prisma } from 'generated/prisma';

export type CreateBookingDTO = Pick<
  Booking,
  'roomId' |  'checkIn' | 'checkOut'
>;

export type AllBookingsResponseDTO = Prisma.BookingGetPayload<{
  include: {
    guest: true,
    room: true,
  }
}>
