import { Module } from '@nestjs/common';
import { SentimentsService } from './sentiments.service';
import { SentimentsController } from './sentiments.controller';
import { AiModule } from '../ai/ai.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [AiModule, CloudinaryModule],
  providers: [SentimentsService],
  controllers: [SentimentsController],
  exports: [SentimentsService],
})
export class SentimentsModule {}
