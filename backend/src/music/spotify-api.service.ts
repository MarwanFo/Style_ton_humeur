import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

type SpotifyTrack = {
  id: string;
  uri: string;
  name: string;
  artists: Array<{ name: string }>;
  external_urls?: { spotify?: string };
  preview_url?: string | null;
  album?: { images?: Array<{ url: string }> };
  popularity?: number;
};

type SpotifyRecommendationInput = {
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
  limit: number;
};

@Injectable()
export class SpotifyApiService {
  private readonly logger = new Logger(SpotifyApiService.name);
  private readonly accountsUrl = 'https://accounts.spotify.com/api/token';
  private readonly apiBaseUrl = 'https://api.spotify.com/v1';
  private tokenCache: { value: string; expiresAt: number } | null = null;

  constructor(private readonly httpService: HttpService) {}

  async getRecommendations(input: SpotifyRecommendationInput) {
    const token = await this.getClientCredentialsToken();
    const tracks = await this.fetchRecommendationsWithRetry(input, token);
    return tracks;
  }

  private async isPreviewUrlValid(previewUrl: string): Promise<boolean> {
    if (!previewUrl) return false;

    try {
      const response = await firstValueFrom(
        this.httpService.head(previewUrl, {
          timeout: 2000,
          validateStatus: (status) => status === 200,
        }),
      );
      return true;
    } catch (error) {
      if (error instanceof AxiosError) {
        this.logger.warn(`Preview URL validation failed: ${previewUrl} - Status: ${error.response?.status}`);
      }
      return false;
    }
  }

  private async getClientCredentialsToken(): Promise<string> {
    if (this.tokenCache && Date.now() < this.tokenCache.expiresAt) {
      return this.tokenCache.value;
    }

    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    if (!clientId || !clientSecret) {
      throw new Error('Spotify credentials are not configured.');
    }

    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const response = await firstValueFrom(
      this.httpService.post(
        this.accountsUrl,
        new URLSearchParams({ grant_type: 'client_credentials' }).toString(),
        {
          timeout: 5000,
          headers: {
            Authorization: `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      ),
    );

    const accessToken = response.data?.access_token as string;
    const expiresIn = Number(response.data?.expires_in || 3600);
    if (!accessToken) {
      throw new Error('No Spotify access token returned by token endpoint.');
    }

    this.tokenCache = {
      value: accessToken,
      expiresAt: Date.now() + (expiresIn - 30) * 1000,
    };

    return accessToken;
  }

  private async fetchRecommendationsWithRetry(input: SpotifyRecommendationInput, token: string) {
    const url = `${this.apiBaseUrl}/recommendations`;
    let retries = 0;
    const maxRetries = 2;

    while (retries <= maxRetries) {
      try {
        const response = await firstValueFrom(
          this.httpService.get(url, {
            timeout: 6000,
            headers: { Authorization: `Bearer ${token}` },
            params: {
              limit: input.limit,
              seed_genres: input.seedGenres.join(','),
              target_valence: input.targetValence,
              min_valence: input.minValence,
              max_valence: input.maxValence,
              target_energy: input.targetEnergy,
              min_energy: input.minEnergy,
              max_energy: input.maxEnergy,
              target_danceability: input.targetDanceability,
              target_acousticness: input.targetAcousticness,
              ...(input.minPopularity && { min_popularity: input.minPopularity }),
            },
          }),
        );

        const tracks = (response.data?.tracks || []) as SpotifyTrack[];

        // Validate preview URLs for each track
        const validatedTracks = await Promise.all(
          tracks.map(async (track) => {
            const isValid = track.preview_url ? await this.isPreviewUrlValid(track.preview_url) : false;
            return {
              ...track,
              hasValidPreview: isValid,
            };
          }),
        );

        // Filter tracks with valid preview URLs
        const filteredTracks = validatedTracks.filter((track) => track.hasValidPreview);

        return filteredTracks.map((track) => ({
          trackId: track.id,
          spotifyUri: track.uri || null,
          title: track.name,
          artist: (track.artists || []).map((artist) => artist.name).join(', '),
          spotifyUrl: track.external_urls?.spotify || null,
          previewUrl: track.preview_url || null,
          coverUrl: track.album?.images?.[0]?.url || null,
          popularity: track.popularity || 0,
          source: 'spotify',
          isFallback: false,
        }));
      } catch (error: any) {
        const statusCode = error?.response?.status;
        if (statusCode === 429 && retries < maxRetries) {
          const retryAfterHeader = Number(error?.response?.headers?.['retry-after'] || 1);
          const retryAfterMs = Math.max(1, retryAfterHeader) * 1000;
          await this.delay(retryAfterMs);
          retries += 1;
          continue;
        }

        if (retries < maxRetries) {
          await this.delay(500 * (retries + 1));
          retries += 1;
          continue;
        }

        throw error;
      }
    }

    throw new Error('Spotify recommendations fetch retries exhausted.');
  }

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
