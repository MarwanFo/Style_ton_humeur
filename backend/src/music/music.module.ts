import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MusicController } from './music.controller';
import { MusicService } from './music.service';
import { MusicMappingService } from './music-mapping.service';
import { SpotifyApiService } from './spotify-api.service';
import { FallbackMusicService } from './fallback-music.service';
import { CacheService } from './cache.service';
import { UserMoodProvider } from './user-mood-provider.service';
import { QuestionnaireMoodService } from './questionnaire-mood.service';
import { SpotifyRecommendationService } from './spotify-recommendation.service';
import { MusicFacadeService } from './music-facade.service';
import { DailyScansVerificationService } from './daily-scans-verification.service';

@Module({
  imports: [HttpModule],
  controllers: [MusicController],
  providers: [
    MusicService,
    MusicMappingService,
    SpotifyApiService,
    FallbackMusicService,
    CacheService,
    UserMoodProvider,
    QuestionnaireMoodService,
    SpotifyRecommendationService,
    MusicFacadeService,
    DailyScansVerificationService,
  ],
  exports: [MusicService],
})
export class MusicModule {}
