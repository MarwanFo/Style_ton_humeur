export type QuestionnaireMood = 'joyeux' | 'calme' | 'confiant' | 'stressé' | 'nostalgique';
export type QuestionnaireEnergy = 'faible' | 'moyen' | 'élevé';
export type QuestionnaireContext = 'travail' | 'sortie' | 'sport' | 'maison';

export class MoodQuestionnaireDto {
  humeur_detectee!: QuestionnaireMood;
  niveau_energie!: QuestionnaireEnergy;
  contexte?: QuestionnaireContext;
}

export class AutoMusicRecommendationDto {
  userId!: number;
  questionnaire?: MoodQuestionnaireDto;
}
