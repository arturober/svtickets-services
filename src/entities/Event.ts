import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { CreateEventDto } from 'src/events/dto/create-event.dto';
import { User } from './User';
import { UserAttendEvent } from './UserAttendEvent';

@Entity()
export class Event {
  @PrimaryKey()
  id!: number;

  @ManyToOne({
    entity: () => User,
    fieldName: 'creator',
    index: 'creator',
  })
  creator!: User;

  @OneToMany('UserAttendEvent', 'event')
  usersAttend = new Collection<UserAttendEvent>(this);

  @Property({ length: 300 })
  title!: string;

  @Property({ length: 4000 })
  description!: string;

  @Property()
  date!: string;

  @Property()
  price!: number;

  @Property({ columnType: 'double' })
  lat!: number;

  @Property({ columnType: 'double' })
  lng!: number;

  @Property({ length: 400 })
  address!: string;

  @Property({ length: 200 })
  image!: string;

  @Property({ fieldName: 'numAttend' })
  numAttend = 0;

  @Property({ persist: false })
  distance?: number;

  @Property({ persist: false })
  attend?: boolean;

  @Property({ persist: false })
  mine?: boolean;

  constructor(eventDto: CreateEventDto) {
    Object.assign(this, eventDto);
  }
}
