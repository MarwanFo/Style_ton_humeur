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
    return !!previewUrl;
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
    const url = `${this.apiBaseUrl}/search`;
    let retries = 0;
    const maxRetries = 2;

    const genre = input.seedGenres && input.seedGenres.length > 0 ? input.seedGenres[0] : 'pop';
    const query = `genre:${genre}`;

    while (retries <= maxRetries) {
      try {
        const response = await firstValueFrom(
          this.httpService.get(url, {
            timeout: 6000,
            headers: { Authorization: `Bearer ${token}` },
            params: {
              q: query,
              type: 'track',
              limit: input.limit || 20,
            },
          }),
        );

        const tracks = (response.data?.tracks?.items || []) as SpotifyTrack[];

        // Validate and enrich preview URLs (from Spotify or Deezer) for each track
        const validatedTracks = await Promise.all(
          tracks.map(async (track) => {
            let previewUrl = track.preview_url;

            // Si l'extrait Spotify est absent (cas quasi-systématique aujourd'hui),
            // on l'enrichit dynamiquement en interrogeant l'API publique ouverte de Deezer.
            if (!previewUrl) {
              try {
                const artistName = track.artists?.[0]?.name || '';
                const query = encodeURIComponent(`${artistName} ${track.name}`);
                const deezerResponse = await firstValueFrom(
                  this.httpService.get(`https://api.deezer.com/search?q=${query}`, { timeout: 3000 })
                );
                const deezerTrack = deezerResponse.data?.data?.[0];
                if (deezerTrack?.preview) {
                  previewUrl = deezerTrack.preview;
                }
              } catch (deezerError) {
                this.logger.warn(`Failed to fetch preview from Deezer for ${track.name}: ${deezerError.message}`);
              }
            }

            const isValid = previewUrl ? await this.isPreviewUrlValid(previewUrl) : false;
            return {
              ...track,
              preview_url: previewUrl,
              hasValidPreview: isValid,
            };
          }),
        );

        // Filter tracks with valid preview URLs
        const filteredTracks = validatedTracks.filter((track) => track.hasValidPreview);
        const tracksToUse = filteredTracks.length > 0 ? filteredTracks : validatedTracks.slice(0, 10);

        return tracksToUse.map((track) => ({
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
