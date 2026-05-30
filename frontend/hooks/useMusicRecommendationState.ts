import { useMemo, useState } from 'react';

export type MusicTrackItem = {
  trackId: string;
  spotifyUri?: string | null;
  title: string;
  artist: string;
  justification?: string;
  spotifyUrl?: string | null;
  previewUrl?: string | null;
  coverUrl?: string | null;
  popularity?: number;
  liked?: boolean;
  disliked?: boolean;
  isFavorite?: boolean;
  source?: string;
  isFallback?: boolean;
};

export function useMusicRecommendationState(initialTracks: MusicTrackItem[] = []) {
  const [tracks, setTracks] = useState<MusicTrackItem[]>(initialTracks);

  const hasTracks = useMemo(() => tracks.length > 0, [tracks]);

  const setTrackFeedback = (trackId: string, feedback: 'like' | 'dislike') => {
    setTracks((prev) =>
      prev.map((track) => {
        if (track.trackId !== trackId) return track;
        if (feedback === 'like') {
          return { ...track, liked: !track.liked, disliked: false };
        }
        return { ...track, disliked: !track.disliked, liked: false };
      }),
    );
  };

  const toggleFavorite = (trackId: string) => {
    setTracks((prev) =>
      prev.map((track) =>
        track.trackId === trackId ? { ...track, isFavorite: !track.isFavorite } : track,
      ),
    );
  };

  return {
    tracks,
    hasTracks,
    setTracks,
    setTrackFeedback,
    toggleFavorite,
  };
}
