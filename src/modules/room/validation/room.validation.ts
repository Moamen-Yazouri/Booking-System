import z from 'zod';

export const roomValidationSchema = z.object({
  name: z.string().min(1, 'Room name is required'),
  price: z.number().nonnegative('Price must be 0 or more'),
  status: z.enum(['INACTIVE', 'ACTIVE']),
  capacity: z
    .number()
    .int('Capacity must be an integer')
    .positive('Capacity must be at least 1'),
});

export const updateroomValidationSchema = roomValidationSchema.partial();
