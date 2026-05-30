import { Injectable } from '@nestjs/common';
import { NiveauEnergie } from './dto/create-music-recommendation.dto';

type SpotifySeedParams = {
  seedGenres: string[];
  targetValence: number;
  minValence: number;
  maxValence: number;
  targetEnergy: number;
  minEnergy: number;
  maxEnergy: number;
  targetDanceability: number;
  targetAcousticness: number;
  minPopularity?: number;
};

type BuildMappingInput = {
  moodPrincipal: string;
  niveauEnergie: NiveauEnergie | string;
  contexte?: string;
  userMusicPreferences?: string[];
};

@Injectable()
export class MusicMappingService {
  private readonly spotifySupportedGenres = new Set([
    'acoustic',
    'afrobeat',
    'ambient',
    'blues',
    'chill',
    'classical',
    'dance',
    'electro',
    'funk',
    'hip-hop',
    'house',
    'indie',
    'jazz',
    'latin',
    'pop',
    'r-n-b',
    'rap',
    'rock',
    'soul',
  ]);

  buildSpotifyParams(input: BuildMappingInput, trending: boolean = true): SpotifySeedParams {
    const mood = input.moodPrincipal?.toLowerCase?.() || 'calme';
    const energy = input.niveauEnergie?.toLowerCase?.() || 'moyen';

    const mappedByMood = this.getMoodEnergyMapping(mood, energy);
    const preferredGenres = this.normalizeGenres(input.userMusicPreferences || []);

    // Mélanger les genres disponibles pour plus de variété
    const combinedGenres = [...new Set([...preferredGenres, ...mappedByMood.seedGenres])];
    const randomizedGenres = combinedGenres.sort(() => Math.random() - 0.5).slice(0, 3);

    // Ajouter une légère variation aléatoire aux paramètres cibles
    const randomVariation = () => (Math.random() * 0.1) - 0.05; // +/- 0.05

    return {
      ...mappedByMood,
      ...this.getContextAdjustments(input.contexte),
      seedGenres: randomizedGenres.length > 0 ? randomizedGenres : mappedByMood.seedGenres,
      targetValence: Math.min(1, Math.max(0, mappedByMood.targetValence + randomVariation())),
      targetEnergy: Math.min(1, Math.max(0, mappedByMood.targetEnergy + randomVariation())),
      minPopularity: trending ? 65 : undefined,
    };
  }

  private getMoodEnergyMapping(mood: string, energy: string): SpotifySeedParams {
    if (mood === 'joyeux' && energy === 'élevé') {
      return {
        seedGenres: ['pop', 'dance', 'electro'],
        targetValence: 0.82,
        minValence: 0.71,
        maxValence: 1,
        targetEnergy: 0.82,
        minEnergy: 0.71,
        maxEnergy: 1,
        targetDanceability: 0.8,
        targetAcousticness: 0.2,
      };
    }

    if (mood === 'calme' && energy === 'faible') {
      return {
        seedGenres: ['chill', 'ambient', 'acoustic'],
        targetValence: 0.56,
        minValence: 0.4,
        maxValence: 0.7,
        targetEnergy: 0.26,
        minEnergy: 0.1,
        maxEnergy: 0.4,
        targetDanceability: 0.35,
        targetAcousticness: 0.75,
      };
    }

    if (mood === 'confiant' && energy === 'élevé') {
      return {
        seedGenres: ['hip-hop', 'house', 'r-n-b'],
        targetValence: 0.8,
        minValence: 0.71,
        maxValence: 1,
        targetEnergy: 0.78,
        minEnergy: 0.6,
        maxEnergy: 0.9,
        targetDanceability: 0.7,
        targetAcousticness: 0.25,
      };
    }

    return {
      seedGenres: ['pop', 'indie', 'rock'],
      targetValence: 0.6,
      minValence: 0.45,
      maxValence: 0.8,
      targetEnergy: energy === 'faible' ? 0.35 : energy === 'élevé' ? 0.8 : 0.55,
      minEnergy: energy === 'faible' ? 0.2 : energy === 'élevé' ? 0.6 : 0.4,
      maxEnergy: energy === 'faible' ? 0.5 : energy === 'élevé' ? 0.95 : 0.75,
      targetDanceability: energy === 'élevé' ? 0.72 : 0.5,
      targetAcousticness: energy === 'faible' ? 0.65 : 0.35,
    };
  }

  private getContextAdjustments(contexte?: string) {
    const normalized = contexte?.toLowerCase?.();
    if (normalized === 'sport') return { targetDanceability: 0.85, targetAcousticness: 0.15 };
    if (normalized === 'sortie') return { targetDanceability: 0.78, targetAcousticness: 0.22 };
    if (normalized === 'maison') return { targetDanceability: 0.45, targetAcousticness: 0.7 };
    return { targetDanceability: 0.55, targetAcousticness: 0.45 }; // travail/default
  }

  private normalizeGenres(preferences: string[]): string[] {
    return preferences
      .map((pref) => pref.trim().toLowerCase())
      .map((pref) => pref.replace(/\s+/g, '-'))
      .filter((genre) => this.spotifySupportedGenres.has(genre));
  }
}
