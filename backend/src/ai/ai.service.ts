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
    userProfile: { gender: string; age: number; height?: number; origin?: string },
  ): Promise<any> {
    try {
      const heightContext = userProfile.height ? `Taille : ${userProfile.height} cm.` : 'Taille non spécifiée.';
      const originContext = userProfile.origin ? `Origine/Pays : ${userProfile.origin}.` : 'Origine non spécifiée.';

      const prompt = `
Tu es un styliste visuel expert et conseiller en image. L'utilisateur est un(e) ${userProfile.gender} de ${userProfile.age} ans.
${heightContext}
${originContext}

CRITICAL RULE / RÈGLE CRUCIALE :
Tu dois vérifier si la photo montre le CORPS ENTIER de la personne (de la tête aux pieds).
- Si la photo est un SELFIE (visage uniquement), un portrait serré, une photo coupée à la taille ou au buste, ou si on ne voit pas les jambes et les pieds de la personne, la photo est INVALIDE.
- Si la photo est INVALIDE, tu dois obligatoirement mettre "is_full_body_valid": false dans le JSON, et écrire un message d'alerte sympa dans "error_alert" demandant une photo en pied. Ne génère pas de conseils de style si la photo est invalide.
- Si la photo est valide (corps entier visible de la tête aux pieds), mets "is_full_body_valid": true, "error_alert": null, et réalise l'analyse complète.

Tu dois renvoyer STRICTEMENT un JSON valide respectant cette structure (aucun texte d'explication en dehors du JSON, pas de balise markdown, juste le JSON brut) :
{
  "is_full_body_valid": false, // Mettre false si c'est un selfie, portrait, buste, ou sans jambes/pieds visibles
  "error_alert": "Message d'erreur si la photo est invalide, sinon null",
  "detected_mood": "calme|confiant|joyeux|stressé|mélancolique|énergique",
  "style_keywords": ["mot1", "mot2"],
  "outfits": [
    {
      "title": "Nom de la tenue",
      "pieces": ["Pièce 1 (ex: Pull en maille beige)", "Pièce 2", "Pièce 3"],
      "justification": "Pourquoi cette tenue va parfaitement à sa morphologie (taille ${userProfile.height || 'N/A'} cm) et s'accorde avec son origine (${userProfile.origin || 'N/A'})."
    }
  ] // exactement 3 tenues si valide, sinon tableau vide []
}`;

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
        temperature: 0.2, // Lower temperature makes the model strictly follow the instructions
        max_tokens: 1000,
      });

      const text = response.choices[0].message?.content || '{}';
      
      // Logger la réponse brute de Llama pour déboguer facilement
      this.logger.log(`[Llama Vision Response]: ${text}`);

      const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const result = JSON.parse(cleanedText);
      
      // Inject blank arrays to satisfy Database schema structure
      result.makeup = [];
      result.music = [];
      
      return result;
    } catch (error) {
      this.logger.error("Erreur lors de l'analyse visuelle avec Nvidia Llama", error);
      return this.getFallbackRecommendation();
    }
  }

  private getFallbackRecommendation() {
    return {
      is_full_body_valid: true,
      error_alert: null,
      detected_mood: "calme",
      style_keywords: ["casual", "confortable"],
      outfits: [
        { 
          title: "Cozy Day", 
          pieces: ["Pull oversize en maille", "Jogging beige", "Skechers blanches", "Montre minimaliste"],
          justification: "Une coupe ample et décontractée, idéale pour se détendre."
        },
        { 
          title: "Casual Chic", 
          pieces: ["T-shirt blanc en coton bio", "Jean droit brut", "Sneakers en cuir blanc", "Casquette noire"],
          justification: "Un style intemporel et moderne adapté à toutes les silhouettes."
        },
        { 
          title: "Sporty Active", 
          pieces: ["Haut technique de sport", "Legging noir confortable", "Baskets de course", "Gourde isotherme"],
          justification: "Une tenue ergonomique optimisant le confort de vos mouvements."
        }
      ],
      makeup: [
        { title: "Routine Légère (Journée)", steps: ["Crème hydratante protectrice", "Baume à lèvres neutre"] },
        { title: "Routine Intense (Soirée)", steps: ["Mascara volumateur noir", "Rouge à lèvres nude discret"] }
      ],
      music: [
        { title: "Lofi Beats", artist: "Chillhop Music" }
      ]
    };
  }
}
