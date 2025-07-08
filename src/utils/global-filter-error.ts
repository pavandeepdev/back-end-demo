import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(CustomExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const response =
      exception instanceof HttpException
        ? exception.getResponse()
        : {
            message:
              (exception as { message?: string })?.message ??
              'Internal server error',
          };

    let message: string;

    if (
      typeof response === 'object' &&
      response !== null &&
      'message' in response
    ) {
      const respMsg = (response as { message?: unknown }).message;
      if (Array.isArray(respMsg)) {
        message = String(respMsg[0]);
      } else {
        message = String(respMsg);
      }
    } else {
      message =
        typeof response === 'object' && response !== null
          ? JSON.stringify(response)
          : String(response);
    }

    const messageCode = HttpStatus[status] || 'UNHANDLED_EXCEPTION';

    const timestamp = new Date().toISOString();

    // Optional: Send alert/log email for internal server errors
    if (status === Number(HttpStatus.INTERNAL_SERVER_ERROR)) {
      const formattedPayload = JSON.stringify(req.body ?? {}, null, 2);
      const formattedHeaders = JSON.stringify(req.headers ?? {}, null, 2);

      this.logger.error(
        `[${timestamp}] [500 Error]\n` +
          `Path: ${req.method} ${req.originalUrl}\n` +
          `Message: ${message}\n` +
          `Stack: ${'stack' in exception ? exception.stack : ''}\n` +
          `Payload: ${formattedPayload}\n` +
          `Headers: ${formattedHeaders}\n`,
      );

      // You can call a mailer service or external logger here if needed.
    }

    res.status(status).json({
      error: true,
      success: false,
      statusCode: status,
      messageCode,
      message,
      errorMessage: message,
      errorStack:
        status === 500 &&
        exception &&
        typeof exception === 'object' &&
        'stack' in exception
          ? String((exception as { stack?: unknown }).stack)
          : undefined,
      data: [],
    });
  }
}
