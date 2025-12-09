import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { map, Observable } from "rxjs";
import { IPaginationResult } from "src/@types/pagination";
import { SuccessResponse } from "src/@types/response";


@Injectable()
export class UnifierInterceptor<T> implements NestInterceptor<IPaginationResult<T> | T, SuccessResponse<T>> {
    intercept(ctx: ExecutionContext, next: CallHandler): Observable<SuccessResponse<T>> {
        return next.handle().pipe(
            map<IPaginationResult<T> | T,  SuccessResponse<T>>((data) => {
                if (isPaginationResponse(data)) {
                    return { success: true, data: data.data, meta: data.meta };
                }
                return { success: true, data };
            }),
        );
    }
}

const isPaginationResponse = <T>(data: IPaginationResult<T> | T): data is IPaginationResult<T> => {
    return data 
        && typeof data === 'object' 
        && 'data' in data 
        && Array.isArray(data.data) 
        && 'meta' in data;
}
