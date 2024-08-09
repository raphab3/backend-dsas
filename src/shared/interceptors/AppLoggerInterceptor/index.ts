import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class AppLoggingInterceptor implements NestInterceptor {
  private logger = new Logger('HTTP');
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const req = context.switchToHttp().getRequest();
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const method = req.method;
    const url = req.url;

    this.logger.log('---------------------');
    this.logger.log(`Request... ${method} ${url} from ${ip}`);

    return next.handle().pipe(
      tap(() => {
        this.logger.log(
          `Response... ${method} ${url} in ${Date.now() - now}ms`,
        );
        this.logger.log('---------------------');
      }),
    );
  }
}
