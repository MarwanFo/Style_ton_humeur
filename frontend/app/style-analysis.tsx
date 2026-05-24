import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, Pressable, ActivityIndicator, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons, Feather } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp, FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

const { width } = Dimensions.get('window');

export default function StyleAnalysisScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const [recommendation, setRecommendation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState<boolean | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [activeOutfitIndex, setActiveOutfitIndex] = useState(0);

  useEffect(() => {
    const loadRecommendationData = async () => {
      try {
        const recoStr = await AsyncStorage.getItem('latestRecommendation');
        if (recoStr) {
          const parsed = JSON.parse(recoStr);
          setRecommendation(parsed);

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
  }, []);

  const toggleFavorite = async () => {
    if (!recommendation) return;
    try {
      const favsStr = await AsyncStorage.getItem('savedRecommendations');
      let favs = favsStr ? JSON.parse(favsStr) : [];
      
      const isExist = favs.some((f: any) => 
        f.style_keywords?.join() === recommendation.style_keywords?.join()
      );

      if (isExist) {
        // Remove it
        favs = favs.filter((f: any) => 
          f.style_keywords?.join() !== recommendation.style_keywords?.join()
        );
        setIsFavorited(false);
        Alert.alert('Favoris', 'Analyse retirée de vos favoris.');
      } else {
        // Get the latest check-in data to capture its Cloudinary image URL if present
        const latestCheckinStr = await AsyncStorage.getItem('latestCheckin');
        let checkinData: any = null;
        if (latestCheckinStr) {
          checkinData = JSON.parse(latestCheckinStr);
        }

        // Add it
        favs.push({
          ...recommendation,
          imageUrl: checkinData?.imageUrl || recommendation.imageUrl || null,
          savedAt: new Date().toISOString()
        });
        setIsFavorited(true);
        Alert.alert('Favoris', 'Analyse enregistrée dans vos favoris !');
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

  // Fallback structures if backend returned empty
  const outfits = recommendation?.outfits || [
    { title: 'Élégance Discrète', pieces: ['Pull en cachemire noir', 'Pantalon tailleur droit', 'Mocassins en cuir brillant'], justification: 'Une tenue minimaliste qui met en valeur votre morphologie avec subtilité.' },
    { title: 'Urbain Contemporain', pieces: ['Surchemise beige', 'T-shirt blanc texturé', 'Jean brut coupe droite', 'Baskets minimalistes'], justification: 'Idéal pour naviguer en ville avec style et confort.' },
    { title: 'Nocturne Sophistiqué', pieces: ['Blazer structuré sombre', 'Chemise col mao', 'Pantalon ajusté noir', 'Bottines chelsea'], justification: 'Une allure puissante pour vos soirées mondaines.' }
  ];

  const activeOutfit = outfits[activeOutfitIndex];
  const styleKeywords = recommendation?.style_keywords?.join(', ') || 'Avant-Garde';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Absolute Ambient Background */}
      <View style={StyleSheet.absoluteFill}>
        <LinearGradient colors={['#F9FAFB', '#F3F4F6']} style={StyleSheet.absoluteFillObject} />
        <View style={styles.ambientBlob1} />
        <View style={styles.ambientBlob2} />
        <BlurView intensity={90} tint="light" style={StyleSheet.absoluteFillObject} />
      </View>

      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 60 }]} showsVerticalScrollIndicator={false}>
        
        {/* HEADER */}
        <Animated.View entering={FadeInUp.duration(800).springify()} style={styles.header}>
          <Pressable style={styles.closeBtn} onPress={() => router.replace('/(tabs)')}>
            <Feather name="arrow-left" size={24} color="#111827" />
          </Pressable>
          <View style={styles.headerCenter}>
            <Text style={styles.headerSubtitle}>RAPPORT INTELLIGENT</Text>
            <Text numberOfLines={1} style={styles.headerTitle}>{styleKeywords}</Text>
          </View>
          <Pressable 
            style={[styles.favBtn, isFavorited && styles.favBtnActive]}
            onPress={toggleFavorite}
          >
            <Ionicons name={isFavorited ? "bookmark" : "bookmark-outline"} size={22} color={isFavorited ? "#8B5CF6" : "#6B7280"} />
          </Pressable>
        </Animated.View>

        {/* LOOKBOOK SECTION */}
        <Animated.View entering={FadeInDown.delay(200).duration(800).springify()} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Garde-robe Proposée</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>3 LOOKS</Text>
            </View>
          </View>

          {/* Elegant Tab Selector */}
          <View style={styles.tabContainer}>
            {outfits.map((_: any, idx: number) => {
              const isActive = activeOutfitIndex === idx;
              return (
                <Pressable 
                  key={idx} 
                  onPress={() => setActiveOutfitIndex(idx)}
                  style={[styles.tabBtn, isActive && styles.tabBtnActive]}
                >
                  <Text style={[styles.tabText, isActive && styles.tabTextActive]}>Look {idx + 1}</Text>
                </Pressable>
              );
            })}
          </View>

          {/* OUTFIT CARD (Deep Luxury Black) */}
          <Animated.View key={activeOutfitIndex} entering={FadeIn.duration(400)} style={styles.cardShadow}>
            <View style={styles.card}>
              <LinearGradient colors={['#111827', '#1F2937']} style={StyleSheet.absoluteFillObject} />
              
              <View style={styles.cardHeader}>
                <View style={styles.cardIconBox}>
                  <Feather name="layers" size={20} color="#FFF" />
                </View>
                <Text style={styles.cardTitle}>{activeOutfit?.title || `Tenue ${activeOutfitIndex + 1}`}</Text>
              </View>
              
              <View style={styles.piecesContainer}>
                {activeOutfit?.pieces?.map((piece: string, pIdx: number) => (
                  <View key={pIdx} style={styles.pieceRow}>
                    <View style={styles.pieceDot} />
                    <Text style={styles.pieceText}>{piece}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.divider} />

              <View style={styles.justificationBox}>
                <Text style={styles.justificationLabel}>VISION DE L'IA</Text>
                <Text style={styles.justificationText}>{activeOutfit?.justification}</Text>
              </View>
            </View>
          </Animated.View>
        </Animated.View>

         {/* TRY ON FITTING ROOM BUTTON */}
         <Animated.View entering={FadeInDown.delay(250).duration(800).springify()} style={styles.tryOnSection}>
           <Pressable 
             style={styles.tryOnBtn} 
             onPress={() => router.push({ pathname: '/fitting-room', params: { outfitIndex: activeOutfitIndex } })}
           >
             <LinearGradient 
               colors={['#8B5CF6', '#EC4899']} 
               start={{ x: 0, y: 0 }} 
               end={{ x: 1, y: 1 }} 
               style={styles.tryOnGradient}
             >
               <Ionicons name="shirt-outline" size={20} color="#FFF" style={{ marginRight: 8 }} />
               <Text style={styles.tryOnBtnText}>Essayer cette tenue dans la cabine 👗</Text>
             </LinearGradient>
           </Pressable>
         </Animated.View>

         {/* FEEDBACK MODULE */}
        <Animated.View entering={FadeInDown.delay(300).duration(800).springify()} style={styles.feedbackSection}>
          <Text style={styles.feedbackTitle}>Pertinence de l'analyse</Text>
          <View style={styles.feedbackGrid}>
            <Pressable 
              style={[styles.feedbackBtn, liked === true && styles.feedbackBtnActive]}
              onPress={() => setLiked(true)}
            >
              <Feather name="thumbs-up" size={20} color={liked === true ? '#8B5CF6' : '#9CA3AF'} />
              <Text style={[styles.feedbackText, liked === true && styles.feedbackTextActive]}>Parfait</Text>
            </Pressable>
            <Pressable 
              style={[styles.feedbackBtn, liked === false && styles.feedbackBtnActive]}
              onPress={() => setLiked(false)}
            >
              <Feather name="thumbs-down" size={20} color={liked === false ? '#8B5CF6' : '#9CA3AF'} />
              <Text style={[styles.feedbackText, liked === false && styles.feedbackTextActive]}>À revoir</Text>
            </Pressable>
          </View>
        </Animated.View>

        {/* REDIRECTION */}
        <Animated.View entering={FadeInDown.delay(400).duration(800).springify()}>
          <Pressable style={styles.doneBtn} onPress={() => router.replace('/(tabs)')}>
            <Text style={styles.doneBtnText}>Terminer</Text>
          </Pressable>
        </Animated.View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  loadingScreen: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ambientBlob1: {
    position: 'absolute',
    top: -150,
    right: -100,
    width: 350,
    height: 350,
    backgroundColor: '#E0E7FF',
    borderRadius: 200,
  },
  ambientBlob2: {
    position: 'absolute',
    bottom: 0,
    left: -150,
    width: 400,
    height: 400,
    backgroundColor: '#F3E8FF',
    borderRadius: 200,
  },
  scrollContent: {
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  closeBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  headerSubtitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#6B7280',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    textTransform: 'capitalize',
  },
  favBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  favBtnActive: {
    backgroundColor: '#F5F3FF',
  },
  section: {
    marginBottom: 40,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.5,
  },
  badge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#4B5563',
    letterSpacing: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: 16,
    padding: 6,
    marginBottom: 24,
  },
  tabBtn: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  tabBtnActive: {
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  tabTextActive: {
    color: '#111827',
    fontWeight: '700',
  },
  cardShadow: {
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.15,
    shadowRadius: 32,
    elevation: 8,
  },
  card: {
    borderRadius: 32,
    padding: 28,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 28,
  },
  cardIconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  cardTitle: {
    flex: 1,
    fontSize: 22,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: -0.5,
  },
  piecesContainer: {
    gap: 16,
    marginBottom: 28,
  },
  pieceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  pieceDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#9CA3AF',
  },
  pieceText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#F9FAFB',
    lineHeight: 22,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginBottom: 24,
  },
  justificationBox: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  justificationLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#9CA3AF',
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  justificationText: {
    fontSize: 14,
    color: '#D1D5DB',
    lineHeight: 22,
    fontWeight: '400',
  },
  feedbackSection: {
    marginBottom: 40,
    alignItems: 'center',
  },
  feedbackTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 16,
  },
  feedbackGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  feedbackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 100,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
  },
  feedbackBtnActive: {
    borderColor: '#8B5CF6',
    borderWidth: 2,
    backgroundColor: '#F5F3FF',
  },
  feedbackText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  feedbackTextActive: {
    color: '#8B5CF6',
  },
  doneBtn: {
    height: 60,
    backgroundColor: '#111827',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 6,
  },
  doneBtnText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFF',
  },
  tryOnSection: {
    marginTop: 10,
    marginBottom: 30,
  },
  tryOnBtn: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 5,
  },
  tryOnGradient: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  tryOnBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFF',
  },
});
