import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { MusicMappingService } from './music-mapping.service';
import { SpotifyApiService } from './spotify-api.service';
import { FallbackMusicService } from './fallback-music.service';
import { CacheService } from './cache.service';
import { EnrichedMoodProfile } from './user-mood-provider.service';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SpotifyRecommendationService {
  constructor(
    private readonly musicMappingService: MusicMappingService,
    private readonly spotifyApiService: SpotifyApiService,
    private readonly fallbackMusicService: FallbackMusicService,
    private readonly cacheService: CacheService,
    private readonly httpService: HttpService,
  ) {}

  async recommendFromMood(input: EnrichedMoodProfile, userMusicPreferences: string[], trending: boolean = true) {
    const mapping = this.musicMappingService.buildSpotifyParams({
      moodPrincipal: input.humeur_detectee,
      niveauEnergie: input.niveau_energie,
      contexte: input.contexte,
      userMusicPreferences,
    } as any, trending);

    // On varie les graines de recherche à chaque fois pour plus d'aléatoire
    const shuffledGenres = [...mapping.seedGenres].sort(() => Math.random() - 0.5);
    const randomizedMapping = {
      ...mapping,
      seedGenres: shuffledGenres.slice(0, 2),
    };

    // AUCUN CACHE pour garantir l'aléatoire à chaque appel (important pour la soutenance)
    const tracks = await this.getTracksWithFallback(input, randomizedMapping);

    // Mélanger les titres pour l'aléatoire final
    const shuffled = [...(tracks || [])].sort(() => Math.random() - 0.5);

    return {
      mapping,
      recommendations: shuffled.slice(0, 3).map((track) => ({
        ...track,
        justification: this.buildJustification(input, track.source || 'spotify'),
      })),
    };
  }

  private async getTracksWithFallback(input: EnrichedMoodProfile, mapping: any) {
    try {
      const spotifyTracks = await this.spotifyApiService.getRecommendations({
        ...mapping,
        limit: 50,
      });

      if (spotifyTracks.length >= 3) {
        return spotifyTracks.map((track) => ({ ...track, isFallback: false }));
      }
    } catch (_error: any) {
      console.error('[SpotifyRecommendation] Erreur API Spotify:', _error.message);
    }

    // Fallback sur le JSON local si Spotify échoue
    const fallbackTracks = await this.fallbackMusicService.getFallbackTracks(input.humeur_detectee, 10);
    return fallbackTracks.map((track) => ({ ...track, isFallback: true }));
  }

  private async isUrlValid(url: string): Promise<boolean> {
    try {
      // Certains serveurs CDN bloquent les requêtes HEAD, on utilise GET avec un petit range
      const response = await firstValueFrom(
        this.httpService.get(url, { 
          timeout: 3000,
          headers: { 'Range': 'bytes=0-0' } // On ne demande que le premier octet pour aller vite
        })
      );
      return response.status >= 200 && response.status < 300;
    } catch (e) {
      console.log(`[SpotifyRecommendation] URL invalide ou 404: ${url}`);
      return false;
    }
  }

  private buildJustification(input: EnrichedMoodProfile, source: string): string {
    const sourceText = source === 'spotify' ? 'via Spotify' : 'via fallback intelligent';
    const contextText = input.contexte ? ` dans un contexte ${input.contexte}` : '';
    const tagText = input.tags_style.length > 0 ? ` et ton style ${input.tags_style.join(', ')}` : '';
    return `Ce titre correspond a ton humeur ${input.humeur_detectee}${contextText}${tagText}, detectee ${sourceText}.`;
  }
}
