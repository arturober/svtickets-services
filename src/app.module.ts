import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from './events/events.module';
import { CommonsModule } from './commons/commons.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import mikroOrmConfig from './mikro-orm.config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    AuthModule.forRoot({
      googleId: 'YOUR GOOGLE ID (same as the client)',
    }),
    UsersModule,
    EventsModule,
    CommonsModule,
    MikroOrmModule.forRoot(mikroOrmConfig),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
