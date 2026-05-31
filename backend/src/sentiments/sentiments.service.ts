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

    // 4. Save to DailyCheckIn if face is valid
    const todayStr = new Date().toISOString().split('T')[0];
    const today = new Date(todayStr);

    const existingCheckin = await this.prisma.dailyCheckIn.findFirst({
      where: { userId, checkinDate: today },
    });
    if (existingCheckin) {
      await this.prisma.recommendation.deleteMany({ where: { checkinId: existingCheckin.id } });
      await this.prisma.dailyCheckIn.delete({ where: { id: existingCheckin.id } });
    }

    await this.prisma.dailyCheckIn.create({
      data: {
        userId,
        checkinDate: today,
        moodDetected: aiResult.dominant_emotion || 'calme',
        moodSelected: aiResult.dominant_emotion || 'calme',
        imageUrl: cloudinaryUrl,
        answers: {
          source: 'sentiment_scan',
          dominantEmotion: aiResult.dominant_emotion,
          verdict: aiResult.verdict,
        },
      },
    });

    // Save the sentiment scan to database!
    let savedScan;
    try {
      savedScan = await this.prisma.sentimentScan.create({
        data: {
          userId,
          dominantEmotion: aiResult.dominant_emotion,
          verdict: aiResult.verdict,
          indicators: aiResult.indicators,
          facialReading: aiResult.facial_reading,
          conseilAura: aiResult.conseil_aura,
          imageUrl: cloudinaryUrl,
        },
      });
    } catch (dbErr) {
      this.logger.error('Failed to save sentiment scan to database', dbErr);
    }

    // 5. Return the complete analysis result
    return {
      id: savedScan ? savedScan.id : null,
      isFaceValid: true,
      dominantEmotion: aiResult.dominant_emotion,
      verdict: aiResult.verdict,
      indicators: aiResult.indicators,
      facialReading: aiResult.facial_reading,
      conseilAura: aiResult.conseil_aura,
      imageUrl: cloudinaryUrl,
      analyzedAt: savedScan ? savedScan.createdAt.toISOString() : new Date().toISOString(),
    };
  }

  async analyzeVoice(
    userId: number,
    data: { base64Audio: string; mimeType: string; moodSelected?: string },
  ) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Utilisateur non trouvé');

    // 1. Try to transcribe voice audio (returns '' on failure — never throws)
    let transcript = await this.aiService.transcribeAudio(data.base64Audio, data.mimeType);

    // 2. If transcription failed/empty, fall back to the pre-selected mood as context
    if (!transcript || transcript.trim() === '') {
      this.logger.warn('Transcription returned empty. Using mood fallback for voice analysis.');
      if (data.moodSelected) {
        transcript = `L'utilisateur a indiqué se sentir "${data.moodSelected}" avant de parler.`;
      } else {
        transcript = "L'utilisateur a enregistré un message vocal sans texte intelligible détecté.";
      }
    }

    // 3. Decode emotion, tone & cadence from the transcript via AI LLM
    const aiResult = await this.aiService.analyzeVoiceSentiment(
      transcript,
      { gender: user.gender, age: user.age, displayName: user.displayName },
      data.moodSelected,
    );

    // 4. Save the sentiment scan to database
    let savedScan;
    try {
      savedScan = await this.prisma.sentimentScan.create({
        data: {
          userId,
          dominantEmotion: aiResult.dominant_emotion,
          verdict: aiResult.verdict,
          indicators: aiResult.indicators,
          facialReading: aiResult.facial_reading,
          conseilAura: aiResult.conseil_aura,
          imageUrl: null,
        },
      });
    } catch (dbErr) {
      this.logger.error('Failed to save vocal sentiment scan to database', dbErr);
    }

    return {
      id: savedScan ? savedScan.id : null,
      isFaceValid: true,
      transcript,
      dominantEmotion: aiResult.dominant_emotion,
      verdict: aiResult.verdict,
      indicators: aiResult.indicators,
      facialReading: aiResult.facial_reading,
      conseilAura: aiResult.conseil_aura,
      imageUrl: null,
      analyzedAt: savedScan ? savedScan.createdAt.toISOString() : new Date().toISOString(),
    };
  }

  async getHistory(userId: number) {
    return this.prisma.sentimentScan.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 30, // Get last 30 scans
    });
  }

  async getComparison(userId: number) {
    const scans = await this.prisma.sentimentScan.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 2,
    });

    if (scans.length < 2) {
      return {
        hasComparison: false,
        message: 'Prenez un autre selfie pour comparer vos résultats avec votre scan précédent ! 😊',
      };
    }

    const todayScan = scans[0];
    const previousScan = scans[1];

    // Compute difference for each indicator
    const todayIndicators = todayScan.indicators as any[];
    const prevIndicators = previousScan.indicators as any[];

    const changes = todayIndicators.map((tInd) => {
      const pInd = prevIndicators.find((p) => p.label === tInd.label);
      const prevPercentage = pInd ? pInd.percentage : 0;
      const diff = tInd.percentage - prevPercentage;
      return {
        label: tInd.label,
        todayPercentage: tInd.percentage,
        prevPercentage,
        diff,
      };
    });

    return {
      hasComparison: true,
      todayScan: {
        id: todayScan.id,
        dominantEmotion: todayScan.dominantEmotion,
        createdAt: todayScan.createdAt,
      },
      previousScan: {
        id: previousScan.id,
        dominantEmotion: previousScan.dominantEmotion,
        createdAt: previousScan.createdAt,
      },
      changes,
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
