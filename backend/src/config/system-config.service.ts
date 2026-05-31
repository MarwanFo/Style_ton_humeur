import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SystemConfigService {
  constructor(private prisma: PrismaService) {}

  async getConfig() {
    let config = await this.prisma.systemConfig.findFirst();
    if (!config) {
      // Seed default config if none exists
      config = await this.prisma.systemConfig.create({
        data: {
          id: 1,
          premiumPriceMad: 99.0,
          isTryOnPremium: true,
          isBeautyPremium: true,
          isVoicePremium: true,
          isSentimentsPremium: false,
          isMusicPremium: false,
        },
      });
    }
    return config;
  }

  async updateConfig(data: {
    premiumPriceMad?: number;
    isTryOnPremium?: boolean;
    isBeautyPremium?: boolean;
    isVoicePremium?: boolean;
    isSentimentsPremium?: boolean;
    isMusicPremium?: boolean;
  }) {
    // Ensure at least one config exists to update
    const current = await this.getConfig();
    return this.prisma.systemConfig.update({
      where: { id: current.id },
      data,
    });
  }
}
