import { Controller, Post, Get, Put, Body, Param, UseGuards, Request, HttpException, HttpStatus, ParseIntPipe } from '@nestjs/common';
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

  @Put('recommendations/:id/music-feedback')
  async updateMusicFeedback(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { trackIndex: number; liked?: boolean; disliked?: boolean; isFavorite?: boolean },
  ) {
    const userId = req.user.userId;
    return this.checkinsService.updateMusicFeedback(userId, id, body);
  }

  @Post('scan-style')
  async createVisualCheckIn(
    @Request() req,
    @Body() body: { base64Image: string, mimeType: string, height?: number, origin?: string }
  ) {
    const userId = req.user.userId;
    return this.checkinsService.createVisualCheckIn(userId, body);
  }

  @Post('voice-checkin')
  async createVoiceCheckIn(
    @Request() req,
    @Body() body: { base64Audio: string, mimeType: string }
  ) {
    if (!body.base64Audio || !body.mimeType) {
      throw new HttpException('Données audio manquantes.', HttpStatus.BAD_REQUEST);
    }
    const userId = req.user.userId;
    return this.checkinsService.createVoiceCheckIn(userId, body);
  }

  @Post('add-photo')
  async addPhotoToCheckIn(
    @Request() req,
    @Body() body: { checkinId: number; base64Image: string; mimeType: string }
  ) {
    if (!body.checkinId || !body.base64Image) {
      throw new HttpException('Données de l\'image manquantes.', HttpStatus.BAD_REQUEST);
    }
    const userId = req.user.userId;
    return this.checkinsService.addPhotoToCheckIn(userId, body.checkinId, body.base64Image, body.mimeType);
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
