import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { Inject, Request } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryKey()
  id!: number;

  @Property({ length: 200 })
  name!: string;

  @Property({ length: 250 })
  email!: string;

  @Property({ length: 100 })
  @Exclude({ toPlainOnly: true })
  password?: string;

  @Property({ length: 250 })
  avatar!: string;

  @Property({ columnType: 'double' })
  lat!: number;

  @Property({ columnType: 'double' })
  lng!: number;

  @Property({ length: 200 })
  @Exclude({ toPlainOnly: true })
  firebaseToken!: string;

  @Property({ persist: false })
  me?: boolean;

  constructor(@Inject(REQUEST) private request: Request) {}
}
