import { EntityRepository, QueryOrder } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ImageService } from 'src/commons/image/image.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from '../entities/Event';
import { EventsRepository } from './events.repository';
import { User } from 'src/entities/User';
import { UserAttendEvent } from 'src/entities/UserAttendEvent';
import { UserCommentEvent } from 'src/entities/UserCommentEvent';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: EventsRepository,
    @InjectRepository(UserAttendEvent)
    private readonly attendRepository: EntityRepository<UserAttendEvent>,
    @InjectRepository(UserCommentEvent)
    private readonly commentRepository: EntityRepository<UserCommentEvent>,
    private readonly imageService: ImageService
  ) {}

  private async getAndCheckEvent(
    authUser: User,
    id: number,
    relations: string[] = []
  ): Promise<Event> {
    const event = await this.eventRepository.findOne({ id }, relations);
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    if (event.creator.id !== authUser.id) {
      throw new ForbiddenException('This is not your event');
    }
    return event;
  }

  async create(createDto: CreateEventDto, authUser: User) {
    const imageUrl = await this.imageService.saveImage(
      'events',
      createDto.image
    );
    createDto.image = imageUrl;
    const event = new Event(createDto);
    event.creator = authUser;

    await this.eventRepository.persistAndFlush(event);
    return event;
  }

  async findAll(authUser: User) {
    return this.eventRepository.findByDistance(
      authUser.lat,
      authUser.lng,
      authUser.id
    );
  }

  async findOne(id: number, authUser: User) {
    const event = await this.eventRepository.findById(
      id,
      authUser.lat,
      authUser.lng,
      authUser.id
    );
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    return event;
  }

  async update(id: number, updateEventDto: UpdateEventDto, authUser: User) {
    const event = await this.getAndCheckEvent(authUser, id, ['creator']);
    event.description = updateEventDto.description;
    event.title = updateEventDto.title;
    event.address = updateEventDto.address;
    event.lat = updateEventDto.lat;
    event.lng = updateEventDto.lng;
    event.date = updateEventDto.date;
    event.price = updateEventDto.price;
    if (!updateEventDto.image.startsWith('http')) {
      event.image = await this.imageService.saveImage(
        'events',
        updateEventDto.image
      );
    }

    await this.eventRepository.persistAndFlush(event);
    return event;
  }

  async remove(id: number, authUser: User) {
    const event = await this.getAndCheckEvent(authUser, id, ['creator']);
    await this.eventRepository.removeAndFlush(event);
  }

  async getAttendees(id: number) {
    const attends = await this.attendRepository.find(
      { event: id },
      { populate: ['user'] }
    );
    return attends.map((a) => a.user);
  }

  async postAttend(id: number, authUser: User) {
    const attend = await this.attendRepository.findOne({
      user: authUser.id,
      event: id,
    });

    if (attend) {
      throw new BadRequestException("You can't attend this event twice");
    }

    const event = await this.eventRepository.findOne(id);
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    const newAttend = new UserAttendEvent();
    newAttend.event = event;
    newAttend.user = authUser;
    await this.attendRepository.persistAndFlush(newAttend);
    return { tickets: newAttend.tickets };
  }

  async deleteAttend(id: number, authUser: User) {
    const attend = await this.attendRepository.findOne({
      user: authUser.id,
      event: id,
    });

    if (!attend) {
      throw new NotFoundException('You are not attending this event');
    }

    await this.attendRepository.removeAndFlush(attend);
  }

  async getComments(id: number) {
    const comments = await this.commentRepository.find(
      { attendEvent: { event: id } },
      { populate: ['attendEvent.user'], orderBy: { date: QueryOrder.DESC } }
    );
    return comments;
  }

  async postComment(id: number, authUser: User, commentDto: CreateCommentDto) {
    const attend = await this.attendRepository.findOne({
      user: authUser.id,
      event: id,
    });

    if (!attend) {
      throw new BadRequestException(
        "You can't comment on a event you are not attending to"
      );
    }

    const comment = new UserCommentEvent();
    comment.comment = commentDto.comment;
    comment.attendEvent = attend;

    await this.commentRepository.persistAndFlush(comment);
    comment.date = new Date();
    return comment;
  }
}
