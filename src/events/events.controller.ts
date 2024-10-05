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
import { EventFindOptions } from './interfaces/event-find-options';
import { Event } from 'src/entities/Event';

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
  async findAll(
    @AuthUser() authUser: User,
    @Query('creator', new DefaultValuePipe(0), ParseIntPipe)
    creator?: number,
    @Query('attending', new DefaultValuePipe(0), ParseIntPipe)
    attending?: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe)
    page?: number,
    @Query('order', new DefaultValuePipe('distance'))
    order?: string,
    @Query('search', new DefaultValuePipe(null))
    search?: string
  ) {
    if(!['distance', 'price', 'date'].includes(order)) {
      order = 'distance';
    }
    page = page < 1? 1 : page;
    const options: EventFindOptions = {
      page, order, search
    }
    let result: [Event[], number];
    if (creator) {
      result = await this.eventsService.findByUserCreator(authUser, creator, options);
    } else if (attending) {
      result = await this.eventsService.findByUserAttend(authUser, attending, options);
    } else {
      result = await this.eventsService.findAll(authUser, options);
    }

    const [events, count] = result;

    return {
      events,
      count,
      page,
      more: page * 12 < count
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
