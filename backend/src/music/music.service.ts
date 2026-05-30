import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMusicRecommendationDto, MoodResultDto } from './dto/create-music-recommendation.dto';
import { MusicMappingService } from './music-mapping.service';
import { SpotifyApiService } from './spotify-api.service';
import { CreateMusicFeedbackDto } from './dto/music-feedback.dto';
import { FallbackMusicService } from './fallback-music.service';
import { CacheService } from './cache.service';

@Injectable()
export class MusicService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly musicMappingService: MusicMappingService,
    private readonly spotifyApiService: SpotifyApiService,
    private readonly fallbackMusicService: FallbackMusicService,
    private readonly cacheService: CacheService,
  ) {}

  async createRecommendations(dto: CreateMusicRecommendationDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: dto.userId },
      include: { profilePreferences: true },
    });
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    const moodResult = dto.moodResult || (await this.resolveMoodFromTodayCheckin(dto.userId));
    const userMusicPreferences = ((user.profilePreferences?.musicPreferences as string[]) || []).filter(Boolean);

    const spotifyParams = this.musicMappingService.buildSpotifyParams({
      moodPrincipal: moodResult.moodPrincipal,
      niveauEnergie: moodResult.niveauEnergie,
      userMusicPreferences,
    });

    const cacheKey = `music:${moodResult.moodPrincipal}:${moodResult.niveauEnergie}:${spotifyParams.seedGenres.join(',')}`;
    let tracks = this.cacheService.get<any[]>(cacheKey);

    if (!tracks) {
      tracks = await this.getTracksWithFallback(moodResult.moodPrincipal, spotifyParams);
      this.cacheService.set(cacheKey, tracks, 300);
    }

    const recommendation = await this.prisma.musicRecommendation.create({
      data: {
        userId: dto.userId,
        dailyCheckInId: (moodResult as any).dailyCheckInId || null,
        recommendationDate: new Date(),
        moodPrincipal: moodResult.moodPrincipal,
        niveauEnergie: moodResult.niveauEnergie,
        contexte: moodResult.contexte || null,
        spotifySeedGenres: spotifyParams.seedGenres,
        spotifyValence: spotifyParams.targetValence,
        spotifyEnergy: spotifyParams.targetEnergy,
        tracks: tracks || [],
      },
    });

    return {
      recommendationId: recommendation.id,
      userId: dto.userId,
      moodResult,
      recommendations: tracks,
    };
  }

  private async getTracksWithFallback(
    moodPrincipal: string,
    spotifyParams: {
      seedGenres: string[];
      targetValence: number;
      minValence: number;
      maxValence: number;
      targetEnergy: number;
      minEnergy: number;
      maxEnergy: number;
      targetDanceability: number;
      targetAcousticness: number;
    },
  ) {
    try {
      const spotifyTracks = await this.spotifyApiService.getRecommendations({
        ...spotifyParams,
        limit: 3,
      });

      if (spotifyTracks.length > 0) {
        return spotifyTracks;
      }
    } catch (error: any) {
      const status = error?.response?.status;
      const isTimeout = error?.code === 'ECONNABORTED';
      const isFallbackEligible = isTimeout || status === 429 || (status >= 500 && status < 600);
      if (!isFallbackEligible) {
        // Even for non-eligible errors we fallback to keep UX resilient.
      }
    }

    return this.fallbackMusicService.getFallbackTracks(moodPrincipal, 3);
  }

  async createFeedback(dto: CreateMusicFeedbackDto) {
    const recommendation = await this.prisma.musicRecommendation.findUnique({
      where: { id: dto.recommendationId },
    });
    if (!recommendation) {
      throw new NotFoundException('MusicRecommendation non trouvée');
    }

    return this.prisma.musicFeedback.create({
      data: {
        userId: recommendation.userId,
        musicRecommendationId: dto.recommendationId,
        trackId: dto.trackId,
        liked: dto.liked,
      },
    });
  }

  private async resolveMoodFromTodayCheckin(userId: number): Promise<MoodResultDto & { dailyCheckInId: number }> {
    const today = new Date(new Date().toISOString().split('T')[0]);
    const checkin = await this.prisma.dailyCheckIn.findFirst({
      where: {
        userId,
        checkinDate: today,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!checkin) {
      throw new NotFoundException(
        "Aucun moodResult fourni et aucun DailyCheckIn trouvé pour aujourd'hui.",
      );
    }

    const answers = (checkin.answers as Record<string, unknown>) || {};
    const niveauEnergie = (answers.niveauEnergie as string) || this.inferEnergyFromMood(checkin.moodDetected);

    return {
      dailyCheckInId: checkin.id,
      moodPrincipal: (checkin.moodDetected as MoodResultDto['moodPrincipal']) || 'calme',
      niveauEnergie: (niveauEnergie as MoodResultDto['niveauEnergie']) || 'moyen',
      contexte: (answers.contexte as string) || 'daily_checkin',
    };
  }

  private inferEnergyFromMood(mood: string): MoodResultDto['niveauEnergie'] {
    const normalized = mood?.toLowerCase?.() || '';
    if (['joyeux', 'énergique', 'confiant'].includes(normalized)) {
      return 'élevé';
    }
    if (['mélancolique', 'calme', 'stressé'].includes(normalized)) {
      return 'faible';
    }
    return 'moyen';
  }
}
