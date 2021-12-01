import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { UserCommentEvent } from 'src/entities/UserCommentEvent';

@Injectable()
export class CommentSingleInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const baseUrl = req.protocol + '://' + req.headers.host + '/';
    return next.handle().pipe(
      map((c: UserCommentEvent) => {
        return {
          id: c.id,
          comment: c.comment,
          date: c.date,
          user: {
            ...c.attendEvent.user,
            avatar: baseUrl + c.attendEvent.user.avatar,
          },
        };
      })
    );
  }
}
