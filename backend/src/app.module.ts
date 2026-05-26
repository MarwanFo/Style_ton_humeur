import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { WeatherModule } from './weather/weather.module';
import { AiModule } from './ai/ai.module';
import { CheckinsModule } from './checkins/checkins.module';
import { SentimentsModule } from './sentiments/sentiments.module';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule, WeatherModule, AiModule, CheckinsModule, SentimentsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

