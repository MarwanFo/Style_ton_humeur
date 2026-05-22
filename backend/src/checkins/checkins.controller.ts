import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { CheckinsService } from './checkins.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('checkins')
@UseGuards(JwtAuthGuard)
export class CheckinsController {
  constructor(private checkinsService: CheckinsService) {}

  @Post()
  async createCheckIn(
    @Request() req,
    @Body()
    body: {
      latitude?: number;
      longitude?: number;
      answers: any;
      moodSelected?: string;
    },
  ) {
    const userId = req.user.userId;
    return this.checkinsService.createCheckIn(userId, body);
  }

  @Post('scan-style')
  async createVisualCheckIn(
    @Request() req,
    @Body() body: { base64Image: string, mimeType: string, height?: number, origin?: string }
  ) {
    const userId = req.user.userId;
    return this.checkinsService.createVisualCheckIn(userId, body);
  }

  @Get('streak')
  async getStreak(@Request() req) {
    const userId = req.user.userId;
    return this.checkinsService.getStreak(userId);
  }

  @Get('badges')
  async getBadges(@Request() req) {
    const userId = req.user.userId;
    return this.checkinsService.getUserBadges(userId);
  }
}
