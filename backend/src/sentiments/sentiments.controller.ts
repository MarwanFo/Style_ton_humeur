import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { SentimentsService } from './sentiments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('sentiments')
@UseGuards(JwtAuthGuard)
export class SentimentsController {
  constructor(private sentimentsService: SentimentsService) {}

  @Post('analyze')
  async analyzeSelfie(
    @Request() req,
    @Body() body: { base64Image: string; mimeType: string; moodSelected?: string },
  ) {
    const userId = req.user.userId;
    return this.sentimentsService.analyzeSelfie(userId, body);
  }

  @Post('analyze-voice')
  async analyzeVoice(
    @Request() req,
    @Body() body: { base64Audio: string; mimeType: string; moodSelected?: string },
  ) {
    const userId = req.user.userId;
    return this.sentimentsService.analyzeVoice(userId, body);
  }

  @Get('history')
  async getHistory(@Request() req) {
    const userId = req.user.userId;
    return this.sentimentsService.getHistory(userId);
  }

  @Get('comparison')
  async getComparison(@Request() req) {
    const userId = req.user.userId;
    return this.sentimentsService.getComparison(userId);
  }
}
