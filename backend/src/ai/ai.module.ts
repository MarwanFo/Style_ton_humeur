import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { TryOnService } from './try-on.service';

@Module({
  providers: [AiService, TryOnService],
  exports: [AiService, TryOnService],
})
export class AiModule {}
