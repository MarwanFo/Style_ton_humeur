import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.NVIDIA_API_KEY || 'DUMMY_KEY',
      baseURL: 'https://integrate.api.nvidia.com/v1',
    });
  }

  async getRecommendations(
    answers: any,
    userProfile: { gender: string; age: number },
    weather: { temp: number; code: number } | null,
  ): Promise<any> {
    try {
      const weatherContext = weather
        ? `Météo actuelle : ${weather.temp}°C, code météo ${weather.code}`
        : `Météo non disponible.`;

      const prompt = `
Tu es un styliste expert. L'utilisateur est un(e) ${userProfile.gender} de ${userProfile.age} ans.
Réponses au questionnaire du jour : ${JSON.stringify(answers)}.
${weatherContext}

Tu dois renvoyer STRICTEMENT un JSON valide respectant cette structure (rien d'autre autour) :
{
  "detected_mood": "calme|confiant|joyeux|stressé|mélancolique|énergique",
  "style_keywords": ["mot1", "mot2"],
  "justification": "courte phrase",
  "outfits": [{"title":"nom","top":"haut","bottom":"bas","shoes":"chaussures","accessories":"acc"}], // exactement 3
  "makeup": [{"type":"léger|intense","description":"desc"}], // exactement 2
  "music": [{"title":"titre","artist":"artiste","genre":"genre","tempo":"lent|modéré|rapide"}] // 1 à 3
}`;

      const response = await this.openai.chat.completions.create({
        model: 'meta/llama-3.1-8b-instruct',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 1024,
      });

      const text = response.choices[0].message?.content || '{}';
      
      // Cleanup markdown if the model wraps the JSON
      const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      
      return JSON.parse(cleanedText);
    } catch (error) {
      this.logger.error('Erreur lors de la génération avec Nvidia Llama 3', error);
      return this.getFallbackRecommendation();
    }
  }

  async analyzeImage(
    base64Image: string,
    mimeType: string,
    userProfile: { gender: string; age: number },
  ): Promise<any> {
    try {
      const prompt = `
Tu es un styliste visuel expert. L'utilisateur est un(e) ${userProfile.gender} de ${userProfile.age} ans.
Analyse la photo fournie pour comprendre son style, sa morphologie, sa colorimétrie (peau/cheveux) et son aura actuelle.
Déduis l'humeur qui s'en dégage et donne-moi des recommandations parfaites.

Tu dois renvoyer STRICTEMENT un JSON valide respectant cette structure (rien d'autre autour) :
{
  "detected_mood": "calme|confiant|joyeux|stressé|mélancolique|énergique",
  "style_keywords": ["mot1", "mot2"],
  "justification": "courte phrase justifiant pourquoi ces choix par rapport à l'image",
  "outfits": [{"title":"nom","top":"haut","bottom":"bas","shoes":"chaussures","accessories":"acc"}], // exactement 3
  "makeup": [{"type":"léger|intense","description":"desc"}], // exactement 2
  "music": [{"title":"titre","artist":"artiste","genre":"genre","tempo":"lent|modéré|rapide"}] // 1 à 3
}`;

      // We use 11b-vision-instruct because 3.1-8b is text-only
      const response = await this.openai.chat.completions.create({
        model: 'meta/llama-3.2-11b-vision-instruct',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              {
                type: 'image_url',
                image_url: {
                  url: `data:${mimeType};base64,${base64Image}`,
                },
              },
            ],
          },
        ],
        temperature: 0.7,
        max_tokens: 1024,
      });

      const text = response.choices[0].message?.content || '{}';
      const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      return JSON.parse(cleanedText);
    } catch (error) {
      this.logger.error("Erreur lors de l'analyse visuelle avec Nvidia Llama", error);
      return this.getFallbackRecommendation();
    }
  }

  private getFallbackRecommendation() {
    return {
      detected_mood: "calme",
      style_keywords: ["casual", "confortable"],
      justification: "Recommandation de secours suite à une indisponibilité du service IA.",
      outfits: [
        { title: "Cozy Day", top: "Pull oversize", bottom: "Jogging", shoes: "Baskets", accessories: "Montre" },
        { title: "Casual Chic", top: "T-shirt basique", bottom: "Jeans", shoes: "Sneakers blanches", accessories: "Casquette" },
        { title: "Sporty", top: "Haut de sport", bottom: "Legging", shoes: "Baskets running", accessories: "Gourde" }
      ],
      makeup: [
        { type: "léger", description: "Crème hydratante et baume à lèvres" },
        { type: "intense", description: "Mascara et rouge à lèvres léger" }
      ],
      music: [
        { title: "Lofi Beats", artist: "Chillhop", genre: "Lofi", tempo: "lent" }
      ]
    };
  }
}
