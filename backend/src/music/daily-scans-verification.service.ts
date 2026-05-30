import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DailyScansVerificationService {
  constructor(private readonly prisma: PrismaService) {}

  async verifyDailyScans(userId: number) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const missingScans: string[] = [];

    // 1. Check Style & Sentiment (both in DailyCheckIn)
    const todayCheckIn = await this.prisma.dailyCheckIn.findFirst({
      where: {
        userId,
        checkinDate: today,
      },
    });

    if (!todayCheckIn) {
      missingScans.push('style', 'sentiment');
    }

    // 2. Check Beauty (in BeautyRoutine)
    const todayBeauty = await this.prisma.recommendation.findFirst({
      where: {
        userId,
        recommendationDate: today,
      },
    });

    // On vérifie si le champ makeup n'est pas vide (signe qu'un scan beauté a été fait)
    if (!todayBeauty || !todayBeauty.makeup || Object.keys(todayBeauty.makeup as object).length === 0) {
      missingScans.push('beauty');
    }

    return {
      ready: missingScans.length === 0,
      missingScans,
    };
  }
}
