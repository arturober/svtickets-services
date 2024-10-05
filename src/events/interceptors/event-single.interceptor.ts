import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { map, Observable } from 'rxjs';
import { Event } from 'src/entities/Event';

@Injectable()
export class EventSingleInterceptor implements NestInterceptor {
  constructor(private configService: ConfigService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const baseUrl = `${this.configService.get<string>('protocol')}://${
      req.headers.host
    }/${this.configService.get<string>('basePath')}`;    
    return next.handle().pipe(
      map((e: Event) => {
        if (!e.usersAttend.isInitialized) {
          delete e.usersAttend;
        }
        e.image = e.image && baseUrl + e.image;
        e.mine = e.creator.id === req.user.id;
        if (e.creator?.avatar) {
          e.creator.avatar = baseUrl + e.creator.avatar;
        }
        return { event: e };
      })
    );
  }
}
