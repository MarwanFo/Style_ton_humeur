import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export type EnrichedMoodProfile = {
  humeur_detectee: string;
  niveau_energie: 'faible' | 'moyen' | 'élevé';
  contexte?: string;
  age: number;
  genre: string;
  tags_style: string[];
  source: 'modules';
  dailyCheckInId?: number;
};

@Injectable()
export class UserMoodProvider {
  constructor(private readonly prisma: PrismaService) {}

  async getMoodFromModules(userId: number): Promise<EnrichedMoodProfile | null> {
    console.log(`[UserMoodProvider] Vérification du profil pour l'utilisateur ${userId}`);
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profilePreferences: true },
    });
    if (!user) {
      console.log('[UserMoodProvider] Utilisateur non trouvé');
      return null;
    }

    const todayCheckin = await this.prisma.dailyCheckIn.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    if (!todayCheckin) {
      console.log('[UserMoodProvider] Aucun check-in trouvé pour aujourd\'hui');
      return null;
    }

    // Résilience fuseaux horaires : On vérifie si le check-in a été créé il y a moins de 16 heures
    const isFromToday = (new Date().getTime() - new Date(todayCheckin.createdAt).getTime()) < 16 * 60 * 60 * 1000;
    if (!isFromToday) {
      console.log('[UserMoodProvider] Check-in trop ancien (>16h)');
      return null;
    }

    const latestRecommendation = await this.prisma.recommendation.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    // On vérifie si une recommandation complète (Style/Beauté/Sentiments) existe
    if (!latestRecommendation) {
      console.log('[UserMoodProvider] Aucune recommandation de style trouvée');
      return null;
    }

    // On vérifie si la recommandation date d'aujourd'hui (depuis minuit local)
    // On utilise une comparaison de chaînes de caractères sur la date YYYY-MM-DD pour éviter les erreurs de fuseaux horaires
    const todayStr = new Date().toISOString().split('T')[0];
    const recoDateStr = new Date(latestRecommendation.createdAt).toISOString().split('T')[0];
    
    console.log(`[UserMoodProvider] Comparaison dates : Aujourd'hui=${todayStr}, Recommandation=${recoDateStr}`);

    if (recoDateStr !== todayStr) {
      console.log(`[UserMoodProvider] Blocage : La recommandation de style (${recoDateStr}) n'est pas celle d'aujourd'hui (${todayStr})`);
      return null;
    }

    console.log('[UserMoodProvider] Profil émotionnel validé avec succès pour aujourd\'hui');
    const profileTags = ((user.profilePreferences?.styleTags as string[]) || []).filter(Boolean);
    const recommendationTags = this.extractStyleTagsFromRecommendation(latestRecommendation?.outfits as any[] | undefined);
    const tags_style = [...new Set([...profileTags, ...recommendationTags])].slice(0, 6);

    if (!todayCheckin) {
      return null;
    }

    const answers = (todayCheckin.answers as Record<string, unknown>) || {};
    const niveauEnergie = (answers.niveauEnergie as 'faible' | 'moyen' | 'élevé') || this.inferEnergy(todayCheckin.moodDetected);
    const contexte = (answers.contexte as string) || this.inferContext(tags_style);

    return {
      humeur_detectee: todayCheckin.moodDetected || 'calme',
      niveau_energie: niveauEnergie,
      contexte,
      age: user.age,
      genre: user.gender,
      tags_style,
      source: 'modules',
      dailyCheckInId: todayCheckin.id,
    };
  }

  private inferEnergy(mood: string): 'faible' | 'moyen' | 'élevé' {
    const normalized = mood?.toLowerCase?.() || '';
    if (['joyeux', 'confiant', 'énergique'].includes(normalized)) return 'élevé';
    if (['stressé', 'mélancolique', 'nostalgique', 'calme'].includes(normalized)) return 'faible';
    return 'moyen';
  }

  private inferContext(styleTags: string[]): string {
    const normalized = styleTags.map((tag) => tag.toLowerCase());
    if (normalized.some((tag) => tag.includes('sport'))) return 'sport';
    if (normalized.some((tag) => tag.includes('chic'))) return 'sortie';
    if (normalized.some((tag) => tag.includes('casual'))) return 'maison';
    return 'travail';
  }

  private extractStyleTagsFromRecommendation(outfits?: any[]): string[] {
    if (!outfits || outfits.length === 0) return [];
    const values = outfits
      .flatMap((look) => [look?.title, ...(look?.pieces || [])])
      .filter(Boolean)
      .map((value: string) => value.toLowerCase());

    const tags: string[] = [];
    if (values.some((v) => v.includes('sport') || v.includes('run'))) tags.push('sport');
    if (values.some((v) => v.includes('chic') || v.includes('soir'))) tags.push('chic');
    if (values.some((v) => v.includes('casual') || v.includes('cozy'))) tags.push('casual');
    return tags;
  }
}
