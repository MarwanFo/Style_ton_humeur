import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private openai: OpenAI;
  private genAI: GoogleGenerativeAI;

  constructor(private cloudinaryService: CloudinaryService) {
    this.openai = new OpenAI({
      apiKey: process.env.NVIDIA_API_KEY || 'DUMMY_KEY',
      baseURL: 'https://integrate.api.nvidia.com/v1',
    });
    // Initialize Gemini (Free Tier API)
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'DUMMY_KEY');
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

Tu dois renvoyer STRICTEMENT un JSON valide respectant cette structure (rien d'autre autour, pas de balise markdown, juste le JSON brut).
Règles importantes pour le JSON :
1. Génère exactement 3 tenues dans "outfits".
2. Génère exactement 2 routines dans "makeup".
3. Génère entre 1 et 3 chansons dans "music".
4. Ne mets pas de commentaires dans le JSON.
5. N'utilise pas de guillemets doubles (") à l'intérieur des valeurs de chaînes (si besoin, utilise des guillemets simples ').

Structure attendue :
{
  "detected_mood": "calme|confiant|joyeux|stressé|mélancolique|énergique",
  "style_keywords": ["mot1", "mot2"],
  "justification": "courte phrase expliquant le choix",
  "outfits": [
    {
      "title": "nom de la tenue",
      "pieces": ["Haut (ex: pull en maille)", "Bas (ex: jean brut)", "Chaussures", "Accessoires"],
      "justification": "justification spécifique pour ce look"
    }
  ],
  "makeup": [
    {
      "title": "Nom de la routine",
      "steps": ["Étape 1", "Étape 2"]
    }
  ],
  "music": [
    {
      "title": "titre",
      "artist": "artiste"
    }
  ]
}`;

      const response = await this.openai.chat.completions.create({
        model: 'meta/llama-3.1-8b-instruct',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 1024,
      });

      const text = response.choices[0].message?.content || '{}';
      return this.parseLlamaJson(text);
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
Tu dois vérifier si la photo montre la tenue (outfit) de la personne pour pouvoir l'analyser.
- Si la photo est un simple SELFIE serré (visage uniquement) ou un portrait serré du buste où on ne voit aucun vêtement significatif, la photo est INVALIDE.
- Si la photo montre la tenue de l'utilisateur (le haut et au moins une partie du bas/pantalon/jupe, même si la photo est prise dans un miroir ou si les pieds/chaussures ne sont pas visibles), la photo est VALIDE.
- Si la photo est INVALIDE, tu dois obligatoirement mettre "is_full_body_valid": false dans le JSON, et écrire un message d'alerte sympa dans "error_alert" demandant une photo de sa tenue. Ne génère pas de conseils de style si la photo est invalide.
- Si la photo est valide, mets "is_full_body_valid": true, "error_alert": null, et réalise l'analyse complète.

Tu dois renvoyer STRICTEMENT un JSON valide respectant cette structure (aucun texte d'explication en dehors du JSON, juste le JSON brut).
Règles importantes pour le JSON :
1. Génère exactement 3 tenues dans "outfits" si la photo est valide, sinon un tableau vide [].
2. Ne mets pas de commentaires dans le JSON.

Structure attendue :
{
  "is_full_body_valid": boolean,
  "error_alert": "Message d'erreur si la photo est invalide ou null",
  "detected_mood": "calme|confiant|joyeux|stressé|mélancolique|énergique",
  "style_keywords": ["mot1", "mot2"],
  "outfits": [
    {
      "title": "Nom de la tenue",
      "pieces": ["Pièce 1", "Pièce 2", "Pièce 3"],
      "justification": "Pourquoi cette tenue..."
    }
  ]
}`;

      const model = this.genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        generationConfig: {
          temperature: 0.3,
          responseMimeType: "application/json",
        }
      });

      const imagePart = {
        inlineData: {
          data: base64Image,
          mimeType: mimeType || 'image/jpeg'
        }
      };

      const response = await model.generateContent([prompt, imagePart]);
      const text = response.response.text();
      
      this.logger.log(`[Gemini Vision Response]: ${text}`);

      const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const result = JSON.parse(cleanedText);
      
      result.makeup = [
        { title: "Routine Légère (Journée)", steps: ["Crème hydratante protectrice", "Baume à lèvres neutre"] },
        { title: "Routine Intense (Soirée)", steps: ["Mascara volumateur noir", "Rouge à lèvres nude discret"] }
      ];
      result.music = [
        { title: "Lofi Beats", artist: "Chillhop Music" }
      ];
      
      return result;
    } catch (error) {
      this.logger.error("Erreur lors de l'analyse visuelle avec Gemini", error);
      return this.getFallbackRecommendation();
    }
  }

  /**
   * Transcribes audio using Gemini 2.5 Flash multimodal
   */
  async transcribeAudio(base64Audio: string, mimeType: string): Promise<string> {
    // Normalize MIME type — M4A is technically an MP4 container, audio/mp4 is more universally accepted
    let cleanedMimeType = 'audio/mp4';
    if (mimeType.includes('wav')) cleanedMimeType = 'audio/wav';
    else if (mimeType.includes('mp3') || mimeType.includes('mpeg')) cleanedMimeType = 'audio/mp3';
    else if (mimeType.includes('webm')) cleanedMimeType = 'audio/webm';
    else if (mimeType.includes('ogg')) cleanedMimeType = 'audio/ogg';
    else if (mimeType.includes('flac')) cleanedMimeType = 'audio/flac';
    else if (mimeType.includes('aac')) cleanedMimeType = 'audio/aac';

    this.logger.log(`Starting audio transcription. Original mimeType="${mimeType}" → using "${cleanedMimeType}"`);

    const doTranscribe = async (): Promise<string> => {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      const audioPart = {
        inlineData: { data: base64Audio, mimeType: cleanedMimeType },
      };
      const response = await model.generateContent([
        "Transcris exactement et uniquement les paroles de cet enregistrement audio en français. Ne fais aucun commentaire personnel, n'ajoute pas de salutations ni d'introduction. Rends uniquement le texte dit dans l'audio. Si l'enregistrement contient du silence ou aucun mot intelligible, renvoie exactement la chaîne vide.",
        audioPart,
      ]);
      return response.response.text() || '';
    };

    try {
      let transcription = await doTranscribe();

      const cleanTranscription = transcription.trim().replace(/^["'\s\[\]\\]+|["'\s\[\]\\]+$/g, '');
      const hallucinations = [
        /thanks for watching/i,
        /thank you/i,
        /merci beaucoup/i,
        /^bye$/i,
        /subtitles/i,
        /sous-titres/i,
      ];

      let isHallucination = cleanTranscription.length === 0;
      if (!isHallucination) {
        for (const pattern of hallucinations) {
          if (pattern.test(cleanTranscription) && cleanTranscription.length < 25) {
            isHallucination = true;
            break;
          }
        }
      }

      if (isHallucination) {
        this.logger.warn(`Filtered hallucination/silence: "${transcription}"`);
        return '';
      }

      this.logger.log(`Transcription success: "${transcription.substring(0, 80)}..."`);
      return transcription;
    } catch (err: any) {
      this.logger.error(`Audio transcription failed (mimeType=${cleanedMimeType}): ${err?.message}`);
      // Return empty string — caller will handle fallback gracefully
      return '';
    }
  }

  /**
   * Generates outfit recommendations and a spoken AI reply from a voice transcript
   */
  async getVoiceRecommendations(
    transcript: string,
    userProfile: { gender: string; age: number }
  ): Promise<any> {
    try {
      this.logger.log('Generating voice check-in recommendations...');
      const prompt = `
Tu es un styliste expert et conseiller de mode personnel.
L'utilisateur s'est exprimé par message vocal et voici la transcription exacte de ce qu'il a dit :
"${transcript}"

L'utilisateur est un(e) ${userProfile.gender} de ${userProfile.age} ans.

Tu dois impérativement renvoyer un JSON valide structuré exactement comme ceci, sans aucune explication ou texte autour (pas de balises markdown, pas de texte introductif, juste le JSON brut).
Règles importantes pour le JSON :
1. Génère exactement 3 tenues dans "outfits".
2. Génère exactement 2 routines dans "makeup".
3. Génère entre 1 et 3 chansons dans "music".
4. Ne mets pas de commentaires dans le JSON.
5. N'utilise pas de guillemets doubles (") à l'intérieur des valeurs de chaînes (si besoin, utilise des guillemets simples ').

Structure attendue :
{
  "detected_mood": "calme|confiant|joyeux|stressé|mélancolique|énergique",
  "style_keywords": ["mot1", "mot2"],
  "justification": "Courte phrase justifiant le style proposé.",
  "ai_voice_message": "Un court message chaleureux, direct et encourageant (en français) à lire à voix haute par l'assistant. Par exemple, si l'utilisateur dit qu'il a un rendez-vous important, rassure-le et présente succinctement la tenue sélectionnée. Maximum 2 phrases.",
  "outfits": [
    {
      "title": "Nom de la tenue",
      "pieces": ["Haut (ex: Pull beige)", "Bas (ex: Pantalon chino noir)", "Chaussures", "Accessoires"],
      "justification": "justification spécifique pour ce look"
    }
  ],
  "makeup": [
    {
      "title": "Routine Légère (Journée)",
      "steps": ["Crème hydratante protectrice", "Baume à lèvres neutre"]
    }
  ],
  "music": [
    {
      "title": "Lofi Beats",
      "artist": "Chillhop Music"
    }
  ]
}`;

      const response = await this.openai.chat.completions.create({
        model: 'meta/llama-3.1-8b-instruct',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 1024,
      });

      const text = response.choices[0].message?.content || '{}';
      const parsed = this.parseLlamaJson(text);

      if (parsed.ai_voice_message) {
        try {
          const audioUrl = await this.generateTts(parsed.ai_voice_message);
          parsed.ai_voice_message_url = audioUrl;
        } catch (ttsErr) {
          this.logger.error('Failed to generate TTS audio in getVoiceRecommendations', ttsErr);
        }
      }

      return parsed;
    } catch (error) {
      this.logger.error('Error during voice LLM analysis', error);
      const fallback = this.getFallbackRecommendation();
      const message = "Désolé, j'ai eu un problème pour analyser votre message vocal. Voici tout de même une sélection de tenues confortables pour aujourd'hui !";
      let audioUrl: string | null = null;
      try {
        audioUrl = await this.generateTts(message);
      } catch (e) {}
      return {
        ...fallback,
        ai_voice_message: message,
        ai_voice_message_url: audioUrl
      };
    }
  }

  /**
   * Generates premium neural Text-to-Speech audio and uploads to Cloudinary
   */
  async generateTts(text: string): Promise<string | null> {
    try {
      this.logger.log('Generating premium neural TTS voice with msedge-tts...');
      const { MsEdgeTTS, OUTPUT_FORMAT } = require('msedge-tts');
      const tts = new MsEdgeTTS();
      
      // Use fr-FR-DeniseNeural (highly realistic neural French voice)
      await tts.setMetadata("fr-FR-DeniseNeural", OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
      
      const os = require('os');
      const path = require('path');
      const fs = require('fs');
      
      const tempDir = os.tmpdir();
      const uniqueSubdir = path.join(tempDir, `tts_${Date.now()}_${Math.floor(Math.random() * 1000)}`);
      fs.mkdirSync(uniqueSubdir, { recursive: true });
      
      const { audioFilePath } = await tts.toFile(uniqueSubdir, text);
      
      let cloudinaryUrl: string | null = null;
      if (audioFilePath && fs.existsSync(audioFilePath)) {
        const base64Audio = fs.readFileSync(audioFilePath, { encoding: 'base64' });
        const mimePrefix = `data:audio/mp3;base64,`;
        const fullBase64 = `${mimePrefix}${base64Audio}`;
        
        cloudinaryUrl = await this.cloudinaryService.uploadImage(fullBase64, 'tts_voices');
        
        fs.unlinkSync(audioFilePath);
      }
      
      if (fs.existsSync(uniqueSubdir)) {
        try {
          fs.rmdirSync(uniqueSubdir);
        } catch (e) {}
      }
      
      this.logger.log(`Premium neural TTS voice generated and uploaded: ${cloudinaryUrl}`);
      return cloudinaryUrl;
    } catch (error) {
      this.logger.error('Error generating premium neural TTS', error);
      return null;
    }
  }

  private parseLlamaJson(text: string): any {
    try {
      const start = text.indexOf('{');
      const end = text.lastIndexOf('}');
      if (start === -1 || end === -1 || end < start) {
        throw new Error('No JSON object found in response.');
      }
      let jsonStr = text.substring(start, end + 1);

      // Clean JavaScript single-line comments while keeping URL protocols intact
      jsonStr = jsonStr.split('\n')
        .map(line => {
          const commentIdx = line.indexOf('//');
          if (commentIdx !== -1) {
            const httpIdx = line.indexOf('http://');
            const httpsIdx = line.indexOf('https://');
            if (commentIdx === httpIdx + 5 || commentIdx === httpsIdx + 6) {
              return line;
            }
            return line.substring(0, commentIdx);
          }
          return line;
        })
        .join('\n');

      // Replace smart quotes with straight quotes
      jsonStr = jsonStr.replace(/[\u201C\u201D\u201E\u201F]/g, '"');

      return JSON.parse(jsonStr);
    } catch (error) {
      this.logger.error('Failed to parse JSON response from LLM', error);
      this.logger.debug(`Raw LLM content was: \n${text}`);
      throw error;
    }
  }

  async analyzeSentiment(
    base64Image: string,
    mimeType: string,
    userProfile: { gender: string; age: number; displayName?: string },
    moodSelected?: string,
  ): Promise<any> {
    try {
      const moodContext = moodSelected
        ? `L'utilisateur a pré-sélectionné son humeur comme : "${moodSelected}". Adapte-toi subtilement à cette indication.`
        : `Aucun mood pré-sélectionné. Base-toi uniquement sur les micro-expressions.`;

      const prompt = `
Tu es un expert en psychologie cognitive, en micro-expressions faciales et en analyse d'affect par IA, intégré au module "Sentiments" de l'application Aura Studio. Ton rôle est d'analyser le selfie fourni pour décoder l'état émotionnel actuel de l'utilisateur.

Profil de l'utilisateur : ${userProfile.gender}, ${userProfile.age} ans, prénom : ${userProfile.displayName || 'Utilisateur'}.
${moodContext}

Référentiel des Sentiments (Ta matrice de détection) :
1. États Positifs & Énergie : Joie/Enthousiasme, Rayonnant, Fierté/Confiance.
2. États Calmes & Focus : Sérénité/Paix, Concentration/Focus, Pensif/Méditatif.
3. États de Fatigue & Stress : Fatigue/Épuisement, Stress/Anxiété, Ennui/Lassitude.
4. Émotions Spontanées : Surprise/Étonnement, Confusion/Hésitation.

Directives :
1. Examine attentivement les indicateurs faciaux : position des sourcils, tension des yeux, orientation des lèvres, inclinaison de la tête.
2. Avant de répondre, vérifie que ton diagnostic n'est pas trop générique. Ajuste les pourcentages précisément.

Tu dois renvoyer STRICTEMENT un JSON valide (aucun texte d'explication en dehors du JSON, pas de balise markdown, juste le JSON brut) respectant cette structure :
{
  "is_face_valid": true,
  "error_alert": null,
  "dominant_emotion": "Sérénité",
  "verdict": "Phrase percutante résumant l'ambiance du visage (en français, chaleureuse et moderne)",
  "indicators": [
    { "label": "Sérénité", "percentage": 70 },
    { "label": "Focus", "percentage": 30 }
  ],
  "facial_reading": "Explication brève et poétique de ce que les traits racontent (2-3 lignes max)",
  "conseil_aura": "Conseil actionnable et positif en phase avec l'état détecté (2-3 lignes max)"
}

RÈGLES CRUCIALES :
- Si la photo ne contient PAS de visage humain clairement visible, mets "is_face_valid": false et "error_alert": "Message d'erreur sympa demandant un selfie avec visage visible". Laisse les autres champs vides ou null.
- "indicators" ("label" et "percentage") doit contenir entre 2 et 4 éléments dont les pourcentages totalisent 100%.
- Reste toujours positif, empathique et validant. Ne pose jamais de diagnostic médical.
- Formule TOUT en français.`;

      // Use Google Gemini API (Free tier)
      const model = this.genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        generationConfig: {
          temperature: 0.3,
          responseMimeType: "application/json",
        }
      });

      const imagePart = {
        inlineData: {
          data: base64Image,
          mimeType: mimeType || 'image/jpeg'
        }
      };

      const response = await model.generateContent([prompt, imagePart]);
      const text = response.response.text();
      
      this.logger.log(`[Gemini Sentiment Response]: ${text}`);

      const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      return JSON.parse(cleanedText);
    } catch (error) {
      this.logger.error("Erreur lors de l'analyse sentimentale avec Nvidia Llama", error);
      return this.getFallbackSentiment();
    }
  }

  async analyzeVoiceSentiment(
    transcript: string,
    userProfile: { gender: string; age: number; displayName?: string },
    moodSelected?: string,
  ): Promise<any> {
    try {
      const moodContext = moodSelected
        ? `L'utilisateur a pré-sélectionné son humeur comme : "${moodSelected}". Adapte-toi subtilement à cette indication.`
        : `Aucun mood pré-sélectionné.`;

      const prompt = `
Tu es un expert en psychologie cognitive, en analyse de ton vocal et en décodage d'affect, intégré au module "Sentiments" de l'application Aura Studio.
L'utilisateur s'est exprimé par message vocal pour décrire son état d'esprit. Voici la transcription exacte :
"${transcript}"

Profil de l'utilisateur : ${userProfile.gender}, ${userProfile.age} ans, prénom : ${userProfile.displayName || 'Utilisateur'}.
${moodContext}

Référentiel des Sentiments (Ta matrice de détection) :
1. États Positifs & Énergie : Joie/Enthousiasme, Rayonnant, Fierté/Confiance.
2. États Calmes & Focus : Sérénité/Paix, Concentration/Focus, Pensif/Méditatif.
3. États de Fatigue & Stress : Fatigue/Épuisement, Stress/Anxiété, Ennui/Lassitude.
4. Émotions Spontanées : Surprise/Étonnement, Confusion/Hésitation.

Directives :
1. Analyse les micro-expressions verbales, la fatigue psychologique et les émotions dans ces mots.
2. Tu dois renvoyer STRICTEMENT un JSON valide (aucun texte d'explication en dehors du JSON, pas de balise markdown, juste le JSON brut) respectant cette structure :
{
  "dominant_emotion": "Sérénité",
  "verdict": "Phrase percutante résumant l'ambiance du message vocal (en français, chaleureuse et moderne)",
  "indicators": [
    { "label": "Sérénité", "percentage": 70 },
    { "label": "Fatigue", "percentage": 30 }
  ],
  "facial_reading": "Explication vocale brève décrivant la cadence et l'expression détectée dans la voix (2-3 lignes max)",
  "conseil_aura": "Conseil actionnable et positif pour réaligner ou booster son Aura (2-3 lignes max)"
}

Règles :
- Le tableau "indicators" doit contenir entre 2 et 4 éléments dont les pourcentages totalisent 100%.
- Formule TOUT en français.`;

      const model = this.genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        generationConfig: {
          temperature: 0.3,
          responseMimeType: "application/json",
        }
      });

      const response = await model.generateContent([prompt]);
      const text = response.response.text();
      const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      return JSON.parse(cleanedText);
    } catch (error) {
      this.logger.error("Erreur lors de l'analyse vocale avec Gemini", error);
      return {
        dominant_emotion: 'Sérénité',
        verdict: "Votre voix dégage une agréable sensation de tranquillité et de recul.",
        indicators: [
          { label: 'Sérénité', percentage: 70 },
          { label: 'Focus', percentage: 30 }
        ],
        facial_reading: "La cadence calme de vos mots traduit une belle clarté d'esprit et une respiration posée.",
        conseil_aura: "Poursuivez sur cette voie, accordez-vous un instant de respiration consciente ou une courte écoute musicale."
      };
    }
  }

  private getFallbackSentiment() {
    return {
      is_face_valid: true,
      error_alert: null,
      dominant_emotion: 'Sérénité',
      verdict: 'Je détecte une belle énergie sereine aujourd\'hui !',
      indicators: [
        { label: 'Sérénité', percentage: 65 },
        { label: 'Focus', percentage: 25 },
        { label: 'Confiance', percentage: 10 },
      ],
      facial_reading: 'Vos traits reflètent un calme intérieur apaisant. La détente de vos sourcils et la douceur de vos lèvres traduisent une harmonie sereine.',
      conseil_aura: 'Profitez de cette clarté d\'esprit pour avancer sur vos projets importants. N\'oubliez pas de vous accorder une vraie pause pour prolonger cette belle énergie.',
    };
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
