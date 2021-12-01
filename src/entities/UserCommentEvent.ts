import {
  Entity,
  Index,
  ManyToOne,
  PrimaryKey,
  PrimaryKeyType,
  Property,
} from '@mikro-orm/core';
import { User } from './User';
import { UserAttendEvent } from './UserAttendEvent';

@Entity()
// @Index({ name: 'attendEvent', properties: ['event', 'user'] })
export class UserCommentEvent {
  @PrimaryKey()
  id!: number;

  @ManyToOne({
    entity: () => UserAttendEvent,
    fieldNames: ['user', 'event'],
    onDelete: 'cascade',
  })
  attendEvent!: UserAttendEvent;

  @Property({ length: 2000 })
  comment!: string;

  @Property({ columnType: 'timestamp', defaultRaw: `CURRENT_TIMESTAMP` })
  date!: Date;
}
