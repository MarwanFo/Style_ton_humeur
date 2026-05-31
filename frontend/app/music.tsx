import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, StatusBar, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons, Feather } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MusicRecommendation } from '@/components/music/MusicRecommendation';
import { API_URL } from '../constants/Api';
import { MusicTrackItem } from '@/hooks/useMusicRecommendationState';

export default function MusicScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [userId, setUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialTracks, setInitialTracks] = useState<MusicTrackItem[]>([]);
  const [moodResult, setMoodResult] = useState<{
    moodPrincipal: string;
    niveauEnergie: 'faible' | 'moyen' | 'élevé';
    contexte: string;
  }>({
    moodPrincipal: 'calme',
    niveauEnergie: 'moyen',
    contexte: 'music_screen',
  });

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const userRaw = await AsyncStorage.getItem('user');
        const user = userRaw ? JSON.parse(userRaw) : null;
        setUserId(user?.id || null);

        // Fetch dynamic configuration
        let isPremiumRequired = false;
        try {
          const configRes = await fetch(`${API_URL}/system-config`);
          if (configRes.ok) {
            const data = await configRes.json();
            isPremiumRequired = !!data.isMusicPremium;
            await AsyncStorage.setItem('system_config', JSON.stringify(data));
          } else {
            const cached = await AsyncStorage.getItem('system_config');
            if (cached) isPremiumRequired = !!JSON.parse(cached).isMusicPremium;
          }
        } catch (_) {
          const cached = await AsyncStorage.getItem('system_config');
          if (cached) isPremiumRequired = !!JSON.parse(cached).isMusicPremium;
        }

        if (isPremiumRequired && (!user || user.plan !== 'PREMIUM')) {
          setTimeout(() => {
            Alert.alert(
              "👑 Musique Premium",
              "L'Ambiance Musicale IA est réservée aux membres Aura Premium.",
              [
                { text: "Devenir Premium 👑", onPress: () => router.replace('/(tabs)/two') },
                { text: "Retour", onPress: () => {
                  if (router.canGoBack()) {
                    router.back();
                  } else {
                    router.replace('/(tabs)');
                  }
                }, style: "cancel" }
              ],
              { cancelable: false }
            );
          }, 150);
          return;
        }

        const recoRaw = await AsyncStorage.getItem('latestRecommendation');
        if (recoRaw) {
          const reco = JSON.parse(recoRaw);
          setInitialTracks(reco.music || []);

          const mood = reco.detected_mood || 'calme';
          const niveauEnergie =
            mood === 'joyeux' || mood === 'confiant' || mood === 'énergique'
              ? 'élevé'
              : mood === 'calme'
                ? 'faible'
                : 'moyen';

          setMoodResult({
            moodPrincipal: mood,
            niveauEnergie,
            contexte: 'music_screen',
          });
        }
      } catch (_e) {
        // The recommendation component already handles fallback.
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={StyleSheet.absoluteFill}>
        <LinearGradient colors={['#EDE9FE', '#F3F4F6']} style={StyleSheet.absoluteFillObject} />
        <View style={styles.orbTopRight} />
        <View style={styles.orbBottomLeft} />
        <BlurView intensity={90} tint="light" style={StyleSheet.absoluteFillObject} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 30 }]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInUp.duration(800).springify()} style={styles.header}>
          <Pressable style={styles.closeBtn} onPress={() => router.back()}>
            <Feather name="arrow-left" size={22} color="#111827" />
          </Pressable>
          <View style={styles.headerCenter}>
            <Text style={styles.headerSubtitle}>AMBIANCE MUSICALE</Text>
            <Text style={styles.headerTitle}>Recommandations Spotify</Text>
          </View>
          <View style={styles.placeholderBtn} />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(80).duration(800).springify()} style={styles.infoCard}>
          <BlurView intensity={65} tint="light" style={StyleSheet.absoluteFillObject} />
          <Ionicons name="sparkles" size={18} color="#8B5CF6" />
          <Text style={styles.infoText}>
            Cette page utilise la nouvelle implementation. Verifie le badge source (spotify, fallback_db, fallback_json).
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(160).duration(800).springify()}>
          <MusicRecommendation
            userId={userId}
            moodResult={moodResult}
            initialTracks={initialTracks}
            globalLoading={loading}
          />
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  orbTopRight: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: '#DDD6FE',
    top: -100,
    right: -80,
    opacity: 0.5,
  },
  orbBottomLeft: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: '#FBCFE8',
    bottom: -60,
    left: -80,
    opacity: 0.4,
  },
  scrollContent: {
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  closeBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerSubtitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#6B7280',
    letterSpacing: 2,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.5,
  },
  placeholderBtn: {
    width: 48,
  },
  infoCard: {
    marginBottom: 22,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
    overflow: 'hidden',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: '#4B5563',
    lineHeight: 18,
    fontWeight: '600',
  },
});
