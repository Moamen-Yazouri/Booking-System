import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "generated/prisma/client";
import { IMetaPagination, IPaginationQuery } from "src/@types/pagination";

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    async onModuleInit() {
        await this.$connect();
    }

    async onModuleDestroy() {
        await this.$disconnect();
    } 

    createPaginationForPrisma(query: IPaginationQuery) {
        const page = Number(query.page ?? 1);
        const limit = Number(query.limit ?? 10);
        const skip = (page - 1) * limit;
        return {
            skip,
            take: limit,
        }
    }

    createPaginationMetaData(limit: number, page: number, total: number): IMetaPagination {
        return {
            total,
            page,
            limit,
            totalPages: Math.ceil(total/limit)
        }
    }
}
