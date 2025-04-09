import env from '@config/env';
import {
  Injectable,
  Logger,
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { TelegramBotService } from '@shared/providers/Notification/services/TelegramBot.service';
import { TypeORMError } from 'typeorm';
import { SECURITY_PROBE_PATTERNS } from './utils';

enum StatusEmoji {
  ServerError = '🚨',
  ClientError = '⚠️',
  Unknown = '❓',
}

interface ErrorDetails {
  status: number;
  message: string;
}

@Catch()
@Injectable()
export class AppLoggingInterceptor implements ExceptionFilter {
  private readonly logger = new Logger(AppLoggingInterceptor.name);

  constructor(private readonly telegramBotService: TelegramBotService) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const { status, message } = this.getErrorDetails(exception);
    this.logError(request, status, message, exception);

    if (this.shouldNotifyTelegram(status, request)) {
      this.notifyViaTelegram(status, request, message, exception);
    }

    this.sendErrorResponse(response, status, request.url, message);
  }

  private getErrorDetails(exception: unknown): ErrorDetails {
    if (exception instanceof HttpException) {
      return {
        status: exception.getStatus(),
        message: this.extractMessage(exception.getResponse()),
      };
    }
    if (exception instanceof TypeORMError) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: this.handleTypeORMError(exception),
      };
    }
    return {
      status: (exception as any).statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      message:
        exception instanceof Error
          ? exception.message
          : 'Erro interno do servidor',
    };
  }

  private logError(
    request: Request,
    status: number,
    message: string,
    exception: unknown,
  ): void {
    // Determine if this is a security probe
    const isSecurityProbe = this.isSecurityProbe(request);

    // Add probe info to log message if detected
    const probeInfo = isSecurityProbe ? ' [SECURITY_PROBE]' : '';

    const logMessage = `[ERROR]${probeInfo} ${request.method} ${request.url} - Status: ${status} - IP: ${request.ip} - Message: ${message}`;
    this.logger.error(logMessage);

    // Only log stack trace for non-security probes or if in development environment
    if (!isSecurityProbe || env.NODE_ENV !== 'production') {
      this.logger.error(this.getExceptionStack(exception));
    }
  }

  private isSecurityProbe(request: Request): boolean {
    // Check URL against known security probe patterns
    return SECURITY_PROBE_PATTERNS.some((pattern) => pattern.test(request.url));
  }

  private shouldNotifyTelegram(status: number, request: Request): boolean {
    const notAllowedErrorsNotification = [
      HttpStatus.UNAUTHORIZED,
      HttpStatus.FORBIDDEN,
    ];

    // Don't notify about 404s that match security probe patterns
    if (status === HttpStatus.NOT_FOUND && this.isSecurityProbe(request)) {
      return false;
    }

    return (
      env.NODE_ENV === 'production' &&
      !notAllowedErrorsNotification.includes(status)
    );
  }

  private notifyViaTelegram(
    status: number,
    request: Request,
    message: string,
    exception: unknown,
  ): void {
    const telegramMessage = this.createTelegramMessage(
      status,
      request,
      message,
      exception,
    );
    this.telegramBotService
      .sendMessage(telegramMessage, env.API_TELEGRAM_CHAT_ID)
      .catch((error) =>
        this.logger.error(
          `Falha ao enviar notificação via Telegram: ${error.message}`,
        ),
      );
  }

  private sendErrorResponse(
    response: Response,
    status: number | HttpStatus,
    path: string,
    message: string,
  ): void {
    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path,
      message,
    };
    response.status(Number(status)).json(errorResponse);
  }

  private extractMessage(responseMessage: string | object): string {
    if (typeof responseMessage === 'string') return responseMessage;
    if (typeof responseMessage === 'object' && responseMessage !== null) {
      if ('message' in responseMessage) {
        const message = (responseMessage as any).message;
        return Array.isArray(message) ? message.join(', ') : message;
      }
      return JSON.stringify(responseMessage);
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
    }
    if (exception.message.includes('violates foreign key constraint')) {
      return 'Operação não permitida devido a restrições de relação entre dados. Por favor, verifique os dados e tente novamente.';
    }
    if (exception.message.includes('null value in column')) {
      return 'Um ou mais campos obrigatórios não foram preenchidos. Por favor, verifique os dados e tente novamente.';
    }
    return 'Erro ao processar a solicitação. Por favor, verifique os dados e tente novamente.';
  }

  private getExceptionStack(exception: unknown): string {
    return exception instanceof Error && exception.stack
      ? exception.stack
      : 'No stack available';
  }

  private getClientIp(request: Request): string {
    const forwardedFor = request.headers['x-forwarded-for'];
    if (typeof forwardedFor === 'string')
      return forwardedFor.split(',')[0].trim();
    if (Array.isArray(forwardedFor)) return forwardedFor[0].trim();

    const realIp = request.headers['x-real-ip'];
    if (typeof realIp === 'string') return realIp.trim();

    return request.socket.remoteAddress || 'Unknown';
  }

  private createTelegramMessage(
    status: number,
    request: Request,
    message: string,
    exception: unknown,
  ): string {
    const emoji = this.getStatusEmoji(status);
    const ip = this.getClientIp(request);
    const stack = this.truncateStackTrace(this.getExceptionStack(exception));

    return `
      ${emoji} *Novo Erro Detectado* ${emoji}

      *Detalhes da Requisição:*
      🔗 URL: \`${request.url}\`
      📡 Método: \`${request.method}\`
      🖥️ IP: \`${ip}\`

      *Detalhes do Erro:*
      🔢 Status: \`${status}\`
      ❌ Mensagem: \`${message}\`

      *Stack Trace:*
      \`\`\`
      ${stack}
      \`\`\`
    `.trim();
  }

  private truncateStackTrace(stack: string, maxLength: number = 300): string {
    return stack.length <= maxLength
      ? stack
      : `${stack.substring(0, maxLength)}\n... (truncated)`;
  }

  private getStatusEmoji(status: number): StatusEmoji {
    if (status >= 500) return StatusEmoji.ServerError;
    if (status >= 400) return StatusEmoji.ClientError;
    return StatusEmoji.Unknown;
  }
}
