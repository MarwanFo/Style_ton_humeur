import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { MusicService } from './music.service';
import { CreateMusicFeedbackDto } from './dto/music-feedback.dto';
import { AutoMusicRecommendationDto } from './dto/auto-music-recommendation.dto';
import { MusicFacadeService } from './music-facade.service';

@Controller('music')
export class MusicController {
  constructor(
    private readonly musicService: MusicService,
    private readonly musicFacadeService: MusicFacadeService,
  ) {}

  @Get('auto')
  async getAutomaticRecommendations(@Query('userId') userId: string) {
    return this.musicFacadeService.getAutomaticRecommendations({
      userId: parseInt(userId),
    });
  }

  @Post('manual')
  async getManualRecommendations(@Body() body: AutoMusicRecommendationDto) {
    return this.musicFacadeService.getManualRecommendations(body);
  }

  @Post('feedback')
  async createFeedback(@Body() body: CreateMusicFeedbackDto) {
    return this.musicService.createFeedback(body);
  }
}
