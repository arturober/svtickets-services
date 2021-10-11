import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { Event } from './Event';
import { User } from './User';

@Entity()
export class UserAttendEvent {
  @ManyToOne({
    entity: () => User,
    fieldName: 'user',
    onUpdateIntegrity: 'cascade',
    onDelete: 'cascade',
    primary: true,
  })
  user!: User;

  @ManyToOne({
    entity: () => Event,
    fieldName: 'event',
    onUpdateIntegrity: 'cascade',
    onDelete: 'cascade',
    primary: true,
    index: 'user_attend_event_ibfk_2',
  })
  event!: Event;

  @Property({ columnType: 'smallint' })
  tickets = 1;
}
