import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Event } from '../entities/Event';
import { CommonsModule } from 'src/commons/commons.module';
import { UserAttendEvent } from 'src/entities/UserAttendEvent';
import { UserCommentEvent } from 'src/entities/UserCommentEvent';

@Module({
  imports: [
    CommonsModule,
    MikroOrmModule.forFeature([Event, UserAttendEvent, UserCommentEvent]),
  ],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
