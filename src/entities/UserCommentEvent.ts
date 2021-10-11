import {
  Entity,
  Index,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { UserAttendEvent } from './UserAttendEvent';

@Entity()
@Index({ name: 'event', properties: ['event', 'user'] })
export class UserCommentEvent {
  @PrimaryKey()
  id!: number;

  @ManyToOne({
    entity: () => UserAttendEvent,
    fieldName: 'event',
    onDelete: 'cascade',
  })
  event!: UserAttendEvent;

  @ManyToOne({
    entity: () => UserAttendEvent,
    fieldName: 'user',
    onDelete: 'cascade',
  })
  user!: UserAttendEvent;

  @Property({ length: 2000 })
  comment!: string;

  @Property({ columnType: 'timestamp', defaultRaw: `CURRENT_TIMESTAMP` })
  date!: Date;
}
