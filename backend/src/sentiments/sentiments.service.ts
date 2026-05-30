import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class SentimentsService {
  private readonly logger = new Logger(SentimentsService.name);

  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
    private cloudinaryService: CloudinaryService,
  ) {}

  async analyzeSelfie(
    userId: number,
    data: { base64Image: string; mimeType: string; moodSelected?: string },
  ) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Utilisateur non trouvé');

    // 1. Run the VLM sentiment analysis
    const aiResult = await this.aiService.analyzeSentiment(
      data.base64Image,
      data.mimeType,
      {
        gender: user.gender,
        age: user.age,
        displayName: user.displayName,
      },
      data.moodSelected,
    );

    // 2. If no face detected, return early
    if (aiResult.is_face_valid === false) {
      return {
        isFaceValid: false,
        errorAlert:
          aiResult.error_alert ||
          "Je n'arrive pas à détecter votre visage. Prenez un selfie bien éclairé, de face ! 😊",
      };
    }

    // 3. Optionally upload selfie to Cloudinary for history
    let cloudinaryUrl: string | null = null;
    try {
      const mimePrefix = `data:${data.mimeType || 'image/jpeg'};base64,`;
      const fullBase64 = data.base64Image.startsWith('data:')
        ? data.base64Image
        : `${mimePrefix}${data.base64Image}`;
      cloudinaryUrl = await this.cloudinaryService.uploadImage(fullBase64, 'sentiments');
    } catch (e) {
      this.logger.warn('Cloudinary upload failed for sentiment selfie, continuing without.', e);
    }

    // 4. Return the complete analysis result
    return {
      isFaceValid: true,
      dominantEmotion: aiResult.dominant_emotion,
      verdict: aiResult.verdict,
      indicators: aiResult.indicators,
      facialReading: aiResult.facial_reading,
      conseilAura: aiResult.conseil_aura,
      imageUrl: cloudinaryUrl,
      analyzedAt: new Date().toISOString(),
    };
  }

  async getLastAnalysisDate(userId: number): Promise<Date | null> {
    // Check DailyCheckIn for sentiment data
    const checkin = await this.prisma.dailyCheckIn.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return checkin ? new Date(checkin.createdAt) : null;
  }
}
