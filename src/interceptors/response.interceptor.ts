import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable, map } from 'rxjs';
import { buildSuccessResponse } from 'src/utils/common-functions';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const res = ctx.getResponse<Response>();

    return next.handle().pipe(
      map((data: any) => {
        const statusCode = res.statusCode ?? 200;

        // Support optional { data, message, meta } structure from handler
        if (
          data &&
          typeof data === 'object' &&
          data !== null &&
          Object.hasOwn(data, 'data')
        ) {
          interface HandlerResponse {
            data: unknown;
            message?: string;
            meta?: unknown;
          }
          const { data: innerData, message } = data as HandlerResponse;
          return buildSuccessResponse(innerData, message, statusCode);
        }

        // Fallback if handler directly returns raw data
        return buildSuccessResponse(data, 'Request successful', statusCode);
      }),
    );
  }
}
