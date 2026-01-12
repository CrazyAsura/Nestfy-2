import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LogService } from '../../../modules/log/log.service';

@Injectable()
export class UserActivityInterceptor implements NestInterceptor {
  private readonly logger = new Logger(UserActivityInterceptor.name);
  
  constructor(
    private readonly logService: LogService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, path, user, ip } = request;
    const userAgent = request.get('user-agent');
    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: async () => {
          if (user?.id) {
            try {
              const duration = Date.now() - startTime;
              const className = context.getClass().name;
              const handlerName = context.getHandler().name;
              const action = `${className.replace('Controller', '')}.${handlerName}`;

              await this.logService.createActivityLog({
                userId: user.id,
                action,
                method,
                path,
                ip: ip || request.headers['x-forwarded-for'] || 'unknown',
                userAgent,
                duration,
                metadata: {
                  params: request.params,
                  query: request.query,
                },
              });
            } catch (error) {
              this.logger.error('Falha ao registrar atividade do usuário', error instanceof Error ? error.stack : error);
            }
          }
        },
      }),
    );
  }
}