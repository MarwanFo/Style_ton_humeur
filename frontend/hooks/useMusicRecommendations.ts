import { useCallback, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@/constants/Api';
import { MusicTrackItem } from './useMusicRecommendationState';

type MoodResultPayload = {
  moodPrincipal: string;
  niveauEnergie: 'faible' | 'moyen' | 'élevé';
  contexte?: string;
};

type UseMusicRecommendationsArgs = {
  userId: number | null;
  moodResult?: MoodResultPayload;
  existingTracks?: MusicTrackItem[];
};

export function useMusicRecommendations({ userId, moodResult, existingTracks = [] }: UseMusicRecommendationsArgs) {
  const [tracks, setTracks] = useState<MusicTrackItem[]>(existingTracks);
  const [recommendationId, setRecommendationId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<'manual' | 'automatic' | null>(null);
  const [requiresScans, setRequiresScans] = useState(false);
  const [missingScans, setMissingScans] = useState<string[]>([]);

  const fetchAutomaticRecommendations = useCallback(async () => {
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

    try {
      const token = await AsyncStorage.getItem('token');
      // On ajoute un paramètre timestamp pour éviter le cache du navigateur/mobile
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
        setSource(null);
        if (payload.requiresScans) {
          setRequiresScans(true);
          setMissingScans(payload.missingScans || []);
        }
        return;
      }

      setRecommendationId(payload.recommendationId || null);
      setTracks(payload.recommendations || []);
      setSource('automatic');
      setRequiresScans(false);
      setMissingScans([]);
    } catch (_error) {
      setError('Impossible de contacter le serveur. Vérifiez votre connexion et réessayez.');
      setTracks([]);
      setSource(null);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const fetchManualRecommendations = useCallback(async (questionnaire: {
    humeur_detectee: 'joyeux' | 'calme' | 'confiant' | 'stressé' | 'nostalgique';
    niveau_energie: 'faible' | 'moyen' | 'élevé';
    contexte?: 'travail' | 'sortie' | 'sport' | 'maison';
  }) => {
    let resolvedUserId = userId;
    if (!resolvedUserId) {
      const userRaw = await AsyncStorage.getItem('user');
      const userParsed = userRaw ? JSON.parse(userRaw) : null;
      resolvedUserId = userParsed?.id || null;
    }
    if (!resolvedUserId) return;

    setIsLoading(true);
    setError(null);

    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${API_URL}/music/manual`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ userId: resolvedUserId, questionnaire }),
      });

      if (!response.ok) {
        throw new Error(`Music API failed with ${response.status}`);
      }

      const payload = await response.json();

      if (!payload.success) {
        setError(payload.message || 'Erreur lors de la récupération des recommandations.');
        setTracks([]);
        setSource(null);
        return;
      }

      setRecommendationId(payload.recommendationId || null);
      setTracks(payload.recommendations || []);
      setSource('manual');
    } catch (_error) {
      setError('Impossible de contacter le serveur. Vérifiez votre connexion et réessayez.');
      setTracks([]);
      setSource(null);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const sendFeedback = useCallback(
    async (trackId: string, liked: boolean) => {
      if (!recommendationId) return;
      const token = await AsyncStorage.getItem('token');
      await fetch(`${API_URL}/music/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          recommendationId,
          trackId,
          liked,
        }),
      });
    },
    [recommendationId],
  );

  return {
    tracks,
    setTracks,
    isLoading,
    error,
    source,
    requiresScans,
    missingScans,
    fetchAutomaticRecommendations,
    fetchManualRecommendations,
    sendFeedback,
  };
}
