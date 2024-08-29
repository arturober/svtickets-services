import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { UserAttendEvent } from './UserAttendEvent';

@Entity()
// @Index({ name: 'attendEvent', properties: ['event', 'user'] })
export class UserCommentEvent {
  @PrimaryKey()
  id!: number;

  @ManyToOne({
    entity: () => UserAttendEvent,
    fieldNames: ['user', 'event'],
  })
  attendEvent!: UserAttendEvent;

  @Property({ length: 2000 })
  comment!: string;

  @Property({ columnType: 'timestamp', defaultRaw: `CURRENT_TIMESTAMP` })
  date!: Date;
}
