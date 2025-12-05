import { IPaginationQuery } from "src/@types/pagination";

export interface IAvailabelQuery extends IPaginationQuery {
    interval?: TInterval;
    priceRange?: TPriceRange;
    capacityRange?: TCapacityRange;
}

type TInterval = {
    checkIn: string;   
    checkOut: string;
}

type TPriceRange = {
    minPrice?: number;
    maxPrice?: number;
}

type TCapacityRange = {
    minCapacity?: number;
    maxCapacity?: number;
}