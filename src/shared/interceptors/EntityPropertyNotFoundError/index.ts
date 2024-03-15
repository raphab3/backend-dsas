import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { TypeORMError } from 'typeorm';
import { FastifyReply } from 'fastify';

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
        : 'Erro interno do servidor';

    if (exception instanceof TypeORMError) {
      status = HttpStatus.BAD_REQUEST;

      if (
        exception.message.includes(
          'duplicate key value violates unique constraint',
        )
      ) {
        message =
          'Esse registro já existe. Por favor, verifique os dados e tente novamente.';
      } else if (
        exception.message.includes('violates foreign key constraint')
      ) {
        message =
          'Operação não permitida devido a restrições de relação entre dados. Por favor, verifique os dados e tente novamente.';
      } else if (exception.message.includes('null value in column')) {
        message =
          'Um ou mais campos obrigatórios não foram preenchidos. Por favor, verifique os dados e tente novamente.';
      } else {
        message =
          'Erro ao processar a solicitação. Por favor, verifique os dados e tente novamente.';
      }
    }

    console.error(exception);

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
