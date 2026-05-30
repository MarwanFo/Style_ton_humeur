import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, Pressable, ActivityIndicator, StatusBar, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons, Feather } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp, FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import { MusicRecommendation } from '@/components/music/MusicRecommendation';

const { width } = Dimensions.get('window');
export default function StyleAnalysisScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const [recommendation, setRecommendation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState<boolean | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [activeOutfitIndex, setActiveOutfitIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    const loadRecommendationData = async () => {
      try {
        const recoStr = await AsyncStorage.getItem('latestRecommendation');
        if (recoStr) {
          const parsed = JSON.parse(recoStr);
          setRecommendation(parsed);
          // Retrieve image URL if it exists in different structures
          if (parsed.imageUrl) {
            setImageUrl(parsed.imageUrl);
          } else if (parsed.checkin?.imageUrl) {
            setImageUrl(parsed.checkin.imageUrl);
          } else {
            const checkinStr = await AsyncStorage.getItem('latestCheckin');
            if (checkinStr) {
              const parsedCheckin = JSON.parse(checkinStr);
              if (parsedCheckin.imageUrl) {
                setImageUrl(parsedCheckin.imageUrl);
              } else if (parsedCheckin.checkin?.imageUrl) {
                setImageUrl(parsedCheckin.checkin.imageUrl);
              }
            }
          }

          // Check if this analysis is already in favorites
          const favsStr = await AsyncStorage.getItem('savedRecommendations');
          if (favsStr) {
            const favs = JSON.parse(favsStr);
            const isExist = favs.some((f: any) => 
              f.style_keywords?.join() === parsed.style_keywords?.join()
            );
            setIsFavorited(isExist);
          }
        }
      } catch (err) {
        Alert.alert('Erreur', 'Impossible de charger votre analyse de style.');
      } finally {
        setLoading(false);
      }
    };
    loadRecommendationData();

    return () => {
      Speech.stop();
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(() => {});
      }
    };
  }, []);

  const playAudioUrl = async (url: string) => {
    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync().catch(() => {});
        soundRef.current = null;
      }
      setIsSpeaking(true);

      const { sound } = await Audio.Sound.createAsync(
        { uri: url },
        { shouldPlay: true }
      );
      soundRef.current = sound;
      
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setIsSpeaking(false);
        }
      });
    } catch (err) {
      console.error("Failed to play neural voice audio", err);
      if (recommendation?.aiVoiceMessage) {
        setIsSpeaking(true);
        Speech.speak(recommendation.aiVoiceMessage, {
          language: 'fr-FR',
          onDone: () => setIsSpeaking(false),
          onError: () => setIsSpeaking(false),
        });
      } else {
        setIsSpeaking(false);
      }
    }
  };

  const stopSpeaking = async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.stopAsync().catch(() => {});
        await soundRef.current.unloadAsync().catch(() => {});
        soundRef.current = null;
      }
      Speech.stop();
    } catch (e) {}
    setIsSpeaking(false);
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else if (recommendation?.aiVoiceMessageUrl) {
      playAudioUrl(recommendation.aiVoiceMessageUrl);
    } else if (recommendation?.aiVoiceMessage) {
      setIsSpeaking(true);
      Speech.speak(recommendation.aiVoiceMessage, {
        language: 'fr-FR',
        onDone: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      });
    }
  };

  const toggleFavorite = async () => {
    if (!recommendation) return;
    try {
      const favsStr = await AsyncStorage.getItem('savedRecommendations');
      let favs = favsStr ? JSON.parse(favsStr) : [];
      
      const isExist = favs.some((f: any) => 
        f.style_keywords?.join() === recommendation.style_keywords?.join()
      );

      if (isExist) {
        favs = favs.filter((f: any) => 
          f.style_keywords?.join() !== recommendation.style_keywords?.join()
        );
        setIsFavorited(false);
      } else {
        favs.push({ ...recommendation, savedAt: new Date().toISOString() });
        setIsFavorited(true);
      }
      
      await AsyncStorage.setItem('savedRecommendations', JSON.stringify(favs));
    } catch (err) {
      Alert.alert('Erreur', 'Impossible de modifier vos favoris.');
    }
  };


  if (loading) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#8B5CF6" />
      </View>
    );
  }

  const outfits = recommendation?.outfits || [];
  const activeOutfit = outfits[activeOutfitIndex];
  const styleKeywords = recommendation?.style_keywords?.join(', ') || 'Avant-Garde';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={StyleSheet.absoluteFill}>
        <LinearGradient colors={['#F9FAFB', '#F3F4F6']} style={StyleSheet.absoluteFillObject} />
        <BlurView intensity={90} tint="light" style={StyleSheet.absoluteFillObject} />
      </View>

      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 60 }]} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInUp.duration(800).springify()} style={styles.header}>
          <Pressable style={styles.closeBtn} onPress={() => router.replace('/(tabs)')}>
            <Feather name="arrow-left" size={24} color="#111827" />
          </Pressable>
          <View style={styles.headerCenter}>
            <Text style={styles.headerSubtitle}>RAPPORT INTELLIGENT</Text>
            <Text numberOfLines={1} style={styles.headerTitle}>{styleKeywords}</Text>
          </View>
          <Pressable style={[styles.favBtn, isFavorited && styles.favBtnActive]} onPress={toggleFavorite}>
            <Ionicons name={isFavorited ? "bookmark" : "bookmark-outline"} size={22} color={isFavorited ? "#8B5CF6" : "#6B7280"} />
          </Pressable>
        </Animated.View>

        {imageUrl && (
          <Animated.View entering={FadeInDown.delay(150).duration(800).springify()} style={styles.silhouetteCardShadow}>
            <View style={styles.silhouetteCard}>
              <Image source={{ uri: imageUrl }} style={styles.silhouetteImage} />
              <View style={styles.silhouetteOverlay}>
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.8)']}
                  style={StyleSheet.absoluteFillObject}
                />
                <View style={styles.silhouetteTextWrap}>
                  <View style={styles.silhouetteBadge}>
                    <Ionicons name="scan" size={12} color="#FFF" style={{ marginRight: 4 }} />
                    <Text style={styles.silhouetteBadgeText}>SILHOUETTE SCAN IA</Text>
                  </View>
                  <Text style={styles.silhouetteTitle}>Votre silhouette analysée</Text>
                  <Text style={styles.silhouetteSub}>
                    Cette photo sert de base pour l'ajustement virtuel des tenues dans la cabine d'essayage.
                  </Text>
                </View>
              </View>
            </View>
          </Animated.View>
        )}

        {/* LOOKBOOK SECTION */}
        <Animated.View entering={FadeInDown.delay(200).duration(800).springify()} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Garde-robe Proposée</Text>
            <View style={styles.badge}><Text style={styles.badgeText}>3 LOOKS</Text></View>
          </View>
          <View style={styles.tabContainer}>
            {outfits.map((_: any, idx: number) => (
              <Pressable key={idx} onPress={() => setActiveOutfitIndex(idx)} style={[styles.tabBtn, activeOutfitIndex === idx && styles.tabBtnActive]}>
                <Text style={[styles.tabText, activeOutfitIndex === idx && styles.tabTextActive]}>Look {idx + 1}</Text>
              </Pressable>
            ))}
          </View>
          <Animated.View key={activeOutfitIndex} entering={FadeIn.duration(400)} style={styles.cardShadow}>
            <View style={styles.card}>
              <LinearGradient colors={['#111827', '#1F2937']} style={StyleSheet.absoluteFillObject} />
              <View style={styles.cardHeader}>
                <View style={styles.cardIconBox}><Feather name="layers" size={20} color="#FFF" /></View>
                <Text style={styles.cardTitle}>{activeOutfit?.title}</Text>
              </View>
              <View style={styles.piecesContainer}>
                {activeOutfit?.pieces?.map((piece: string, pIdx: number) => (
                  <View key={pIdx} style={styles.pieceRow}><View style={styles.pieceDot} /><Text style={styles.pieceText}>{piece}</Text></View>
                ))}
              </View>
            </View>
          </Animated.View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(210).duration(800).springify()} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Routine Maquillage</Text>
            <View style={[styles.badge, { backgroundColor: '#FEF3C7' }]}><Text style={[styles.badgeText, { color: '#92400E' }]}>MAKEUP</Text></View>
          </View>
          {(recommendation?.makeup || []).map((routine: any, idx: number) => (
            <View key={idx} style={styles.makeupCard}>
              <Text style={styles.makeupTitle}>{routine.title}</Text>
              {(routine.steps || []).map((step: string, stepIdx: number) => (
                <Text key={stepIdx} style={styles.makeupStep}>• {step}</Text>
              ))}
            </View>
          ))}
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(220).duration(800).springify()}>
          <MusicRecommendation
            userId={recommendation?.userId || null}
            moodResult={{
              moodPrincipal: recommendation?.detected_mood || 'calme',
              niveauEnergie: recommendation?.detected_mood === 'joyeux' || recommendation?.detected_mood === 'confiant' ? 'élevé' : 'faible',
              contexte: 'style_analysis',
            }}
            initialTracks={recommendation?.music || []}
            globalLoading={loading}
          />
        </Animated.View>

        {recommendation?.aiVoiceMessage && (
          <Animated.View entering={FadeInDown.delay(220).duration(800).springify()} style={styles.voiceCard}>
            <LinearGradient colors={['#F5F3FF', '#EDE9FE']} style={StyleSheet.absoluteFillObject} />
            <View style={styles.voiceHeader}>
              <Ionicons name="mic-circle" size={32} color="#8B5CF6" />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.voiceTitle}>Note Vocale du Styliste</Text>
                <Text style={styles.voiceText}>{recommendation.aiVoiceMessage}</Text>
              </View>
              <Pressable style={styles.voicePlayBtn} onPress={toggleSpeech}><Ionicons name={isSpeaking ? "pause" : "play"} size={20} color="#FFF" /></Pressable>
            </View>
          </Animated.View>
        )}

        <Animated.View entering={FadeInDown.delay(250).duration(800).springify()} style={styles.tryOnSection}>
          <Pressable style={styles.tryOnBtn} onPress={() => router.push({ pathname: '/fitting-room', params: { outfitIndex: activeOutfitIndex } })}>
            <LinearGradient colors={['#8B5CF6', '#EC4899']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.tryOnGradient}>
              <Ionicons name="shirt-outline" size={20} color="#FFF" style={{ marginRight: 8 }} />
              <Text style={styles.tryOnBtnText}>Essayer cette tenue dans la cabine 👗</Text>
            </LinearGradient>
          </Pressable>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(800).springify()} style={styles.feedbackSection}>
          <Text style={styles.feedbackTitle}>Pertinence globale de l'analyse</Text>
          <View style={styles.feedbackGrid}>
            <Pressable style={[styles.feedbackBtn, liked === true && styles.feedbackBtnActive]} onPress={() => setLiked(true)}>
              <Feather name="thumbs-up" size={20} color={liked === true ? '#8B5CF6' : '#9CA3AF'} />
              <Text style={[styles.feedbackText, liked === true && styles.feedbackTextActive]}>Parfait</Text>
            </Pressable>
            <Pressable style={[styles.feedbackBtn, liked === false && styles.feedbackBtnActive]} onPress={() => setLiked(false)}>
              <Feather name="thumbs-down" size={20} color={liked === false ? '#8B5CF6' : '#9CA3AF'} />
              <Text style={[styles.feedbackText, liked === false && styles.feedbackTextActive]}>À revoir</Text>
            </Pressable>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).duration(800).springify()}>
          <Pressable style={styles.doneBtn} onPress={() => router.replace('/(tabs)')}><Text style={styles.doneBtnText}>Terminer</Text></Pressable>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  loadingScreen: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { paddingHorizontal: 24 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 40 },
  closeBtn: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', elevation: 2 },
  headerCenter: { flex: 1, alignItems: 'center', paddingHorizontal: 16 },
  headerSubtitle: { fontSize: 10, fontWeight: '800', color: '#6B7280', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#111827', textTransform: 'capitalize' },
  favBtn: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', elevation: 2 },
  favBtnActive: { backgroundColor: '#F5F3FF' },
  section: { marginBottom: 36 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 20, fontWeight: '800', color: '#111827', letterSpacing: -0.5 },
  badge: { backgroundColor: '#F3F4F6', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 100 },
  badgeText: { fontSize: 10, fontWeight: '800', color: '#4B5563', letterSpacing: 1 },
  tabContainer: { flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.03)', borderRadius: 16, padding: 6, marginBottom: 24 },
  tabBtn: { flex: 1, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 12 },
  tabBtnActive: { backgroundColor: '#FFF', elevation: 2 },
  tabText: { fontSize: 14, fontWeight: '600', color: '#6B7280' },
  tabTextActive: { color: '#111827', fontWeight: '700' },
  cardShadow: { shadowColor: '#111827', shadowOffset: { width: 0, height: 24 }, shadowOpacity: 0.15, shadowRadius: 32, elevation: 8 },
  card: { borderRadius: 32, padding: 28, overflow: 'hidden' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 28 },
  cardIconBox: { width: 48, height: 48, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },
  cardTitle: { flex: 1, fontSize: 22, fontWeight: '800', color: '#FFF' },
  piecesContainer: { gap: 16, marginBottom: 28 },
  pieceRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  pieceDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#9CA3AF' },
  pieceText: { flex: 1, fontSize: 16, fontWeight: '500', color: '#F9FAFB' },
  makeupCard: {
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.72)',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    padding: 14,
    marginBottom: 10,
  },
  makeupTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  makeupStep: {
    fontSize: 13,
    color: '#4B5563',
    marginBottom: 4,
  },
  voiceText: {
    fontSize: 14,
    color: '#4C1D95',
    lineHeight: 20,
    fontWeight: '500',
  },
  voicePlayBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  silhouetteCardShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
    marginBottom: 24,
    borderRadius: 24,
    overflow: 'hidden',
  },
  silhouetteCard: {
    height: 220,
    borderRadius: 24,
    backgroundColor: '#FFF',
    position: 'relative',
    overflow: 'hidden',
  },
  silhouetteImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  silhouetteOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '60%',
    justifyContent: 'flex-end',
    padding: 20,
  },
  silhouetteTextWrap: {
    gap: 4,
  },
  silhouetteBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(139, 92, 246, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 4,
  },
  silhouetteBadgeText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  silhouetteTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
  },
  silhouetteSub: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
    lineHeight: 15,
  },
  voiceCard: { borderRadius: 24, overflow: 'hidden', marginBottom: 20, borderWidth: 1, borderColor: '#EDE9FE', padding: 20 },
  voiceHeader: { flexDirection: 'row', alignItems: 'center' },
  voiceTitle: { fontSize: 11, fontWeight: '800', color: '#8B5CF6', letterSpacing: 1 },
  tryOnSection: { marginTop: 10, marginBottom: 30 },
  tryOnBtn: { borderRadius: 20, overflow: 'hidden', elevation: 5 },
  tryOnGradient: { height: 60, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  tryOnBtnText: { fontSize: 15, fontWeight: '700', color: '#FFF' },
  feedbackSection: { marginBottom: 40, alignItems: 'center' },
  feedbackTitle: { fontSize: 13, fontWeight: '600', color: '#6B7280', marginBottom: 16 },
  feedbackGrid: { flexDirection: 'row', gap: 16 },
  feedbackBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 14, paddingHorizontal: 24, borderRadius: 100, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E5E7EB' },
  feedbackBtnActive: { borderColor: '#8B5CF6', borderWidth: 2, backgroundColor: '#F5F3FF' },
  feedbackText: { fontSize: 15, fontWeight: '600', color: '#9CA3AF' },
  feedbackTextActive: { color: '#8B5CF6' },
  doneBtn: { height: 60, backgroundColor: '#111827', borderRadius: 20, justifyContent: 'center', alignItems: 'center', elevation: 6 },
  doneBtnText: { fontSize: 17, fontWeight: '700', color: '#FFF' },
});
