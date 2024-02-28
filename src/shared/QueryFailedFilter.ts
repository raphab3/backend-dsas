import {
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError)
export class QueryFailedFilter extends BaseExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse();
    const status = response.status || HttpStatus.INTERNAL_SERVER_ERROR;
    const message =
      response.message || 'Erro ao executar consulta no banco de dados';

    if (exception.message.includes('violates not-null constraint')) {
      throw new HttpException(`Database error: ${exception.message}`, 400);
    }

    if (exception.message.includes('violates unique constraint')) {
      throw new HttpException(`Database error: ${exception.message}`, 400);
    }

    if (exception.message.includes('violates foreign key constraint')) {
      throw new HttpException(`Database error: ${exception.message}`, 400);
    }

    if (exception.message.includes('violates check constraint')) {
      throw new HttpException(`Database error: ${exception.message}`, 400);
    }

    if (exception.message.includes('violates exclusion constraint')) {
      throw new HttpException(`Database error: ${exception.message}`, 400);
    }

    if (exception.message.includes('Make sure your query is correct')) {
      throw new HttpException(`Database error: ${exception.message}`, 400);
    }

    if (response.status && response.message) {
      response.status(status).json({
        statusCode: status,
        message: message,
      });
    }

    if (response.message) {
      return super.catch(exception, host);
    }
  }
}
