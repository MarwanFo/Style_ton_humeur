import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert, Pressable } from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';

type AudioPlayerProps = {
  previewUrl: string | null;
  isPlaying: boolean;
  onPlayStateChange: (isPlaying: boolean) => void;
  onSearchFallback?: () => void;
  trackId?: string;
};

export function AudioPlayer({ previewUrl, isPlaying, onPlayStateChange, onSearchFallback, trackId }: AudioPlayerProps) {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const loadAndPlaySound = async () => {
    if (!previewUrl) return;

    setIsLoading(true);
    setError(false);
    console.log('[AudioPlayer] Tentative de lecture:', previewUrl);

    try {
      // Configuration globale de l'audio
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      if (sound) {
        await sound.unloadAsync();
      }

      // Tentative de lecture de l'URL Spotify
      try {
        const { sound: newSound, status } = await Audio.Sound.createAsync(
          { uri: previewUrl },
          { shouldPlay: true, volume: 1.0 },
          onPlaybackStatusUpdate
        );

        if (status.isLoaded) {
          setSound(newSound);
          onPlayStateChange(true);
          console.log('[AudioPlayer] Lecture Spotify OK');
          return;
        }
      } catch (err: any) {
        console.warn('[AudioPlayer] Échec URL Spotify, tentative Fallback Immuable...', err.message);
        
        // FALLBACK IMMUABLE : Si Spotify 404, on joue un son de test stable
        const FALLBACK_URL = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
        
        const { sound: fallbackSound, status: fbStatus } = await Audio.Sound.createAsync(
          { uri: FALLBACK_URL },
          { shouldPlay: true, volume: 0.8 },
          onPlaybackStatusUpdate
        );

        if (fbStatus.isLoaded) {
          setSound(fallbackSound);
          onPlayStateChange(true);
          console.log('[AudioPlayer] Lecture Fallback OK');
          Alert.alert(
            "Mode Démonstration", 
            "Lien Spotify expiré. Lecture d'une piste de secours pour la démonstration."
          );
        }
      }
    } catch (err: any) {
      console.error('[AudioPlayer] Erreur critique:', err);
      setError(true);
      onPlayStateChange(false);
      Alert.alert("Erreur de lecture", "Impossible de lire la musique.");
    } finally {
      setIsLoading(false);
    }
  };

  const pauseSound = async () => {
    if (sound) {
      await sound.pauseAsync();
      onPlayStateChange(false);
    }
  };

  const resumeSound = async () => {
    if (sound) {
      await sound.playAsync();
      onPlayStateChange(true);
    }
  };

  const onPlaybackStatusUpdate = (status: any) => {
    if (status.didJustFinish) {
      onPlayStateChange(false);
    }
  };

  const handlePress = () => {
    if (!previewUrl) {
      Alert.alert(
        "Indisponible",
        "Spotify ne fournit pas d'extrait pour ce titre. Voulez-vous le rechercher ?",
        [
          { text: "Annuler", style: "cancel" },
          { text: "🔍 Rechercher", onPress: () => onSearchFallback && onSearchFallback() }
        ]
      );
      return;
    }

    if (isPlaying) {
      pauseSound();
    } else {
      if (sound) {
        resumeSound();
      } else {
        loadAndPlaySound();
      }
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.playButton, 
        pressed && previewUrl && { opacity: 0.8 },
        !previewUrl && styles.playButtonDisabled
      ]}
      onPress={handlePress}
      disabled={isLoading}
      hitSlop={10}
    >
      {isLoading ? (
        <ActivityIndicator size={20} color="#8B5CF6" />
      ) : error ? (
        <Ionicons name="alert-circle" size={24} color="#EF4444" />
      ) : !previewUrl ? (
        <Ionicons name="play-outline" size={24} color="#D1D5DB" />
      ) : isPlaying ? (
        <Ionicons name="pause" size={24} color="#8B5CF6" />
      ) : (
        <Ionicons name="play" size={24} color="#8B5CF6" />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  playButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButtonDisabled: {
    backgroundColor: 'rgba(209, 213, 219, 0.1)',
  },
});
