import { useCallback, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@/constants/Api';
import { MusicTrackItem } from './useMusicRecommendationState';

export function useAutoMusic() {
  const [tracks, setTracks] = useState<MusicTrackItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requiresScans, setRequiresScans] = useState(false);
  const [missingScans, setMissingScans] = useState<string[]>([]);

  const fetchRecommendations = useCallback(async (userId: number | null) => {
    let resolvedUserId = userId;
    if (!resolvedUserId) {
      const userRaw = await AsyncStorage.getItem('user');
      const userParsed = userRaw ? JSON.parse(userRaw) : null;
      resolvedUserId = userParsed?.id || null;
    }
    if (!resolvedUserId) return;

    setIsLoading(true);
    setError(null);
    setRequiresScans(false);
    setMissingScans([]);

    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${API_URL}/music/auto?userId=${resolvedUserId}&t=${Date.now()}`, {
        method: 'GET',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!response.ok) {
        throw new Error(`Music API failed with ${response.status}`);
      }

      const payload = await response.json();

      if (!payload.success) {
        setError(payload.message || 'Erreur lors de la récupération des recommandations.');
        setTracks([]);
        if (payload.requiresScans) {
          setRequiresScans(true);
          setMissingScans(payload.missingScans || []);
        }
        return;
      }

      setTracks(payload.recommendations || []);
      setRequiresScans(false);
      setMissingScans([]);
    } catch (_error) {
      setError('Impossible de contacter le serveur. Vérifiez votre connexion et réessayez.');
      setTracks([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    tracks,
    setTracks,
    isLoading,
    error,
    requiresScans,
    missingScans,
    fetchRecommendations,
  };
}
