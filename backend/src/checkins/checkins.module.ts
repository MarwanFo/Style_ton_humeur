import { Module } from '@nestjs/common';
import { CheckinsService } from './checkins.service';
import { CheckinsController } from './checkins.controller';
import { AiModule } from '../ai/ai.module';
import { WeatherModule } from '../weather/weather.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [AiModule, WeatherModule, CloudinaryModule],
  providers: [CheckinsService],
  controllers: [CheckinsController],
  exports: [CheckinsService],
})
export class CheckinsModule {}
