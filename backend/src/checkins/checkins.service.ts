import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';
import { WeatherService } from '../weather/weather.service';
import { differenceInCalendarDays, isSameWeek } from 'date-fns';

@Injectable()
export class CheckinsService {
  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
    private weatherService: WeatherService,
  ) {}

  async createCheckIn(
    userId: number,
    data: {
      latitude?: number;
      longitude?: number;
      answers: any;
      moodSelected?: string;
    },
  ) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const today = new Date(todayStr);

    const existingCheckin = await this.prisma.dailyCheckIn.findFirst({
      where: {
        userId,
        checkinDate: today,
      },
    });

    if (existingCheckin) {
      // Pour les tests : on supprime l'ancien check-in d'aujourd'hui pour pouvoir recommencer
      await this.prisma.recommendation.deleteMany({ where: { checkinId: existingCheckin.id } });
      await this.prisma.dailyCheckIn.delete({ where: { id: existingCheckin.id } });
    }

    let weather: { temp: number; code: number } | null = null;
    if (data.latitude && data.longitude) {
      weather = await this.weatherService.getCurrentWeather(data.latitude, data.longitude);
    }

    const aiResult = await this.aiService.getRecommendations(
      data.answers,
      { gender: user.gender, age: user.age },
      weather,
    );

    const moodDetected = aiResult.detected_mood || 'calme';
    const moodSelected = data.moodSelected || moodDetected;

    return this.prisma.$transaction(async (tx) => {
      const checkin = await tx.dailyCheckIn.create({
        data: {
          userId,
          checkinDate: today,
          moodDetected,
          moodSelected,
          answers: data.answers,
        },
      });

      const recommendation = await tx.recommendation.create({
        data: {
          userId,
          checkinId: checkin.id,
          recommendationDate: today,
          outfits: aiResult.outfits,
          makeup: aiResult.makeup,
          music: aiResult.music,
        },
      });

      let streak = await tx.streak.findUnique({ where: { userId } });
      if (!streak) {
        streak = await tx.streak.create({
          data: {
            userId,
            currentStreak: 0,
            maxStreak: 0,
          },
        });
      }

      const updatedStreakState = this.calculateNewStreakState(today, {
        currentStreak: streak.currentStreak,
        maxStreak: streak.maxStreak,
        lastCheckinDate: streak.lastCheckinDate,
        weeklyFreezeUsedDate: streak.weeklyFreezeUsedDate,
      });

      await tx.streak.update({
        where: { userId },
        data: {
          currentStreak: updatedStreakState.currentStreak,
          maxStreak: updatedStreakState.maxStreak,
          lastCheckinDate: updatedStreakState.lastCheckinDate,
          weeklyFreezeUsedDate: updatedStreakState.weeklyFreezeUsedDate,
        },
      });

      const awardedBadges = await this.checkAndAwardBadges(tx, userId, updatedStreakState.currentStreak);

      return {
        checkin,
        recommendation,
        streak: updatedStreakState,
        awardedBadges,
      };
    });
  }

  async createVisualCheckIn(
    userId: number,
    data: { base64Image: string; mimeType: string },
  ) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Utilisateur non trouvé');

    const todayStr = new Date().toISOString().split('T')[0];
    const today = new Date(todayStr);

    const existingCheckin = await this.prisma.dailyCheckIn.findFirst({
      where: { userId, checkinDate: today },
    });
    if (existingCheckin) {
      // Pour les tests : on supprime l'ancien check-in d'aujourd'hui pour pouvoir recommencer
      await this.prisma.recommendation.deleteMany({ where: { checkinId: existingCheckin.id } });
      await this.prisma.dailyCheckIn.delete({ where: { id: existingCheckin.id } });
    }

    const aiResult = await this.aiService.analyzeImage(
      data.base64Image,
      data.mimeType,
      { gender: user.gender, age: user.age }
    );

    const moodDetected = aiResult.detected_mood || 'confiant';
    const moodSelected = moodDetected;

    return this.prisma.$transaction(async (tx) => {
      const checkin = await tx.dailyCheckIn.create({
        data: {
          userId,
          checkinDate: today,
          moodDetected,
          moodSelected,
          answers: { source: 'camera_scan' },
        },
      });

      const recommendation = await tx.recommendation.create({
        data: {
          userId,
          checkinId: checkin.id,
          recommendationDate: today,
          outfits: aiResult.outfits,
          makeup: aiResult.makeup,
          music: aiResult.music,
        },
      });

      let streak = await tx.streak.findUnique({ where: { userId } });
      if (!streak) {
        streak = await tx.streak.create({ data: { userId, currentStreak: 0, maxStreak: 0 } });
      }

      const updatedStreakState = this.calculateNewStreakState(today, {
        currentStreak: streak.currentStreak,
        maxStreak: streak.maxStreak,
        lastCheckinDate: streak.lastCheckinDate,
        weeklyFreezeUsedDate: streak.weeklyFreezeUsedDate,
      });

      await tx.streak.update({
        where: { userId },
        data: {
          currentStreak: updatedStreakState.currentStreak,
          maxStreak: updatedStreakState.maxStreak,
          lastCheckinDate: updatedStreakState.lastCheckinDate,
          weeklyFreezeUsedDate: updatedStreakState.weeklyFreezeUsedDate,
        },
      });

      const awardedBadges = await this.checkAndAwardBadges(tx, userId, updatedStreakState.currentStreak);

      return { checkin, recommendation, streak: updatedStreakState, awardedBadges };
    });
  }

  private calculateNewStreakState(
    checkInDate: Date,
    state: {
      currentStreak: number;
      maxStreak: number;
      lastCheckinDate: Date | null;
      weeklyFreezeUsedDate: Date | null;
    },
  ) {
    const newState = { ...state };
    
    if (!state.lastCheckinDate) {
      newState.currentStreak = 1;
      newState.maxStreak = 1;
      newState.lastCheckinDate = checkInDate;
      return newState;
    }

    const lastDate = new Date(state.lastCheckinDate);
    lastDate.setHours(0, 0, 0, 0);
    const currentDate = new Date(checkInDate);
    currentDate.setHours(0, 0, 0, 0);

    const daysDifference = differenceInCalendarDays(currentDate, lastDate);

    if (daysDifference === 0) {
      return newState;
    }

    if (daysDifference === 1) {
      newState.currentStreak += 1;
      newState.lastCheckinDate = currentDate;
      if (newState.currentStreak > newState.maxStreak) {
        newState.maxStreak = newState.currentStreak;
      }
      return newState;
    }

    if (daysDifference > 1) {
      const missedDayDate = new Date(lastDate);
      missedDayDate.setDate(missedDayDate.getDate() + 1);

      const hasAlreadyUsedFreezeThisWeek = 
        state.weeklyFreezeUsedDate && 
        isSameWeek(new Date(state.weeklyFreezeUsedDate), missedDayDate, { weekStartsOn: 1 });

      if (daysDifference === 2 && !hasAlreadyUsedFreezeThisWeek) {
        newState.weeklyFreezeUsedDate = missedDayDate;
        newState.currentStreak += 1; 
        newState.lastCheckinDate = currentDate;
        
        if (newState.currentStreak > newState.maxStreak) {
          newState.maxStreak = newState.currentStreak;
        }
      } else {
        newState.currentStreak = 1; 
        newState.lastCheckinDate = currentDate;
      }
    }

    return newState;
  }

  private async checkAndAwardBadges(tx: any, userId: number, currentStreak: number) {
    await this.seedBadgesIfNeeded(tx);

    const badges = await tx.badge.findMany();
    const awardedList: any[] = [];

    const totalCheckinsCount = await tx.dailyCheckIn.count({ where: { userId } });

    for (const badge of badges) {
      const criteria = badge.criteria as any;
      let targetProgress = 0;
      let currentProgress = 0;

      if (criteria.type === 'streak') {
        targetProgress = criteria.target;
        currentProgress = currentStreak;
      } else if (criteria.type === 'checkin') {
        targetProgress = criteria.target;
        currentProgress = totalCheckinsCount;
      }

      if (targetProgress > 0) {
        let userBadge = await tx.userBadge.findUnique({
          where: {
            userId_badgeId: { userId, badgeId: badge.id },
          },
        });

        if (!userBadge) {
          userBadge = await tx.userBadge.create({
            data: {
              userId,
              badgeId: badge.id,
              progress: Math.min(currentProgress, targetProgress),
              unlockedAt: currentProgress >= targetProgress ? new Date() : null,
            },
          });
          if (userBadge.unlockedAt) awardedList.push(badge);
        } else if (!userBadge.unlockedAt && currentProgress >= targetProgress) {
          await tx.userBadge.update({
            where: {
              userId_badgeId: { userId, badgeId: badge.id },
            },
            data: {
              progress: targetProgress,
              unlockedAt: new Date(),
            },
          });
          awardedList.push(badge);
        } else if (!userBadge.unlockedAt) {
          await tx.userBadge.update({
            where: {
              userId_badgeId: { userId, badgeId: badge.id },
            },
            data: {
              progress: Math.min(currentProgress, targetProgress),
            },
          });
        }
      }
    }
    return awardedList;
  }

  private async seedBadgesIfNeeded(tx: any) {
    const defaultBadges = [
      { code: 'FIRST_CHECKIN', name: 'Premier Pas', description: 'Effectuer votre premier check-in quotidien.', criteria: { type: 'checkin', target: 1 } },
      { code: 'STREAK_3', name: 'Habitude naissante', description: 'Atteindre un streak de 3 jours.', criteria: { type: 'streak', target: 3 } },
      { code: 'STREAK_7', name: 'Semaine parfaite', description: 'Atteindre un streak de 7 jours.', criteria: { type: 'streak', target: 7 } },
    ];

    for (const b of defaultBadges) {
      await tx.badge.upsert({
        where: { code: b.code },
        update: {},
        create: b,
      });
    }
  }

  async getStreak(userId: number) {
    let streak = await this.prisma.streak.findUnique({ where: { userId } });
    if (!streak) {
      streak = await this.prisma.streak.create({
        data: {
          userId,
          currentStreak: 0,
          maxStreak: 0,
        },
      });
    }
    return streak;
  }

  async getUserBadges(userId: number) {
    return this.prisma.userBadge.findMany({
      where: { userId },
      include: { badge: true },
    });
  }
}
