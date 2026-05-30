import { Injectable, Logger } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';
import { PrismaService } from '../prisma/prisma.service';

type SimpleTrack = {
  trackId: string;
  title: string;
  artist: string;
  spotifyUrl?: string | null;
  previewUrl?: string | null;
  coverUrl?: string | null;
  source?: string;
};

@Injectable()
export class FallbackMusicService {
  private readonly logger = new Logger(FallbackMusicService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getFallbackTracks(moodPrincipal: string, limit: number): Promise<SimpleTrack[]> {
    try {
      const playlists = await (this.prisma as any).musicFallbackPlaylist.findMany({
        where: { moodPrincipal: moodPrincipal.toLowerCase() },
      });

      if (playlists.length > 0) {
        const selected = playlists[Math.floor(Math.random() * playlists.length)];
        const tracks = ((selected.tracks as SimpleTrack[]) || []).slice(0, limit);
        return tracks.map((track) => ({
          ...track,
          source: 'fallback_db',
          spotifyUrl: track.spotifyUrl || null,
          previewUrl: track.previewUrl || null,
          coverUrl: track.coverUrl || null,
        }));
      }
    } catch (error) {
      this.logger.warn('Fallback level 1 unavailable (DB). Switching to local JSON.', error);
    }

    const fallbackPath = join(process.cwd(), 'src', 'music', 'fallback_music.json');
    const raw = readFileSync(fallbackPath, { encoding: 'utf-8' });
    const parsed = JSON.parse(raw) as Record<string, SimpleTrack[]>;
    const tracks = parsed[moodPrincipal.toLowerCase()] || parsed.default || [];

    return tracks.slice(0, limit).map((track) => ({
      ...track,
      source: 'fallback_json',
      spotifyUrl: track.spotifyUrl || null,
      previewUrl: track.previewUrl || null,
      coverUrl: track.coverUrl || null,
    }));
  }
}
