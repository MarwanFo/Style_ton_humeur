import { Controller, Post, Get, Body, UseGuards, Request, HttpException, HttpStatus } from '@nestjs/common';
import { CheckinsService } from './checkins.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TryOnService } from '../ai/try-on.service';

@Controller('checkins')
@UseGuards(JwtAuthGuard)
export class CheckinsController {
  constructor(
    private checkinsService: CheckinsService,
    private tryOnService: TryOnService
  ) {}

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

  @Post('virtual-try-on')
  async generateTryOn(
    @Request() req,
    @Body() body: { humanImageUrl: string, garmentImageUrl: string }
  ) {
    if (!body.humanImageUrl || !body.garmentImageUrl) {
      throw new HttpException('Images manquantes.', HttpStatus.BAD_REQUEST);
    }
    const tryOnResultUrl = await this.tryOnService.generateTryOn(body.humanImageUrl, body.garmentImageUrl);
    if (!tryOnResultUrl) {
      throw new HttpException('Erreur de génération VTON.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return { success: true, tryOnUrl: tryOnResultUrl };
  }
}
