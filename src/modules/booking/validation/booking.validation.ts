import z from "zod";

export const bookingValidationSchema = z.object({
  roomId: z
    .string({
      message: "Room id is required",
    })
    .min(1, "Room id is required"), 

  checkIn: z.coerce.date({
    message: "Check-in date is required",
  }),

  checkOut: z.coerce.date({
    message: "Check-out date is required",
  }),
})
.refine((data) => data.checkOut > data.checkIn, {
  message: "Check-out date must be after check-in date",
  path: ["checkOut"],
});
