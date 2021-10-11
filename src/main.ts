import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.use('/img', express.static('img'));
  app.use(express.json({ limit: '10mb' }));
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  // try {
  //   // tslint:disable-next-line:no-var-requires
  //   const serviceAccount = await require('../firebase/serviceAccountKey.json');
  //   admin.initializeApp({
  //     credential: admin.credential.cert(serviceAccount),
  //     databaseURL: 'https://dwec2019.firebaseio.com',
  //   });
  // } catch(e) {}

  await app.listen(3000);
}
bootstrap();
