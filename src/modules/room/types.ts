

export interface IAvailabelQuery {
  page: number;
  limit: number;
  interval?: TInterval;
  priceRange?: TPriceRange;
  capacityRange?: TCapacityRange;
}

export type TInterval = {
  checkIn: string;
  checkOut: string;
};

export type TPriceRange = {
  minPrice?: number;
  maxPrice?: number;
};

export type TCapacityRange = {
  minCapacity?: number;
  maxCapacity?: number;
};
