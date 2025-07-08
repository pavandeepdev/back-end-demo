import { HttpStatus } from '@nestjs/common';
import { ApiResponse } from 'src/interface';

export const buildSuccessResponse = <T>(
  data: T,
  message = 'Request successful',
  statusCode: number = HttpStatus.OK,
): ApiResponse<T> => {
  return {
    error: false,
    statusCode,
    success: true,
    message,
    data,
  };
};

export const buildErrorResponse = (
  message = 'Something went wrong',
  statusCode = HttpStatus.INTERNAL_SERVER_ERROR,
): ApiResponse<null> => {
  return {
    error: true,
    statusCode,
    success: false,
    message,
  };
};
