export type MoodPrincipal = 'joyeux' | 'calme' | 'confiant' | 'stressé' | 'mélancolique' | 'énergique';
export type NiveauEnergie = 'faible' | 'moyen' | 'élevé';

export class MoodResultDto {
  moodPrincipal!: MoodPrincipal;
  niveauEnergie!: NiveauEnergie;
  contexte?: string;
  [key: string]: unknown;
}

export class CreateMusicRecommendationDto {
  userId!: number;
  moodResult?: MoodResultDto;
}
