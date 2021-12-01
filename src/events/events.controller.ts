import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseInterceptors,
  HttpCode,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventListInterceptor } from './interceptors/event-list.interceptor';
import { EventSingleInterceptor } from './interceptors/event-single.interceptor';
import { User } from 'src/entities/User';
import { AuthUser } from 'src/auth/decorators/user.decorator';
import { UserListInterceptor } from 'src/users/interceptors/user-list.interceptor';
import { CommentListInterceptor } from './interceptors/comment-list.interceptor';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentSingleInterceptor } from './interceptors/comment-single.interceptor';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @UseInterceptors(EventSingleInterceptor, ClassSerializerInterceptor)
  async create(
    @Body() createEventDto: CreateEventDto,
    @AuthUser() authUser: User
  ) {
    const event = await this.eventsService.create(createEventDto, authUser);
    event.attend = true;
    event.distance = 0;
    return event;
  }

  @Get()
  @UseInterceptors(EventListInterceptor, ClassSerializerInterceptor)
  findAll(@AuthUser() authUser: User) {
    return this.eventsService.findAll(authUser);
  }

  @Get(':id')
  @UseInterceptors(EventSingleInterceptor, ClassSerializerInterceptor)
  findOne(@Param('id') id: string, @AuthUser() authUser: User) {
    return this.eventsService.findOne(+id, authUser);
  }

  @Put(':id')
  @UseInterceptors(EventSingleInterceptor, ClassSerializerInterceptor)
  update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
    @AuthUser() authUser: User
  ) {
    return this.eventsService.update(+id, updateEventDto, authUser);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string, @AuthUser() authUser: User) {
    return this.eventsService.remove(+id, authUser);
  }

  @Get(':id/attend')
  @UseInterceptors(UserListInterceptor, ClassSerializerInterceptor)
  getAttendees(@Param('id') id: number) {
    return this.eventsService.getAttendees(id);
  }

  @Post(':id/attend')
  postAttend(@Param('id') id: number, @AuthUser() authUser: User) {
    return this.eventsService.postAttend(id, authUser);
  }

  @Delete(':id/attend')
  @HttpCode(204)
  deleteAttend(@Param('id') id: number, @AuthUser() authUser: User) {
    return this.eventsService.deleteAttend(id, authUser);
  }

  @Get(':id/comments')
  @UseInterceptors(CommentListInterceptor, ClassSerializerInterceptor)
  getComments(@Param('id') id: number) {
    return this.eventsService.getComments(id);
  }

  @Post(':id/comments')
  @UseInterceptors(CommentSingleInterceptor, ClassSerializerInterceptor)
  postComment(
    @Param('id') id: number,
    @AuthUser() authUser: User,
    @Body() commentDto: CreateCommentDto
  ) {
    return this.eventsService.postComment(id, authUser, commentDto);
  }
}
