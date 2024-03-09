import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { TypeORMError } from 'typeorm';

@Catch(TypeORMError, HttpException)
export class EntityExceptionFilter implements ExceptionFilter {
  catch(exception: TypeORMError | HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<Request>();

    let status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    let message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    if (exception instanceof TypeORMError) {
      status = HttpStatus.BAD_REQUEST;
      message = exception.message;

      if (
        exception.message.includes(
          'duplicate key value violates unique constraint',
        )
      ) {
        message = 'Esse registro já existe';
      }
    }

    response
      .code(status)
      .header('Content-Type', 'application/json; charset=utf-8')
      .send({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: message,
      });
  }
}
