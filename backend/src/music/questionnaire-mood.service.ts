import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MoodQuestionnaireDto } from './dto/auto-music-recommendation.dto';
import { EnrichedMoodProfile } from './user-mood-provider.service';

@Injectable()
export class QuestionnaireMoodService {
  constructor(private readonly prisma: PrismaService) {}

  async getTodayQuestionnaireMood(userId: number): Promise<EnrichedMoodProfile | null> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) return null;

    const record = await (this.prisma as any).dailyMoodQuestionnaire.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    if (!record) return null;

    // Résilience fuseaux horaires : Moins de 20 heures
    const isFromToday = (new Date().getTime() - new Date(record.createdAt).getTime()) < 20 * 60 * 60 * 1000;
    if (!isFromToday) return null;

    return {
      humeur_detectee: record.humeurDetectee,
      niveau_energie: record.niveauEnergie,
      contexte: record.contexte || 'travail',
      age: user.age,
      genre: user.gender,
      tags_style: [],
      source: 'modules',
    };
  }

  async saveQuestionnaireForToday(userId: number, questionnaire: MoodQuestionnaireDto): Promise<EnrichedMoodProfile> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    const today = new Date(new Date().toISOString().split('T')[0]);
    await (this.prisma as any).dailyMoodQuestionnaire.upsert({
      where: {
        userId_date: {
          userId,
          date: today,
        },
      },
      update: {
        humeurDetectee: questionnaire.humeur_detectee,
        niveauEnergie: questionnaire.niveau_energie,
        contexte: questionnaire.contexte || null,
      },
      create: {
        userId,
        date: today,
        humeurDetectee: questionnaire.humeur_detectee,
        niveauEnergie: questionnaire.niveau_energie,
        contexte: questionnaire.contexte || null,
      },
    });

    return {
      humeur_detectee: questionnaire.humeur_detectee,
      niveau_energie: questionnaire.niveau_energie,
      contexte: questionnaire.contexte || 'travail',
      age: user.age,
      genre: user.gender,
      tags_style: [],
      source: 'modules',
    };
  }
}
