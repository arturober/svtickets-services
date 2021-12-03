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
  Query,
  ParseIntPipe,
  Optional,
  DefaultValuePipe,
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
  findAll(
    @AuthUser() authUser: User,
    @Query('creator', new DefaultValuePipe(0), ParseIntPipe)
    creator?: number,
    @Query('attending', new DefaultValuePipe(0), ParseIntPipe)
    attending?: number
  ) {
    if (creator) {
      return this.eventsService.findByUserCreator(authUser, creator);
    } else if (attending) {
      return this.eventsService.findByUserAttend(authUser, attending);
    } else {
      return this.eventsService.findAll(authUser);
    }
  }

  @Get(':id')
  @UseInterceptors(EventSingleInterceptor, ClassSerializerInterceptor)
  findOne(@Param('id', ParseIntPipe) id: number, @AuthUser() authUser: User) {
    return this.eventsService.findOne(id, authUser);
  }

  @Put(':id')
  @UseInterceptors(EventSingleInterceptor, ClassSerializerInterceptor)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEventDto: UpdateEventDto,
    @AuthUser() authUser: User
  ) {
    return this.eventsService.update(id, updateEventDto, authUser);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number, @AuthUser() authUser: User) {
    return this.eventsService.remove(id, authUser);
  }

  @Get(':id/attend')
  @UseInterceptors(UserListInterceptor, ClassSerializerInterceptor)
  getAttendees(@Param('id', ParseIntPipe) id: number) {
    return this.eventsService.getAttendees(id);
  }

  @Post(':id/attend')
  postAttend(
    @Param('id', ParseIntPipe) id: number,
    @AuthUser() authUser: User
  ) {
    return this.eventsService.postAttend(id, authUser);
  }

  @Delete(':id/attend')
  @HttpCode(204)
  deleteAttend(
    @Param('id', ParseIntPipe) id: number,
    @AuthUser() authUser: User
  ) {
    return this.eventsService.deleteAttend(id, authUser);
  }

  @Get(':id/comments')
  @UseInterceptors(CommentListInterceptor, ClassSerializerInterceptor)
  getComments(@Param('id', ParseIntPipe) id: number) {
    return this.eventsService.getComments(id);
  }

  @Post(':id/comments')
  @UseInterceptors(CommentSingleInterceptor, ClassSerializerInterceptor)
  postComment(
    @Param('id', ParseIntPipe) id: number,
    @AuthUser() authUser: User,
    @Body() commentDto: CreateCommentDto
  ) {
    return this.eventsService.postComment(id, authUser, commentDto);
  }
}
