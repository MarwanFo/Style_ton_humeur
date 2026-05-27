import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { TryOnService } from './try-on.service';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [CloudinaryModule],
  providers: [AiService, TryOnService],
  exports: [AiService, TryOnService],
})
export class AiModule {}
