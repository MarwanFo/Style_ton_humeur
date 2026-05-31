import { View, Text, StyleSheet, Pressable, ScrollView, ActivityIndicator, Alert, Linking } from 'react-native';
import React, { useEffect, useState } from 'react';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { MusicTrackItem, useMusicRecommendationState } from '@/hooks/useMusicRecommendationState';
import { AudioPlayer } from './AudioPlayer';
import { MoodQuestionnaireModal } from './MoodQuestionnaireModal';
import { AutoMusicTab } from './AutoMusicTab';
import { useMusicRecommendations } from '@/hooks/useMusicRecommendations';

type MusicRecommendationProps = {
  userId: number | null;
  moodResult?: any;
  initialTracks?: MusicTrackItem[];
  globalLoading?: boolean;
};

export function MusicRecommendation({
  userId,
  moodResult,
  initialTracks = [],
  globalLoading,
}: MusicRecommendationProps) {
  const router = useRouter();
  const { tracks, setTracks, setTrackFeedback, toggleFavorite } = useMusicRecommendationState(initialTracks);
  const [activeTab, setActiveTab] = useState<'automatic' | 'manual'>(initialTracks.length > 0 ? 'automatic' : 'automatic');
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [questionnaireOpen, setQuestionnaireOpen] = useState(false);
  const [autoTracks, setAutoTracks] = useState<MusicTrackItem[]>(initialTracks);
  const [manualTracks, setManualTracks] = useState<MusicTrackItem[]>([]);
  const [requiresScans, setRequiresScans] = useState(false);
  const [missingScans, setMissingScans] = useState<string[]>([]);

  const api = useMusicRecommendations({
    userId,
    moodResult,
    existingTracks: initialTracks,
  });

  useEffect(() => {
    if (userId) {
      api.fetchAutomaticRecommendations();
    }
  }, [userId]);

  useEffect(() => {
    if (api.source === 'automatic' && api.tracks.length > 0) {
      setAutoTracks(api.tracks);
    } else if (api.source === 'manual' && api.tracks.length > 0) {
      setManualTracks(api.tracks);
    }
    
    // Si le backend demande des scans, on vide les pistes automatiques pour ne pas afficher d'anciennes données
    if (api.requiresScans) {
      setAutoTracks([]);
    }
    setRequiresScans(api.requiresScans);
    setMissingScans(api.missingScans);
  }, [api.tracks, api.source, api.requiresScans, api.missingScans]);

  const handlePlayStateChange = (trackId: string, playing: boolean) => {
    if (playing) {
      setPlayingTrackId(trackId);
      setIsPlaying(true);
    } else if (playingTrackId === trackId) {
      setIsPlaying(false);
    }
  };

  const handleManualSubmit = (questionnaire: any) => {
    api.fetchManualRecommendations(questionnaire);
    setQuestionnaireOpen(false);
    setActiveTab('manual');
  };

  const openInSpotify = async (track: MusicTrackItem) => {
    if (!track.spotifyUri && !track.spotifyUrl) {
      Alert.alert('Indisponible', "Ce morceau n'a pas de lien Spotify.");
      return;
    }

    const spotifyAppUri = track.spotifyUri || `spotify:track:${track.trackId}`;
    const spotifyWebUrl = track.spotifyUrl || `https://open.spotify.com/track/${track.trackId}`;

    try {
      const canOpen = await Linking.canOpenURL(spotifyAppUri);
      if (canOpen) {
        await Linking.openURL(spotifyAppUri);
      } else {
        await Linking.openURL(spotifyWebUrl);
      }
    } catch (error) {
      console.error('Error opening Spotify:', error);
      await Linking.openURL(spotifyWebUrl);
    }
  };

  const handleRefresh = () => {
    // Feedback visuel immédiat pour la soutenance
    setAutoTracks([]);
    setManualTracks([]);
    
    // Appel API avec bypass de cache
    api.fetchAutomaticRecommendations();
  };

  const openExternalSearch = (track: MusicTrackItem) => {
    const query = encodeURIComponent(`${track.title} ${track.artist}`);
    const url = `https://www.youtube.com/results?search_query=${query}`;
    Linking.openURL(url);
  };

  const renderTrackCard = (track: MusicTrackItem, index: number, displayTracks: MusicTrackItem[]) => (
    <View key={track.trackId + '-' + index} style={[styles.cardShadow, { marginBottom: index === displayTracks.length - 1 ? 0 : 12 }]}>
      <View style={styles.card}>
        <View style={styles.trackInfo}>
          <View style={styles.artworkContainer}>
            {track.coverUrl ? (
              <LinearGradient colors={['#F3F4F6', '#E5E7EB']} style={styles.artwork}>
                <Ionicons name="musical-note" size={24} color="#9CA3AF" />
              </LinearGradient>
            ) : (
              <LinearGradient colors={['#F3F4F6', '#E5E7EB']} style={styles.artwork}>
                <Ionicons name="musical-note" size={24} color="#9CA3AF" />
              </LinearGradient>
            )}
            <View style={styles.trackNumberBadge}>
              <Text style={styles.trackNumberText}>{index + 1}</Text>
            </View>
          </View>
          <View style={styles.details}>
            <Text style={styles.title} numberOfLines={1}>{track.title}</Text>
            <Text style={styles.artist} numberOfLines={1}>{track.artist}</Text>
          </View>
          <AudioPlayer
            previewUrl={track.previewUrl ?? null}
            isPlaying={playingTrackId === track.trackId && isPlaying}
            onPlayStateChange={(playing) => handlePlayStateChange(track.trackId, playing)}
            onSearchFallback={() => openExternalSearch(track)}
            trackId={track.trackId}
          />
        </View>
        
        {track.justification && (
          <View style={styles.justificationBox}>
            <Text style={styles.justificationText}>{track.justification}</Text>
          </View>
        )}

        <View style={styles.actions}>
          <Pressable 
            style={styles.spotifyBtn}
            onPress={() => openInSpotify(track)}
          >
            <FontAwesome name="spotify" size={18} color="#1DB954" />
            <Text style={styles.spotifyBtnText}>Ouvrir sur Spotify</Text>
          </Pressable>
          <View style={styles.feedbackBtns}>
            <Pressable 
              style={[styles.iconBtn, track.liked && styles.likedBtn]} 
              onPress={() => setTrackFeedback(track.trackId, 'like')}
            >
              <Ionicons name={track.liked ? "heart" : "heart-outline"} size={20} color={track.liked ? "#FFF" : "#6B7280"} />
            </Pressable>
            <Pressable 
              style={[styles.iconBtn, track.isFavorite && styles.favoriteBtn]} 
              onPress={() => toggleFavorite(track.trackId)}
            >
              <Ionicons name={track.isFavorite ? "star" : "star-outline"} size={20} color={track.isFavorite ? "#FFF" : "#6B7280"} />
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.section}>
      <MoodQuestionnaireModal
        visible={questionnaireOpen}
        onSubmit={handleManualSubmit}
      />

      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>Ambiance musicale</Text>
        </View>
        <Pressable 
          onPress={handleRefresh}
          style={({ pressed }) => [
            styles.refreshBtn, 
            pressed && { opacity: 0.7 }
          ]}
          disabled={api.isLoading}
        >
          <Ionicons name="refresh" size={18} color="#8B5CF6" />
          <Text style={styles.refreshText}>Actualiser</Text>
        </Pressable>
      </View>

      <View style={styles.tabs}>
        <Pressable
          onPress={() => setActiveTab('automatic')}
          style={[styles.tab, activeTab === 'automatic' && styles.activeTab]}
        >
          <Ionicons 
            name="sparkles" 
            size={18} 
            color={activeTab === 'automatic' ? '#FFF' : '#6B7280'} 
          />
          <Text style={[styles.tabText, activeTab === 'automatic' && styles.activeTabText]}>
            Automatique
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setActiveTab('manual')}
          style={[styles.tab, activeTab === 'manual' && styles.activeTab]}
        >
          <Ionicons 
            name="person" 
            size={18} 
            color={activeTab === 'manual' ? '#FFF' : '#6B7280'} 
          />
          <Text style={[styles.tabText, activeTab === 'manual' && styles.activeTabText]}>
            Manuelle
          </Text>
        </Pressable>
      </View>

      {activeTab === 'manual' ? (
        <View>
          {manualTracks.length > 0 ? (
            <View>
              {manualTracks.map((track, index) => renderTrackCard(track, index, manualTracks))}
              <Pressable 
                style={styles.newManualBtn}
                onPress={() => setQuestionnaireOpen(true)}
              >
                <Text style={styles.newManualBtnText}>Nouveau questionnaire</Text>
              </Pressable>
            </View>
          ) : (
            <View style={[styles.cardShadow]}>
              <View style={[styles.card, styles.stateCard]}>
                <BlurView intensity={70} tint="light" style={StyleSheet.absoluteFillObject} />
                <View style={styles.emptyIconContainer}>
                  <Ionicons name="clipboard-outline" size={38} color="#8B5CF6" />
                </View>
                <Text style={styles.stateTitle}>Mode manuel</Text>
                <Text style={styles.stateSubtitle}>
                  Répondez à quelques questions pour obtenir des musiques adaptées à votre moment.
                </Text>
                <Pressable
                  style={styles.generateButton}
                  onPress={() => setQuestionnaireOpen(true)}
                >
                  <LinearGradient
                    colors={['#8B5CF6', '#7C3AED']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradientBtn}
                  >
                    <Ionicons name="sparkles" size={15} color="#FFF" />
                    <Text style={styles.generateButtonText}>Remplir le questionnaire</Text>
                  </LinearGradient>
                </Pressable>
              </View>
            </View>
          )}
        </View>
      ) : (
        <View>
          {requiresScans ? (
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
                  Pour débloquer vos musiques automatiques, vous devez impérativement effectuer vos scans du jour.
                </Text>

                <View style={styles.redirectContainer}>
                  <Pressable 
                    style={styles.redirectBtn} 
                    onPress={() => router.push('/(tabs)')}
                  >
                    <LinearGradient colors={['#8B5CF6', '#7C3AED']} style={styles.redirectGradient}>
                      <Ionicons name="shirt-outline" size={16} color="#FFF" />
                      <Text style={styles.redirectText}>Style & Mode</Text>
                    </LinearGradient>
                  </Pressable>

                  <Pressable 
                    style={styles.redirectBtn} 
                    onPress={() => router.push('/sentiments')}
                  >
                    <LinearGradient colors={['#EC4899', '#DB2777']} style={styles.redirectGradient}>
                      <Ionicons name="heart-outline" size={16} color="#FFF" />
                      <Text style={styles.redirectText}>Sentiments</Text>
                    </LinearGradient>
                  </Pressable>
                </View>
              </View>
            </View>
          ) : autoTracks.length > 0 ? (
            autoTracks.slice(0, 3).map((track, index) => renderTrackCard(track, index, autoTracks))
          ) : api.isLoading ? (
            <ActivityIndicator size="large" color="#8B5CF6" style={{ marginVertical: 40 }} />
          ) : (
            <View style={[styles.cardShadow]}>
              <View style={[styles.card, styles.stateCard]}>
                <BlurView intensity={70} tint="light" style={StyleSheet.absoluteFillObject} />
                <LinearGradient
                  colors={['rgba(255,255,255,0.75)', 'rgba(255,255,255,0.45)']}
                  style={StyleSheet.absoluteFillObject}
                />
                <View style={styles.emptyIconContainer}>
                  <Ionicons name="sparkles-outline" size={38} color="#8B5CF6" />
                </View>
                <Text style={styles.stateTitle}>Musique automatique</Text>
                <Text style={styles.stateSubtitle}>
                  Utilisez d'abord les fonctionnalités Style, Beauté ou Sentiments pour obtenir des recommandations basées sur votre analyse.
                </Text>
              </View>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: 32 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.3,
  },
  refreshBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#8B5CF6', // Changé en violet plein pour être très visible
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 3, // Ombre sur Android
    shadowColor: '#000', // Ombre sur iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  refreshText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFF', // Texte blanc sur fond violet
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  activeTab: {
    backgroundColor: '#8B5CF6',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#FFF',
  },
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
  trackInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  artworkContainer: {
    position: 'relative',
  },
  artwork: {
    width: 60,
    height: 60,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trackNumberBadge: {
    position: 'absolute',
    top: -6,
    left: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  trackNumberText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  details: {
    flex: 1,
    marginLeft: 14,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  artist: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  justificationBox: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  justificationText: {
    fontSize: 12,
    color: '#4B5563',
    lineHeight: 18,
    fontStyle: 'italic',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  spotifyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  spotifyBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#166534',
  },
  feedbackBtns: {
    flexDirection: 'row',
    gap: 8,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  likedBtn: {
    backgroundColor: '#EC4899',
    borderColor: '#EC4899',
  },
  favoriteBtn: {
    backgroundColor: '#F59E0B',
    borderColor: '#F59E0B',
  },
  stateCard: {
    height: 240,
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
  generateButton: {
    marginTop: 20,
    borderRadius: 12,
    overflow: 'hidden',
    width: '100%',
  },
  gradientBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  generateButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
  newManualBtn: {
    marginTop: 12,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  newManualBtnText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#8B5CF6',
    borderRadius: 20,
  },
  retryButtonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
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
