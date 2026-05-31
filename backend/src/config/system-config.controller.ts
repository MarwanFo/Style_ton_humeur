import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { SystemConfigService } from './system-config.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@Controller('system-config')
export class SystemConfigController {
  constructor(private readonly configService: SystemConfigService) {}

  // Public endpoint — returns feature flags & pricing (no sensitive data)
  @Get()
  async getConfig() {
    return this.configService.getConfig();
  }

  // Admin-only endpoint — requires valid JWT + ADMIN role
  @Patch()
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateConfig(
    @Body()
    body: {
      premiumPriceMad?: number;
      isTryOnPremium?: boolean;
      isBeautyPremium?: boolean;
      isVoicePremium?: boolean;
      isSentimentsPremium?: boolean;
      isMusicPremium?: boolean;
    },
  ) {
    return this.configService.updateConfig(body);
  }
}
