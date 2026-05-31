import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DailyScansVerificationService {
  constructor(private readonly prisma: PrismaService) {}

  async verifyDailyScans(userId: number) {
    const todayCheckin = await this.prisma.dailyCheckIn.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    if (!todayCheckin) {
      return {
        ready: false,
        missingScans: ['style_or_sentiment'],
      };
    }

    // Résilience fuseaux horaires : moins de 16 heures
    const ready = (new Date().getTime() - new Date(todayCheckin.createdAt).getTime()) < 16 * 60 * 60 * 1000;

    return {
      ready,
      missingScans: ready ? [] : ['style_or_sentiment'],
    };
  }
}
