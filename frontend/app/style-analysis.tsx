import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Pressable, 
  Dimensions, 
  Image, 
  ActivityIndicator,
  Alert 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons, Feather, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function StyleAnalysisScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const [recommendation, setRecommendation] = useState<any>(null);
  const [checkin, setCheckin] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState<boolean | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [activeOutfitIndex, setActiveOutfitIndex] = useState(0);

  useEffect(() => {
    const loadRecommendationData = async () => {
      try {
        const recoStr = await AsyncStorage.getItem('latestRecommendation');
        const checkinStr = await AsyncStorage.getItem('latestCheckin');
        
        if (recoStr) setRecommendation(JSON.parse(recoStr));
        if (checkinStr) setCheckin(JSON.parse(checkinStr));
      } catch (err) {
        Alert.alert('Erreur', 'Impossible de charger votre analyse de style.');
      } finally {
        setLoading(false);
      }
    };
    loadRecommendationData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#7F00FF" />
      </View>
    );
  }

  // Fallback structures if backend returned empty or structured differently
  const outfits = recommendation?.outfits || [
    { title: 'Morning Comfort', pieces: ['Pull en maille beige', 'Pantalon large blanc', 'Baskets blanches minimalistes'], justification: 'Un look ultra cosy pour démarrer la journée en douceur.' },
    { title: 'Chic Professionnel', pieces: ['Blazer ajusté taupe', 'Jean brut droit', 'Mocassins en cuir marron', 'Sac cabas crème'], justification: 'Parfait pour allier élégance et efficacité au travail.' },
    { title: 'Evening Vibe', pieces: ['Robe en soie noire', 'Veste en cuir fine', 'Escarpins en velours', 'Pochette dorée'], justification: 'Idéal pour votre sortie chic en fin de journée.' }
  ];

  const activeOutfit = outfits[activeOutfitIndex];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FFF8F8', '#F6F6FF', '#EFF9F9']}
        style={StyleSheet.absoluteFillObject}
      />

      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 40 }]} showsVerticalScrollIndicator={false}>
        
        {/* HEADER SECTION */}
        <Animated.View entering={FadeInUp.duration(600).springify()} style={styles.header}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text style={styles.headerSubtitle}>VOTRE RAPPORT DE STYLE IA</Text>
            <Text numberOfLines={1} style={styles.headerTitle}>Style : <Text style={styles.moodHighlight}>{recommendation?.style_keywords?.join(', ') || 'Personnalisé'} ✨</Text></Text>
          </View>
          <Pressable style={styles.closeBtn} onPress={() => router.replace('/(tabs)')}>
            <Ionicons name="close" size={24} color="#1E1E2C" />
          </Pressable>
        </Animated.View>

        {/* 1. OUTFIT SWIPEABLE DISPLAY (Pastel Gradient Backgrounds) */}
        <Animated.View entering={FadeInDown.delay(100).duration(800).springify()} style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Suggestions de Tenues</Text>
            <Text style={styles.badgeText}>3 LOOKS</Text>
          </View>

          {/* Tab Selector for outfits */}
          <View style={styles.outfitTabs}>
            {outfits.map((out: any, idx: number) => (
              <Pressable 
                key={idx} 
                onPress={() => setActiveOutfitIndex(idx)}
                style={[styles.outfitTabBtn, activeOutfitIndex === idx && styles.outfitTabBtnActive]}
              >
                <Text style={[styles.outfitTabText, activeOutfitIndex === idx && styles.outfitTabTextActive]}>
                  Look {idx + 1}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Main Outfit Card */}
          <View style={styles.outfitCardShadow}>
            <BlurView intensity={70} tint="light" style={styles.outfitCard}>
              <LinearGradient
                colors={['rgba(127, 0, 255, 0.04)', 'rgba(225, 0, 255, 0.04)']}
                style={StyleSheet.absoluteFillObject}
              />
              <View style={styles.outfitCardHeader}>
                <Ionicons name="shirt-outline" size={20} color="#7F00FF" />
                <Text style={styles.outfitCardTitle}>{activeOutfit?.title || `Proposition ${activeOutfitIndex + 1}`}</Text>
              </View>
              
              <View style={styles.piecesList}>
                {activeOutfit?.pieces?.map((piece: string, pIdx: number) => (
                  <View key={pIdx} style={styles.pieceRow}>
                    <View style={styles.bulletDot} />
                    <Text style={styles.pieceText}>{piece}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.justificationBox}>
                <Text style={styles.justificationLabel}>POURQUOI CE LOOK ?</Text>
                <Text style={styles.justificationText}>{activeOutfit?.justification || 'Adapté à vos proportions et origine.'}</Text>
              </View>
            </BlurView>
          </View>
        </Animated.View>

        {/* 4. ACTIONS & FEEDBACK WIDGET */}
        <Animated.View entering={FadeInDown.delay(200).duration(800).springify()} style={styles.feedbackSection}>
          
          {/* Favorite button */}
          <Pressable 
            onPress={() => setIsFavorited(!isFavorited)}
            style={[styles.favBtn, isFavorited && styles.favBtnActive]}
          >
            <Ionicons name={isFavorited ? "heart" : "heart-outline"} size={22} color={isFavorited ? "#FFF" : "#7F00FF"} />
            <Text style={[styles.favText, isFavorited && styles.favTextActive]}>
              {isFavorited ? 'Sauvegardé !' : 'Enregistrer dans mes favoris'}
            </Text>
          </Pressable>

          {/* Rating prompt */}
          <View style={styles.ratingBox}>
            <Text style={styles.ratingTitle}>Cette suggestion vous plaît-elle ?</Text>
            <View style={styles.ratingButtons}>
              <Pressable 
                onPress={() => setLiked(true)}
                style={[styles.ratingBtn, liked === true && styles.ratingBtnActiveLike]}
              >
                <Ionicons name="thumbs-up" size={20} color={liked === true ? '#FFF' : '#8A8A9E'} />
                <Text style={[styles.ratingBtnText, liked === true && styles.ratingBtnTextActive]}>Top</Text>
              </Pressable>
              <Pressable 
                onPress={() => setLiked(false)}
                style={[styles.ratingBtn, liked === false && styles.ratingBtnActiveDislike]}
              >
                <Ionicons name="thumbs-down" size={20} color={liked === false ? '#FFF' : '#8A8A9E'} />
                <Text style={[styles.ratingBtnText, liked === false && styles.ratingBtnTextActive]}>Flop</Text>
              </Pressable>
            </View>
          </View>

        </Animated.View>

        {/* FINAL REDIRECTION ACTION */}
        <Animated.View entering={FadeInDown.delay(300).duration(800).springify()}>
          <Pressable style={styles.doneBtn} onPress={() => router.replace('/(tabs)')}>
            <LinearGradient
              colors={['#7F00FF', '#E100FF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.doneGradient}
            >
              <Text style={styles.doneText}>Retour au Tableau de Bord</Text>
            </LinearGradient>
          </Pressable>
        </Animated.View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFCFF',
  },
  loadingScreen: {
    flex: 1,
    backgroundColor: '#FAFCFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 22,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  headerSubtitle: {
    fontSize: 10,
    fontWeight: '900',
    color: '#8A8A9E',
    letterSpacing: 2,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '300',
    color: '#1E1E2C',
  },
  moodHighlight: {
    fontWeight: '800',
  },
  closeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  sectionContainer: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E1E2C',
    marginBottom: 14,
    letterSpacing: -0.3,
  },
  badgeText: {
    backgroundColor: 'rgba(127,0,255,0.06)',
    color: '#7F00FF',
    fontSize: 9,
    fontWeight: '900',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    letterSpacing: 1,
  },
  // Outfit Swipe Tab System
  outfitTabs: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  outfitTabBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  outfitTabBtnActive: {
    backgroundColor: '#7F00FF',
  },
  outfitTabText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8A8A9E',
  },
  outfitTabTextActive: {
    color: '#FFF',
  },
  // Outfit details card
  outfitCardShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.04,
    shadowRadius: 15,
    elevation: 4,
  },
  outfitCard: {
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.45)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
    padding: 20,
  },
  outfitCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 18,
  },
  outfitCardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E1E2C',
  },
  piecesList: {
    gap: 12,
    marginBottom: 20,
  },
  pieceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#7F00FF',
  },
  pieceText: {
    fontSize: 14,
    color: '#3C3C4E',
    fontWeight: '600',
  },
  justificationBox: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    paddingTop: 16,
  },
  justificationLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: '#8A8A9E',
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  justificationText: {
    fontSize: 13,
    color: '#6A6A7A',
    lineHeight: 18,
    fontWeight: '500',
    fontStyle: 'italic',
  },
  // Makeup styling
  makeupRow: {
    flexDirection: 'row',
    gap: 12,
  },
  makeupCardShadow: {
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 3,
  },
  makeupCard: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
    padding: 14,
    height: 170,
  },
  makeupType: {
    fontSize: 9,
    fontWeight: '900',
    color: '#E100FF',
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  makeupTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E1E2C',
    marginBottom: 10,
  },
  makeupSteps: {
    gap: 4,
  },
  makeupStepText: {
    fontSize: 11,
    color: '#6A6A7A',
    fontWeight: '500',
  },
  // Playlist Spotify style
  playlistBox: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.04,
    shadowRadius: 15,
  },
  playlistCard: {
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
    padding: 18,
  },
  playlistHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  playlistTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E1E2C',
  },
  trackList: {
    gap: 12,
  },
  trackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  trackIndexBox: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trackIndexText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8A8A9E',
  },
  trackMeta: {
    flex: 1,
    marginLeft: 8,
  },
  trackName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E1E2C',
    marginBottom: 2,
  },
  trackArtist: {
    fontSize: 10,
    color: '#8A8A9E',
  },
  trackPlayBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#1DB954',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Feedback
  feedbackSection: {
    marginTop: 10,
    marginBottom: 30,
    gap: 20,
  },
  favBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#FFF',
    borderRadius: 16,
    height: 56,
    borderWidth: 1,
    borderColor: '#7F00FF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
  },
  favBtnActive: {
    backgroundColor: '#7F00FF',
    borderColor: '#7F00FF',
  },
  favText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#7F00FF',
  },
  favTextActive: {
    color: '#FFF',
  },
  ratingBox: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
    padding: 16,
    alignItems: 'center',
    gap: 12,
  },
  ratingTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E1E2C',
  },
  ratingButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  ratingBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFF',
    borderRadius: 12,
    height: 46,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
  },
  ratingBtnActiveLike: {
    backgroundColor: '#2ECC71',
    borderColor: '#2ECC71',
  },
  ratingBtnActiveDislike: {
    backgroundColor: '#E74C3C',
    borderColor: '#E74C3C',
  },
  ratingBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#8A8A9E',
  },
  ratingBtnTextActive: {
    color: '#FFF',
  },
  // Done button
  doneBtn: {
    shadowColor: '#7F00FF',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
  },
  doneGradient: {
    borderRadius: 18,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  doneText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
