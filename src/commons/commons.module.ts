import { Module } from '@nestjs/common';
import { ImageService } from './image/image.service';
import { FirebaseService } from './firebase/firebase.service';

@Module({
  providers: [ImageService],
  exports: [ImageService, FirebaseService],
})
export class CommonsModule {}
