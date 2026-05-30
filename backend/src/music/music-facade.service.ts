import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AutoMusicRecommendationDto } from './dto/auto-music-recommendation.dto';
import { UserMoodProvider, EnrichedMoodProfile } from './user-mood-provider.service';
import { QuestionnaireMoodService } from './questionnaire-mood.service';
import { SpotifyRecommendationService } from './spotify-recommendation.service';
import { DailyScansVerificationService } from './daily-scans-verification.service';

@Injectable()
export class MusicFacadeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userMoodProvider: UserMoodProvider,
    private readonly questionnaireMoodService: QuestionnaireMoodService,
    private readonly spotifyRecommendationService: SpotifyRecommendationService,
    private readonly dailyScansVerificationService: DailyScansVerificationService,
  ) {}

  async getAutomaticRecommendations(dto: AutoMusicRecommendationDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: dto.userId },
      include: { profilePreferences: true },
    });
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    // Verify daily scans
    const scanVerification = await this.dailyScansVerificationService.verifyDailyScans(dto.userId);

    if (!scanVerification.ready) {
      return {
        success: false,
        requiresScans: true,
        missingScans: scanVerification.missingScans,
        message: 'Complétez l\'analyse Style, Sentiments et Beauté pour obtenir des recommandations musicales personnalisées.',
        recommendations: [],
      };
    }

    // Option B: Automatic mode - get mood from other modules
    const moodProfile = await this.userMoodProvider.getMoodFromModules(dto.userId);

    if (!moodProfile) {
      return {
        success: false,
        requiresScans: true,
        message: 'Complétez l\'analyse Style, Sentiments et Beauté pour obtenir des recommandations musicales personnalisées.',
        recommendations: [],
      };
    }

    const musicPreferences = ((user.profilePreferences?.musicPreferences as string[]) || []).filter(Boolean);
    const generated = await this.spotifyRecommendationService.recommendFromMood(moodProfile, musicPreferences, true);

    const recommendation = await this.prisma.musicRecommendation.create({
      data: {
        userId: dto.userId,
        dailyCheckInId: moodProfile.dailyCheckInId || null,
        recommendationDate: new Date(),
        moodPrincipal: moodProfile.humeur_detectee,
        niveauEnergie: moodProfile.niveau_energie,
        contexte: moodProfile.contexte || null,
        spotifySeedGenres: generated.mapping.seedGenres,
        spotifyValence: generated.mapping.targetValence,
        spotifyEnergy: generated.mapping.targetEnergy,
        spotifyDanceability: generated.mapping.targetDanceability,
        spotifyAcousticness: generated.mapping.targetAcousticness,
        tracks: generated.recommendations,
      } as any,
    });

    return {
      success: true,
      requiresScans: false,
      recommendationId: recommendation.id,
      userId: dto.userId,
      moodResult: moodProfile,
      recommendations: generated.recommendations,
      mapping: generated.mapping,
      source: 'automatic',
    };
  }

  async getManualRecommendations(dto: AutoMusicRecommendationDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: dto.userId },
      include: { profilePreferences: true },
    });
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    // Option A: Manual mode - use questionnaire responses only
    if (!dto.questionnaire) {
      throw new NotFoundException('Questionnaire requis pour le mode manuel.');
    }

    const moodProfile = await this.questionnaireMoodService.saveQuestionnaireForToday(dto.userId, dto.questionnaire);

    if (!moodProfile) {
      throw new NotFoundException('Profil émotionnel indisponible.');
    }

    const musicPreferences = ((user.profilePreferences?.musicPreferences as string[]) || []).filter(Boolean);
    const generated = await this.spotifyRecommendationService.recommendFromMood(moodProfile, musicPreferences);

    const recommendation = await this.prisma.musicRecommendation.create({
      data: {
        userId: dto.userId,
        dailyCheckInId: moodProfile.dailyCheckInId || null,
        recommendationDate: new Date(),
        moodPrincipal: moodProfile.humeur_detectee,
        niveauEnergie: moodProfile.niveau_energie,
        contexte: moodProfile.contexte || null,
        spotifySeedGenres: generated.mapping.seedGenres,
        spotifyValence: generated.mapping.targetValence,
        spotifyEnergy: generated.mapping.targetEnergy,
        spotifyDanceability: generated.mapping.targetDanceability,
        spotifyAcousticness: generated.mapping.targetAcousticness,
        tracks: generated.recommendations,
      } as any,
    });

    return {
      success: true,
      recommendationId: recommendation.id,
      userId: dto.userId,
      moodResult: moodProfile,
      recommendations: generated.recommendations,
      mapping: generated.mapping,
      source: 'manual',
    };
  }
}
