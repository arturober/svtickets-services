import { Entity, ManyToOne, PrimaryKeyProp, Property } from '@mikro-orm/core';
import { Event } from './Event';
import { User } from './User';

@Entity()
export class UserAttendEvent {
  @ManyToOne({
    entity: () => User,
    fieldName: 'user',
    primary: true,
  })
  user!: User;

  @ManyToOne({
    entity: () => Event,
    fieldName: 'event',
    primary: true,
    index: 'user_attend_event_ibfk_2',
  })
  event!: Event;

  [PrimaryKeyProp]: ['user', 'event'];

  @Property({ columnType: 'smallint' })
  tickets = 1;
}
