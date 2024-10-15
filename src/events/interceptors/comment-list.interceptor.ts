import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { map, Observable } from 'rxjs';
import { UserCommentEvent } from 'src/entities/UserCommentEvent';

@Injectable()
export class CommentListInterceptor implements NestInterceptor {
  constructor(private configService: ConfigService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const baseUrl = `${this.configService.get<string>('protocol')}://${
      req.headers.host
    }/${this.configService.get<string>('basePath')}`; 

    return next.handle().pipe(
      map((comments: UserCommentEvent[]) => {
        return {
          comments: comments.map((c) => {
            return {
              id: c.id,
              comment: c.comment,
              date: c.date,
              user: {
                ...c.attendEvent.user,
                avatar: (c.attendEvent.user.avatar.startsWith('http') ? "" : baseUrl) + c.attendEvent.user.avatar,
              },
            };
          }),
        };
      })
    );
  }
}
