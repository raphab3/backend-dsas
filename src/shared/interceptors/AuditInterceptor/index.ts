import { AuditService } from '@modules/audits/services/AuditService';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AUDIT_LOG_DATA } from '@modules/audits/decorators';
import { Reflector } from '@nestjs/core';

@Injectable()
class AuditInterceptor implements NestInterceptor {
  constructor(
    private readonly auditService: AuditService,
    private readonly reflector: Reflector,
  ) {}

  private readonly logger = new Logger(AuditInterceptor.name);
  private readonly auditMethods = ['POST', 'PUT', 'PATCH', 'DELETE'];
  private readonly excludeRoutes = ['auth', 'audits'];
  private readonly sensitiveFields = ['password', 'oldPassword'];

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const auditLog = this.reflector.get(AUDIT_LOG_DATA, context.getHandler());
    if (!auditLog) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    if (!this.shouldAudit(request)) {
      return next.handle();
    }

    const auditData = this.captureRequestData(request);

    return next.handle().pipe(
      tap(async (data) => {
        const response = context.switchToHttp().getResponse();
        const filteredRequestBody = this.filterSensitiveData(
          auditData.requestBody,
        );

        await this.auditService
          .execute({
            ...auditData,
            requestBody: filteredRequestBody,
            responsePayload: data,
            responseStatus: response.statusCode,
            audit_log: auditLog,
            action: auditLog,
            details: JSON.stringify(filteredRequestBody),
            userIp: auditData.ip,
            url: auditData.path,
          })
          .catch((error) => {
            this.logger.error('Erro ao gravar a ação de auditoria', error);
          });
      }),
    );
  }

  private shouldAudit(request: any): boolean {
    return (
      this.auditMethods.includes(request.method) &&
      !this.excludeRoutes.some((route) => request.url.includes(route))
    );
  }

  private captureRequestData(request: any) {
    return {
      startTime: new Date().toISOString(),
      ip: request.ip,
      method: request.method,
      path: request.url,
      userId: request.user?.userId,
      userEmail: request.user?.email,
      userName: request.user?.name,
      params: request.params,
      query: request.query,
      requestBody: request.body,
      endTime: new Date().toISOString(),
    };
  }

  private filterSensitiveData(data: any) {
    return Object.keys(data).reduce((acc, key) => {
      if (this.sensitiveFields.includes(key)) {
        acc[key] = '*****';
      } else {
        acc[key] = data[key];
      }
      return acc;
    }, {} as any);
  }
}

export default AuditInterceptor;
