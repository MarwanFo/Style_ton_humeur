import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable, ActivityIndicator, Image, StatusBar, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons, Feather } from '@expo/vector-icons';
import Animated, { 
  FadeInDown, 
  FadeInUp, 
  FadeIn, 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withRepeat, 
  Easing,
  runOnJS
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { API_URL } from '@/constants/Api';

const { width, height } = Dimensions.get('window');

export default function FittingRoomScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  
  // States
  const [recommendation, setRecommendation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [outfitIndex, setOutfitIndex] = useState(0);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  
  // Try on interaction states
  const [equippedItems, setEquippedItems] = useState<boolean[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanCompleted, setScanCompleted] = useState(false);
  const [compatibilityScore, setCompatibilityScore] = useState(90);

  // Animation values
  const scanPosition = useSharedValue(-20);
  const laserOpacity = useSharedValue(0);

  const saveFittingRoomState = async (
    equipped: boolean[],
    img: string | null,
    score: number,
    completed: boolean,
    recoId: number | string,
    idx: number
  ) => {
    try {
      const stateKey = `fitting_room_state_${recoId}_${idx}`;
      await AsyncStorage.setItem(stateKey, JSON.stringify({
        equippedItems: equipped,
        imageUrl: img,
        compatibilityScore: score,
        scanCompleted: completed
      }));
    } catch (e) {
      console.log('Error saving fitting room state:', e);
    }
  };

  useEffect(() => {
    const initData = async () => {
      try {
        let activeIdx = 0;
        if (params.outfitIndex) {
          activeIdx = parseInt(params.outfitIndex as string, 10);
          setOutfitIndex(activeIdx);
        }

        const recoStr = await AsyncStorage.getItem('latestRecommendation');
        if (recoStr) {
          const parsed = JSON.parse(recoStr);
          setRecommendation(parsed);

          // Check if there is a saved state for this specific fitting room combination
          const stateKey = `fitting_room_state_${parsed.id}_${activeIdx}`;
          const savedStateStr = await AsyncStorage.getItem(stateKey);

          if (savedStateStr) {
            const savedState = JSON.parse(savedStateStr);
            setEquippedItems(savedState.equippedItems || []);
            setImageUrl(savedState.imageUrl || null);
            setCompatibilityScore(savedState.compatibilityScore || 90);
            setScanCompleted(savedState.scanCompleted || false);
          } else {
            // Get image URL if visual check-in
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
                }
              }
            }

            // Fetch outfit details
            const outfits = parsed.outfits || [];
            const activeOutfit = outfits[activeIdx];
            if (activeOutfit && activeOutfit.pieces) {
              // Equip all by default
              setEquippedItems(new Array(activeOutfit.pieces.length).fill(true));
            }
          }
        }
      } catch (err) {
        Alert.alert('Erreur', 'Impossible de charger les données pour l\'essayage.');
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, [params.outfitIndex]);

  const toggleEquip = (idx: number) => {
    if (isScanning) return;
    const next = [...equippedItems];
    next[idx] = !next[idx];
    setEquippedItems(next);
    // Reset scan if user changes items
    setScanCompleted(false);

    if (recommendation) {
      saveFittingRoomState(next, imageUrl, compatibilityScore, false, recommendation.id, outfitIndex);
    }
  };

  const startFittingScan = async () => {
    if (isScanning) return;
    
    // Calculate custom score based on equipped items ratio
    const equippedCount = equippedItems.filter(Boolean).length;
    if (equippedCount === 0) {
      Alert.alert("Oups", "Veuillez enfiler au moins un vêtement pour lancer l'essayage.");
      return;
    }

    setIsScanning(true);
    setScanCompleted(false);
    laserOpacity.value = withTiming(1, { duration: 200 });
    
    // Laser sweep animation looping infinitely
    scanPosition.value = -20;
    scanPosition.value = withRepeat(
      withTiming(260, { duration: 1200, easing: Easing.bezier(0.42, 0, 0.58, 1) }),
      -1,
      true
    );

    let finalImgUrl = imageUrl;

    try {
      const token = await AsyncStorage.getItem('token');
      // If we don't have a scanned image (e.g. from the questionnaire), use a default model silhouette
      const humanImg = imageUrl || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80";
      
      // Select garment item image (different images depending on active outfit style)
      // Flat-lay product shots on clean background work 1000% better for IDM-VTON try-on
      let garmentImageUrl = "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80"; // default cool leather jacket flat-lay
      const combinedText = ((activeOutfit.title || "") + " " + (activeOutfit.pieces || []).join(" ")).toLowerCase();
      
      if (combinedText.includes('hoodie') || combinedText.includes('sweat') || combinedText.includes('capuche')) {
        garmentImageUrl = "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80"; // Clean black hoodie flat-lay
      } else if (combinedText.includes('sport') || combinedText.includes('t-shirt') || combinedText.includes('chemise') || combinedText.includes('haut')) {
        garmentImageUrl = "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&q=80"; // Clean white t-shirt flat-lay
      } else if (combinedText.includes('chic') || combinedText.includes('élégant') || combinedText.includes('costume') || combinedText.includes('blazer') || combinedText.includes('veste')) {
        garmentImageUrl = "https://images.unsplash.com/photo-1598808503746-f34c53b9323e?w=600&q=80"; // Clean dark blue blazer flat-lay
      } else if (combinedText.includes('jean') || combinedText.includes('denim') || combinedText.includes('pantalon')) {
        garmentImageUrl = "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&q=80"; // Clean denim jacket flat-lay
      }

      const response = await fetch(`${API_URL}/checkins/virtual-try-on`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          humanImageUrl: humanImg,
          garmentImageUrl: garmentImageUrl
        })
      });

      const resData = await response.json();
      if (response.ok && resData.success && resData.tryOnUrl) {
        setImageUrl(resData.tryOnUrl);
        finalImgUrl = resData.tryOnUrl;
      } else {
        Alert.alert('Mode Simulé', "L'IA VTON a échoué (limite d'API ou format). Affichage de la simulation.");
      }
    } catch (err) {
      console.log('VTON fetch error:', err);
      Alert.alert('Mode Simulé', "L'IA VTON n'a pas pu être contactée. Affichage de la simulation.");
    } finally {
      finishScan(equippedCount, finalImgUrl);
    }
  };

  const finishScan = (equippedCount: number, finalImgUrl: string | null) => {
    setIsScanning(false);
    setScanCompleted(true);
    laserOpacity.value = withTiming(0, { duration: 300 });
    scanPosition.value = withTiming(-20, { duration: 300 });

    // Calculate score
    const baseScore = 88 + Math.floor(Math.random() * 8); // 88 to 95
    const finalScore = Math.floor(baseScore * (equippedCount / equippedItems.length));
    setCompatibilityScore(finalScore);

    if (recommendation) {
      saveFittingRoomState(equippedItems, finalImgUrl, finalScore, true, recommendation.id, outfitIndex);
    }
  };

  // Animated style for laser scan bar
  const laserStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: scanPosition.value }],
      opacity: laserOpacity.value
    };
  });

  if (loading) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#8B5CF6" />
      </View>
    );
  }

  const outfits = recommendation?.outfits || [];
  const activeOutfit = outfits[outfitIndex] || {
    title: 'Tenue Standard',
    pieces: ['Vêtement suggéré 1', 'Vêtement suggéré 2', 'Vêtement suggéré 3'],
    justification: 'Une combinaison de base élégante et moderne.'
  };

  const getStyleGrade = (score: number) => {
    if (score >= 95) return 'A+';
    if (score >= 90) return 'A';
    if (score >= 80) return 'B+';
    if (score >= 70) return 'B';
    return 'C';
  };

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return '#10B981'; // Green
    if (grade.startsWith('B')) return '#F59E0B'; // Orange
    return '#EF4444'; // Red
  };

  const handleSaveFittingLook = async () => {
    if (!recommendation) return;
    try {
      const favsStr = await AsyncStorage.getItem('savedRecommendations');
      let favs = favsStr ? JSON.parse(favsStr) : [];

      const title = `${activeOutfit.title} (${compatibilityScore}%)`;

      const isExist = favs.some((f: any) => 
        f.id === recommendation.id && f.isFittingRoomLook && f.fittingScore === compatibilityScore
      );

      if (isExist) {
        Alert.alert("Déjà enregistré", "Cette tenue a déjà été enregistrée dans vos favoris.");
        return;
      }

      const newFav = {
        ...recommendation,
        style_keywords: [title, ...(recommendation.style_keywords || [])],
        imageUrl: imageUrl,
        savedAt: new Date().toISOString(),
        isFittingRoomLook: true,
        fittingScore: compatibilityScore
      };

      favs.push(newFav);
      await AsyncStorage.setItem('savedRecommendations', JSON.stringify(favs));
      Alert.alert("Enregistré !", "Ce look cabine complet a été sauvegardé dans vos favoris.");
    } catch (err) {
      Alert.alert("Erreur", "Impossible de sauvegarder ce look.");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Dark Studio Background */}
      <LinearGradient colors={['#0F172A', '#020617']} style={StyleSheet.absoluteFillObject} />

      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 40 }]} showsVerticalScrollIndicator={false}>
        
        {/* HEADER */}
        <Animated.View entering={FadeInUp.duration(600).springify()} style={styles.header}>
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <Feather name="arrow-left" size={24} color="#FFF" />
          </Pressable>
          <View style={styles.headerCenter}>
            <Text style={styles.headerSubtitle}>ESSAYAGE VIRTUEL</Text>
            <Text style={styles.headerTitle}>Fitting Room</Text>
          </View>
          <View style={styles.placeholderBtn} />
        </Animated.View>

        {/* FITTING ROOM MIRROR & VISUALIZATION */}
        <Animated.View entering={FadeInDown.delay(100).duration(800).springify()} style={styles.mirrorCard}>
          <BlurView intensity={25} tint="dark" style={StyleSheet.absoluteFillObject} />
          <View style={styles.mirrorContainer}>
            
            {imageUrl ? (
              // If user scanned camera photo, show their photo
              <Image source={{ uri: imageUrl }} style={styles.userPhoto} resizeMode="cover" />
            ) : (
              // Otherwise show high-end fashion vector/illustration placeholder
              <View style={styles.avatarSilhouetteContainer}>
                <Ionicons name="body-outline" size={130} color="rgba(255,255,255,0.15)" />
                <Text style={styles.avatarLabel}>Silhouette Standard</Text>
              </View>
            )}

            {/* Glowing Equipped Indicators */}
            {equippedItems.map((isEquipped, idx) => {
              if (!isEquipped) return null;
              
              // Define different positions depending on index
              const positions = [
                { top: '25%', left: '48%' }, // Head/Top area
                { top: '50%', left: '48%' }, // Pants/Bottom area
                { top: '80%', left: '48%' }, // Shoes area
                { top: '38%', left: '62%' }, // Accessories area
              ] as const;
              const pos = positions[idx % positions.length];
              
              return (
                <Animated.View 
                  key={idx}
                  entering={FadeIn.duration(300)}
                  style={[styles.glowDot, pos]}
                />
              );
            })}

            {/* Glowing Laser Scan Bar */}
            <Animated.View style={[styles.laserBar, laserStyle]}>
              <LinearGradient 
                colors={['transparent', 'rgba(139, 92, 246, 0.8)', 'transparent']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={StyleSheet.absoluteFillObject}
              />
            </Animated.View>

          </View>

          {/* Look Details Footer in Mirror */}
          <View style={styles.mirrorFooter}>
            <Text style={styles.mirrorOutfitTitle}>{activeOutfit.title}</Text>
            <Text style={styles.mirrorOutfitSubtitle}>
              {equippedItems.filter(Boolean).length} / {equippedItems.length} vêtements portés
            </Text>
          </View>
        </Animated.View>

        {/* CLOTHES CONTROLLER (EQUIP/UNEQUIP) */}
        <Animated.View entering={FadeInDown.delay(200).duration(800).springify()} style={styles.wardrobeSection}>
          <Text style={styles.sectionTitle}>Votre Penderie d'Humeur</Text>
          <Text style={styles.sectionSubtitle}>Sélectionnez les pièces à enfiler pour l'essayage :</Text>

          <View style={styles.itemsGrid}>
            {activeOutfit.pieces?.map((piece: string, idx: number) => {
              const isEquipped = equippedItems[idx];
              // Choose icons based on typical keyword matching
              let iconName = 'shirt-outline';
              if (piece.toLowerCase().includes('jean') || piece.toLowerCase().includes('pantalon') || piece.toLowerCase().includes('jogging') || piece.toLowerCase().includes('legging')) {
                iconName = 'accessibility-outline';
              } else if (piece.toLowerCase().includes('basket') || piece.toLowerCase().includes('sneaker') || piece.toLowerCase().includes('chaussure') || piece.toLowerCase().includes('bottine') || piece.toLowerCase().includes('mocassin')) {
                iconName = 'footsteps-outline';
              } else if (piece.toLowerCase().includes('montre') || piece.toLowerCase().includes('lunette') || piece.toLowerCase().includes('casquette') || piece.toLowerCase().includes('sac') || piece.toLowerCase().includes('gourde') || piece.toLowerCase().includes('ceinture')) {
                iconName = 'watch-outline';
              }

              return (
                <Pressable 
                  key={idx}
                  onPress={() => toggleEquip(idx)}
                  style={[styles.itemCard, isEquipped && styles.itemCardEquipped]}
                >
                  <View style={[styles.itemIconContainer, isEquipped && styles.itemIconContainerEquipped]}>
                    <Ionicons 
                      name={iconName as any} 
                      size={20} 
                      color={isEquipped ? '#FFF' : '#94A3B8'} 
                    />
                  </View>
                  <View style={styles.itemTextContainer}>
                    <Text numberOfLines={2} style={[styles.itemText, isEquipped && styles.itemTextEquipped]}>
                      {piece}
                    </Text>
                  </View>
                  <Ionicons 
                    name={isEquipped ? "checkmark-circle" : "ellipse-outline"} 
                    size={20} 
                    color={isEquipped ? '#10B981' : '#475569'} 
                  />
                </Pressable>
              );
            })}
          </View>
        </Animated.View>

        {/* SCAN / TRY BUTTON */}
        <Animated.View entering={FadeInDown.delay(300).duration(800).springify()} style={styles.actionContainer}>
          <Pressable 
            style={[styles.scanBtn, isScanning && styles.scanBtnDisabled]} 
            onPress={startFittingScan}
            disabled={isScanning}
          >
            {isScanning ? (
              <View style={styles.row}>
                <ActivityIndicator size="small" color="#FFF" style={{ marginRight: 10 }} />
                <Text style={styles.scanBtnText}>Analyse en cours...</Text>
              </View>
            ) : (
              <View style={styles.row}>
                <Ionicons name="sparkles" size={20} color="#FFF" style={{ marginRight: 8 }} />
                <Text style={styles.scanBtnText}>Scanner & Valider la Tenue</Text>
              </View>
            )}
          </Pressable>
        </Animated.View>

        {/* SCAN COMPLETED RESULTS (SLIDE UP) */}
        {scanCompleted && (
          <Animated.View entering={FadeInDown.duration(600)} style={styles.resultsCard}>
            <BlurView intensity={35} tint="dark" style={StyleSheet.absoluteFillObject} />
            <View style={styles.resultHeader}>
              <View>
                <Text style={styles.resultTitle}>Rapport d'Ajustement</Text>
                <Text style={styles.resultSubtitle}>Analyse de compatibilité complétée</Text>
              </View>
              
              <View style={[styles.gradeBadge, { backgroundColor: getGradeColor(getStyleGrade(compatibilityScore)) }]}>
                <Text style={styles.gradeText}>{getStyleGrade(compatibilityScore)}</Text>
              </View>
            </View>

            <View style={styles.scoreRow}>
              <Text style={styles.scoreLabel}>Score de Compatibilité :</Text>
              <Text style={styles.scoreValue}>{compatibilityScore}%</Text>
            </View>

            <View style={styles.progressBarBg}>
              <Animated.View 
                entering={FadeIn.delay(300)}
                style={[
                  styles.progressBarFill, 
                  { width: `${compatibilityScore}%`, backgroundColor: getGradeColor(getStyleGrade(compatibilityScore)) }
                ]} 
              />
            </View>

            <View style={styles.critiqueBox}>
              <Text style={styles.critiqueHeader}>AVIS DU CONSEILLER IA</Text>
              <Text style={styles.critiqueText}>
                {recommendation?.detected_mood === 'énergique' || recommendation?.detected_mood === 'confiant'
                  ? `Cette tenue exprime parfaitement votre dynamisme. L'équilibre des pièces valorise votre morphologie (${recommendation?.answers?.height || '175'} cm) et s'adapte précisément à votre origine (${recommendation?.answers?.origin || 'Europe'}). C'est une association puissante.`
                  : `Un look d'humeur très équilibré. L'ajustement des pièces procure à la fois confort physique et élégance visuelle. Parfaitement adapté pour passer une journée sereine tout en restant très stylé.`
                }
              </Text>
            </View>

            <Pressable 
              style={styles.saveFavBtn}
              onPress={handleSaveFittingLook}
            >
              <Ionicons name="heart" size={18} color="#FFF" style={{ marginRight: 6 }} />
              <Text style={styles.saveFavBtnText}>Sauvegarder l'Essayage</Text>
            </Pressable>
          </Animated.View>
        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
  },
  loadingScreen: {
    flex: 1,
    backgroundColor: '#020617',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerSubtitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: -0.5,
  },
  placeholderBtn: {
    width: 44,
  },
  mirrorCard: {
    height: 320,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    marginBottom: 24,
    elevation: 4,
  },
  mirrorContainer: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  userPhoto: {
    width: '100%',
    height: '100%',
  },
  avatarSilhouetteContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLabel: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
  },
  glowDot: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#8B5CF6',
    borderWidth: 2,
    borderColor: '#FFF',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 6,
  },
  laserBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 24,
    borderBottomWidth: 1.5,
    borderBottomColor: '#A78BFA',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
  },
  mirrorFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(2, 6, 23, 0.75)',
    borderTopWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  mirrorOutfitTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  mirrorOutfitSubtitle: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 2,
  },
  wardrobeSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  sectionSubtitle: {
    color: '#64748B',
    fontSize: 13,
    marginTop: 4,
    marginBottom: 16,
  },
  itemsGrid: {
    gap: 12,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  itemCardEquipped: {
    backgroundColor: 'rgba(139, 92, 246, 0.08)',
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  itemIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemIconContainerEquipped: {
    backgroundColor: '#8B5CF6',
  },
  itemTextContainer: {
    flex: 1,
    marginLeft: 14,
    marginRight: 8,
  },
  itemText: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '500',
  },
  itemTextEquipped: {
    color: '#FFF',
    fontWeight: '600',
  },
  actionContainer: {
    marginBottom: 24,
  },
  scanBtn: {
    height: 56,
    borderRadius: 16,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 4,
  },
  scanBtnDisabled: {
    backgroundColor: '#475569',
  },
  scanBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultsCard: {
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    marginBottom: 20,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
  },
  resultSubtitle: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 2,
  },
  gradeBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradeText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  scoreLabel: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '500',
  },
  scoreValue: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 20,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  critiqueBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 20,
  },
  critiqueHeader: {
    color: '#A78BFA',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  critiqueText: {
    color: '#CBD5E1',
    fontSize: 13,
    lineHeight: 18,
  },
  saveFavBtn: {
    height: 48,
    borderRadius: 12,
    backgroundColor: '#059669',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  saveFavBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
