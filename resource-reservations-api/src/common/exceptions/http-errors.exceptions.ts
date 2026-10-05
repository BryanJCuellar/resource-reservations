import { HttpException, HttpStatus } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

export class HttpErrorsExceptions {
  static handleHttpException(error: unknown, defaultMessage: string): never {
    if (error instanceof HttpException) {
      throw error;
    }

    if (
      error instanceof QueryFailedError &&
      [2601, 2627].includes(error.driverError?.number)
    ) {
      throw new HttpException(
        "There's already a record with that unique value",
        HttpStatus.CONFLICT,
      );
    }

    throw new HttpException(defaultMessage, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
