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
    private auditService: AuditService,
    private readonly reflector: Reflector,
  ) {}

  logger = new Logger(AuditInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const auditLog = this.reflector.get(AUDIT_LOG_DATA, context.getHandler());
    if (!auditLog) {
      return next.handle();
    }

    return next.handle().pipe(
      tap(() => {
        const request = context.switchToHttp().getRequest();
        const auditMethods = ['POST', 'PUT', 'PATCH', 'DELETE'];
        const { method, url, body, user, ip } = request;

        const excludeRoutes = ['auth'];

        const isToAudit = (req: any) => {
          return (
            req.raw.method &&
            auditMethods.includes(req.raw.method) &&
            !req.url.includes(excludeRoutes.join('|'))
          );
        };

        const action = `${method} ${url}`;
        const details = body ? JSON.stringify(body) : null;
        const userId = user?.userId;
        const userIp = ip;

        if (!isToAudit(request)) return;

        this.auditService
          .execute({
            userId,
            action,
            details,
            userIp,
            audit_log: auditLog,
            url,
            method,
          })
          .catch((error) =>
            console.error('Erro ao gravar a ação de auditoria', error),
          );
      }),
    );
  }
}

export default AuditInterceptor;
