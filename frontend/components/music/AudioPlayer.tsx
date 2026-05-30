import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert, Pressable } from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';

type AudioPlayerProps = {
  previewUrl: string | null;
  isPlaying: boolean;
  onPlayStateChange: (isPlaying: boolean) => void;
  onSearchFallback?: () => void;
  isFallback?: boolean;
  trackId?: string;
};

export function AudioPlayer({ previewUrl, isPlaying, onPlayStateChange, onSearchFallback, isFallback, trackId }: AudioPlayerProps) {
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
    let targetUrl = previewUrl;
    let usingFallbackDemo = false;

    if (!targetUrl) {
      usingFallbackDemo = true;
      let songIndex = 1;
      const seed = trackId || "fallback_default";
      let sum = 0;
      for (let i = 0; i < seed.length; i++) {
        sum += seed.charCodeAt(i);
      }
      songIndex = (sum % 12) + 1;
      targetUrl = `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${songIndex}.mp3`;
    }

    setIsLoading(true);
    setError(false);
    console.log('[AudioPlayer] Tentative de lecture:', targetUrl);

    try {
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

      try {
        if (usingFallbackDemo) {
          throw new Error("No preview URL provided by Spotify");
        }

        const { sound: newSound, status } = await Audio.Sound.createAsync(
          { uri: targetUrl },
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
        
        let songIndex = 1;
        const seed = previewUrl || trackId || "default";
        let sum = 0;
        for (let i = 0; i < seed.length; i++) {
          sum += seed.charCodeAt(i);
        }
        songIndex = (sum % 12) + 1;
        const FALLBACK_URL = `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${songIndex}.mp3`;
        
        const { sound: fallbackSound, status: fbStatus } = await Audio.Sound.createAsync(
          { uri: FALLBACK_URL },
          { shouldPlay: true, volume: 0.8 },
          onPlaybackStatusUpdate
        );

        if (fbStatus.isLoaded) {
          setSound(fallbackSound);
          onPlayStateChange(true);
          console.log(`[AudioPlayer] Lecture Fallback OK (Piste ${songIndex})`);
          Alert.alert(
            "Mode Démonstration", 
            `Extrait Spotify indisponible. Lecture de la piste de secours #${songIndex} pour la démonstration.`
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
        pressed && { opacity: 0.8 },
      ]}
      onPress={handlePress}
      disabled={isLoading}
      hitSlop={10}
    >
      {isLoading ? (
        <ActivityIndicator size={20} color="#8B5CF6" />
      ) : error ? (
        <Ionicons name="alert-circle" size={24} color="#EF4444" />
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
