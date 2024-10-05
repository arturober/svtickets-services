import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseInterceptors,
  ValidationPipe
} from '@nestjs/common';
import { AuthUser } from 'src/auth/decorators/user.decorator';
import { User } from 'src/entities/User';
import { UserListInterceptor } from 'src/users/interceptors/user-list.interceptor';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventsService } from './events.service';
import { CommentListInterceptor } from './interceptors/comment-list.interceptor';
import { CommentSingleInterceptor } from './interceptors/comment-single.interceptor';
import { EventListInterceptor } from './interceptors/event-list.interceptor';
import { EventSingleInterceptor } from './interceptors/event-single.interceptor';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @UseInterceptors(EventSingleInterceptor)
  async create(
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    createEventDto: CreateEventDto,
    @AuthUser() authUser: User
  ) {
    const event = await this.eventsService.create(createEventDto, authUser);
    return this.eventsService.findOne(event.id, authUser);
  }

  @Get()
  @UseInterceptors(EventListInterceptor)
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
  @UseInterceptors(EventSingleInterceptor)
  findOne(@Param('id', ParseIntPipe) id: number, @AuthUser() authUser: User) {
    return this.eventsService.findOne(id, authUser);
  }

  @Put(':id')
  @UseInterceptors(EventSingleInterceptor)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    updateEventDto: UpdateEventDto,
    @AuthUser() authUser: User
  ) {
    await this.eventsService.update(id, updateEventDto, authUser);
    return this.eventsService.findOne(id, authUser);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number, @AuthUser() authUser: User) {
    return this.eventsService.remove(id, authUser);
  }

  @Get(':id/attend')
  @UseInterceptors(UserListInterceptor)
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
  @UseInterceptors(CommentListInterceptor)
  getComments(@Param('id', ParseIntPipe) id: number) {
    return this.eventsService.getComments(id);
  }

  @Post(':id/comments')
  @UseInterceptors(CommentSingleInterceptor)
  postComment(
    @Param('id', ParseIntPipe) id: number,
    @AuthUser() authUser: User,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    commentDto: CreateCommentDto
  ) {
    return this.eventsService.postComment(id, authUser, commentDto);
  }
}
