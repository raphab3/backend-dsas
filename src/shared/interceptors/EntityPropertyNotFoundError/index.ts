import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { EntityPropertyNotFoundError } from 'typeorm/error/EntityPropertyNotFoundError';

@Catch(EntityPropertyNotFoundError, HttpException)
export class EntityPropertyNotFoundExceptionFilter implements ExceptionFilter {
  catch(
    exception: EntityPropertyNotFoundError | HttpException,
    host: ArgumentsHost,
  ) {
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

    if (exception instanceof EntityPropertyNotFoundError) {
      status = HttpStatus.BAD_REQUEST;
      message = exception.message;
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
