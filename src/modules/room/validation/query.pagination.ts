import z, { ZodType } from "zod";
import { IAvailabelQuery, TCapacityRange, TInterval, TPriceRange } from "../types";
import { querySchema } from "src/validation/normalQuery.validation";

const intervalSchema = z.object({
  checkIn: z.string(),
  checkOut: z.string(),
}) satisfies ZodType<TInterval>;

const priceRangeSchema = z.object({
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
}) satisfies ZodType<TPriceRange>;

const capacityRangeSchema = z.object({
  minCapacity: z.coerce.number().optional(),
  maxCapacity: z.coerce.number().optional(),
}) satisfies ZodType<TCapacityRange>;

// final schema for available query
export const availableQuerySchema = querySchema.extend({
  interval: intervalSchema.optional(),
  priceRange: priceRangeSchema.optional(),
  capacityRange: capacityRangeSchema.optional(),
}) satisfies ZodType<IAvailabelQuery>;