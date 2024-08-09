import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
  Injectable,
} from '@nestjs/common';
import { TypeORMError } from 'typeorm';
import { Response, Request } from 'express';

@Catch()
@Injectable()
export class EntityExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(EntityExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const { status, message } = this.handleException(exception);

    const logMessage = this.createLogMessage(request, message);
    this.logger.error(logMessage);

    const stack = this.getExceptionStack(exception);
    this.logger.error(stack);

    const errorResponse = this.createErrorResponse(
      status,
      request.url,
      message,
    );

    response.status(status).json(errorResponse);
  }

  private handleException(exception: unknown): {
    status: number;
    message: string;
  } {
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Erro interno do servidor';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const responseMessage = exception.getResponse();
      message = this.extractMessage(responseMessage);
    } else if (exception instanceof HttpException) {
      status = exception.getStatus() || HttpStatus.BAD_REQUEST;
      message = exception.message;
    } else if (exception instanceof TypeORMError) {
      status = HttpStatus.BAD_REQUEST;
      message = this.handleTypeORMError(exception);
    }

    return {
      status,
      message: typeof message === 'string' ? message : JSON.stringify(message),
    };
  }

  private extractMessage(responseMessage: string | object): string {
    if (typeof responseMessage === 'string') {
      return responseMessage;
    } else if (
      typeof responseMessage === 'object' &&
      responseMessage !== null
    ) {
      return responseMessage['message'] || JSON.stringify(responseMessage);
    }
    return 'Erro inesperado';
  }

  private handleTypeORMError(exception: TypeORMError): string {
    if (
      exception.message.includes(
        'duplicate key value violates unique constraint',
      )
    ) {
      return 'Esse registro já existe. Por favor, verifique os dados e tente novamente.';
    } else if (exception.message.includes('violates foreign key constraint')) {
      return 'Operação não permitida devido a restrições de relação entre dados. Por favor, verifique os dados e tente novamente.';
    } else if (exception.message.includes('null value in column')) {
      return 'Um ou mais campos obrigatórios não foram preenchidos. Por favor, verifique os dados e tente novamente.';
    } else if (
      exception.message.includes('invalid input syntax for type uuid')
    ) {
      return 'Erro de formato: um valor UUID inválido foi fornecido. Por favor, verifique os dados e tente novamente.';
    } else {
      // Log the full error message for debugging
      console.error('Unhandled TypeORM error:', exception.message);
      return `Erro ao processar a solicitação: ${exception.message}. Por favor, verifique os dados e tente novamente.`;
    }
  }

  private createLogMessage(request: Request, message: string): string {
    return `Request: ${request?.url} - Method: ${request?.method} - IP: ${request?.ip} - Message: ${message}`;
  }

  private getExceptionStack(exception: unknown): string {
    return exception instanceof Error && exception.stack
      ? exception.stack
      : 'No stack available';
  }

  private createErrorResponse(status: number, path: string, message: string) {
    return {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: path,
      message: message,
    };
  }
}
