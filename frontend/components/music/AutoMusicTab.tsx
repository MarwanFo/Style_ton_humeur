import React from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { MusicTrackItem } from '@/hooks/useMusicRecommendationState';

interface AutoMusicTabProps {
  isLoading: boolean;
  requiresScans: boolean;
  missingScans: string[];
  tracks: MusicTrackItem[];
  renderTrackCard: (track: MusicTrackItem, index: number, displayTracks: MusicTrackItem[]) => React.ReactNode;
}

export function AutoMusicTab({ 
  isLoading, 
  requiresScans, 
  missingScans, 
  tracks, 
  renderTrackCard 
}: AutoMusicTabProps) {
  const router = useRouter();

  if (isLoading) {
    return <ActivityIndicator size="large" color="#8B5CF6" style={{ marginVertical: 40 }} />;
  }

  if (requiresScans) {
    return (
      <View style={[styles.cardShadow]}>
        <View style={[styles.card, styles.stateCard]}>
          <BlurView intensity={70} tint="light" style={StyleSheet.absoluteFillObject} />
          <LinearGradient
            colors={['rgba(255,255,255,0.75)', 'rgba(255,255,255,0.45)']}
            style={StyleSheet.absoluteFillObject}
          />
          <View style={styles.emptyIconContainer}>
            <Ionicons name="lock-closed" size={44} color="#EF4444" />
          </View>
          <Text style={[styles.stateTitle, { color: '#EF4444' }]}>Accès Verrouillé</Text>
          <Text style={styles.stateSubtitle}>
            Effectuez vos scans quotidiens pour débloquer vos recommandations.
          </Text>

          <View style={styles.redirectContainer}>
            {missingScans.includes('style') && (
              <Pressable 
                style={styles.redirectBtn} 
                onPress={() => router.push('/(tabs)')}
              >
                <LinearGradient colors={['#8B5CF6', '#7C3AED']} style={styles.redirectGradient}>
                  <Ionicons name="shirt-outline" size={16} color="#FFF" />
                  <Text style={styles.redirectText}>Scan Style & Mode</Text>
                </LinearGradient>
              </Pressable>
            )}

            {missingScans.includes('sentiment') && (
              <Pressable 
                style={styles.redirectBtn} 
                onPress={() => router.push('/sentiments')}
              >
                <LinearGradient colors={['#EC4899', '#DB2777']} style={styles.redirectGradient}>
                  <Ionicons name="heart-outline" size={16} color="#FFF" />
                  <Text style={styles.redirectText}>Scan Sentiments</Text>
                </LinearGradient>
              </Pressable>
            )}

            {missingScans.includes('beauty') && (
              <Pressable 
                style={styles.redirectBtn} 
                onPress={() => router.push('/(tabs)')}
              >
                <LinearGradient colors={['#10B981', '#059669']} style={styles.redirectGradient}>
                  <Ionicons name="sparkles-outline" size={16} color="#FFF" />
                  <Text style={styles.redirectText}>Scan Beauté</Text>
                </LinearGradient>
              </Pressable>
            )}
          </View>
        </View>
      </View>
    );
  }

  if (tracks.length === 0) {
    return (
      <View style={[styles.cardShadow]}>
        <View style={[styles.card, styles.stateCard]}>
          <BlurView intensity={70} tint="light" style={StyleSheet.absoluteFillObject} />
          <View style={styles.emptyIconContainer}>
            <Ionicons name="sparkles-outline" size={38} color="#8B5CF6" />
          </View>
          <Text style={styles.stateTitle}>Musique automatique</Text>
          <Text style={styles.stateSubtitle}>
            Aucune recommandation disponible pour le moment.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View>
      {tracks.slice(0, 3).map((track, index) => renderTrackCard(track, index, tracks))}
    </View>
  );
}

const styles = StyleSheet.create({
  cardShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    overflow: 'hidden',
  },
  stateCard: {
    height: 320,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: 'transparent',
  },
  emptyIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#F3F0FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  stateTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  stateSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 10,
  },
  redirectContainer: {
    width: '100%',
    gap: 10,
    marginTop: 15,
  },
  redirectBtn: {
    width: '100%',
    height: 44,
    borderRadius: 12,
    overflow: 'hidden',
  },
  redirectGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  redirectText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
