import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, Pressable, StatusBar, ActivityIndicator,
  ScrollView, Dimensions, Modal, Platform, TextInput, Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, {
  FadeInUp, FadeInDown, FadeIn, useSharedValue, useAnimatedStyle, withSpring, withTiming
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { API_URL } from '../constants/Api';

const { width, height } = Dimensions.get('window');

// Adaptive size helpers for responsiveness
const isSmallDevice = height < 700;
const scaleSize = (size: number) => (isSmallDevice ? size * 0.85 : size);

export default function StyleAnalysisIntroScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // States
  const [isScanning, setIsScanning] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [heightVal, setHeightVal] = useState('170');
  const [originVal, setOriginVal] = useState('');
  const [isHeightFocused, setIsHeightFocused] = useState(false);
  const [isOriginFocused, setIsOriginFocused] = useState(false);

  // Favorites states
  const [favorites, setFavorites] = useState<any[]>([]);
  const [isFavoritesVisible, setIsFavoritesVisible] = useState(false);

  // Custom Alert state
  const [customAlert, setCustomAlert] = useState<{
    visible: boolean;
    title: string;
    description: string;
    options: { text: string; onPress: () => void; isCancel?: boolean }[];
    icon?: string;
    iconColor?: string;
  } | null>(null);

  // Reanimated Tab Indicator
  const tabSelectorTranslation = useSharedValue(0);
  const tabWidth = (width - 40 - 8) / 2; // screen padding - container padding

  const toggleTabStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: tabSelectorTranslation.value }],
    };
  });

  useEffect(() => {
    tabSelectorTranslation.value = withSpring(isVoiceMode ? tabWidth : 0, {
      damping: 18,
      stiffness: 120,
    });
  }, [isVoiceMode]);

  const showCustomAlert = (
    title: string,
    description: string,
    options: { text: string; onPress: () => void; isCancel?: boolean }[],
    icon = 'sparkles-outline',
    iconColor = '#6366F1'
  ) => {
    setCustomAlert({
      visible: true,
      title,
      description,
      options,
      icon,
      iconColor,
    });
  };

  // Load favorites
  const loadFavorites = async () => {
    try {
      const favsStr = await AsyncStorage.getItem('savedRecommendations');
      if (favsStr) {
        setFavorites(JSON.parse(favsStr));
      } else {
        setFavorites([]);
      }
    } catch (e) {}
  };

  useEffect(() => {
    loadFavorites();

    // Load initial user details for prefilled fields
    const loadUserDetails = async () => {
      try {
        const userStr = await AsyncStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          if (user.height) setHeightVal(String(user.height));
          if (user.origin) setOriginVal(user.origin);
        }
      } catch (e) {}
    };
    loadUserDetails();
  }, []);

  const handleSelectFavorite = async (fav: any) => {
    try {
      await AsyncStorage.setItem('latestRecommendation', JSON.stringify(fav));
      setIsFavoritesVisible(false);
      router.push('/style-analysis');
    } catch (err) {
      showCustomAlert(
        "Erreur",
        "Impossible d'ouvrir ce favori.",
        [{ text: "OK", onPress: () => {} }],
        "alert-circle-outline",
        "#EF4444"
      );
    }
  };

  const handleDeleteFavorite = async (favToDelete: any) => {
    try {
      const updated = favorites.filter((f: any) => {
        if (f.id && favToDelete.id) {
          return f.id !== favToDelete.id || f.isFittingRoomLook !== favToDelete.isFittingRoomLook || f.fittingScore !== favToDelete.fittingScore;
        }
        return f.style_keywords?.join() !== favToDelete.style_keywords?.join();
      });
      setFavorites(updated);
      await AsyncStorage.setItem('savedRecommendations', JSON.stringify(updated));
    } catch (err) {
      showCustomAlert(
        "Erreur",
        "Impossible de supprimer.",
        [{ text: "OK", onPress: () => {} }],
        "alert-circle-outline",
        "#EF4444"
      );
    }
  };

  const adjustHeight = (amount: number) => {
    const current = parseInt(heightVal, 10) || 170;
    const next = Math.max(100, Math.min(250, current + amount));
    setHeightVal(String(next));
  };

  const handleStartAnalysis = async () => {
    // Height validation
    if (!heightVal) {
      showCustomAlert(
        "Taille Requise",
        "Veuillez saisir votre taille en centimètres pour calibrer l'analyse corporelle IA.",
        [{ text: "OK", onPress: () => {} }],
        "ruler",
        "#EF4444"
      );
      return;
    }

    const heightNum = parseInt(heightVal, 10);
    if (isNaN(heightNum) || heightNum < 100 || heightNum > 250) {
      showCustomAlert(
        "Taille Invalide",
        "Veuillez saisir une taille valide (entre 100 et 250 cm).",
        [{ text: "OK", onPress: () => {} }],
        "alert-circle-outline",
        "#EF4444"
      );
      return;
    }

    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    const libraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!cameraPermission.granted || !libraryPermission.granted) {
      showCustomAlert(
        "Permissions Requises",
        "L'accès à la caméra et à la galerie est requis pour analyser votre silhouette.",
        [{ text: "OK", onPress: () => {} }],
        "lock-closed-outline",
        "#EF4444"
      );
      return;
    }

    showCustomAlert(
      "Silhouette IA",
      "Prenez une photo de votre corps entier bien cadrée ou choisissez un fichier depuis votre galerie.",
      [
        { text: "📸 Appareil Photo", onPress: () => launchPicker(true) },
        { text: "🖼️ Galerie photo", onPress: () => launchPicker(false) },
        { text: "Annuler", onPress: () => {}, isCancel: true }
      ],
      "camera-outline"
    );
  };

  const launchPicker = async (isCamera: boolean) => {
    try {
      const options: ImagePicker.ImagePickerOptions = {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.6,
        base64: true,
      };

      const result = isCamera
        ? await ImagePicker.launchCameraAsync(options)
        : await ImagePicker.launchImageLibraryAsync(options);

      if (result.canceled || !result.assets || result.assets.length === 0) return;

      const asset = result.assets[0];
      if (!asset.base64) return;

      setIsScanning(true);

      const token = await AsyncStorage.getItem('token');
      if (!token) {
        setIsScanning(false);
        router.push('/auth');
        return;
      }

      const response = await fetch(`${API_URL}/checkins/scan-style`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          base64Image: asset.base64,
          mimeType: asset.mimeType || 'image/jpeg',
          height: parseInt(heightVal, 10),
          origin: originVal || undefined,
        }),
      });

      const resData = await response.json();
      setIsScanning(false);

      if (!response.ok) {
        showCustomAlert(
          "Erreur d'analyse",
          resData.message || "Impossible d'analyser la photo.",
          [{ text: "OK", onPress: () => {} }],
          "alert-circle-outline",
          "#EF4444"
        );
        return;
      }

      if (resData.isFullBodyValid === false) {
        showCustomAlert(
          "Photo Non Conforme",
          resData.errorAlert || "Assurez-vous d'être de face et entièrement visible.",
          [{ text: "Réessayer", onPress: () => handleStartAnalysis() }],
          "close-circle-outline",
          "#EF4444"
        );
        return;
      }

      await AsyncStorage.setItem('latestRecommendation', JSON.stringify(resData.recommendation));
      await AsyncStorage.setItem('latestCheckin', JSON.stringify(resData.checkin));
      router.replace('/style-analysis');

    } catch (err) {
      setIsScanning(false);
      showCustomAlert(
        "Erreur technique",
        "Une erreur s'est produite lors de l'envoi de la photo.",
        [{ text: "OK", onPress: () => {} }],
        "alert-circle-outline",
        "#EF4444"
      );
    }
  };

  const handleStartVoice = async () => {
    try {
      const userStr = await AsyncStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      
      let isPremiumRequired = false;
      try {
        const cached = await AsyncStorage.getItem('system_config');
        if (cached) {
          isPremiumRequired = !!JSON.parse(cached).isVoicePremium;
        }
      } catch (e) {}

      if (isPremiumRequired && (!user || user.plan !== 'PREMIUM')) {
        showCustomAlert(
          "👑 Assistant Vocal Premium",
          "L'Assistant Vocal Stylist est réservé aux membres Aura Premium.\n\nParlez librement à votre styliste IA personnel et concevez votre look !",
          [
            { text: "Devenir Premium 👑", onPress: () => router.push('/(tabs)/two') },
            { text: "Plus tard", onPress: () => {}, isCancel: true }
          ],
          "crown-outline",
          "#F59E0B"
        );
      } else {
        router.push('/voice-stylist');
      }
    } catch (e) {}
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Ambient Background with subtle animated meshes */}
      <View style={StyleSheet.absoluteFill}>
        <LinearGradient
          colors={['#F5F7FF', '#E4E8FF']}
          style={StyleSheet.absoluteFillObject}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <View style={styles.orbTopRight} />
        <View style={styles.orbBottomLeft} />
        <BlurView intensity={80} tint="light" style={StyleSheet.absoluteFillObject} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent, 
          { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 }
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* HEADER */}
        <Animated.View entering={FadeInUp.duration(600).springify()} style={styles.header}>
          <Pressable style={styles.closeBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color="#1F2937" />
          </Pressable>
          <View style={styles.headerCenter}>
            <Text style={styles.headerSubtitle}>MODULE D'ANALYSE</Text>
            <Text style={styles.headerTitle}>Style & Mode</Text>
          </View>
          <Pressable style={styles.historyBtn} onPress={() => { loadFavorites(); setIsFavoritesVisible(true); }}>
            <Ionicons name="time-outline" size={22} color="#1F2937" />
          </Pressable>
        </Animated.View>

        {/* ==================== CENTRAL CARD ==================== */}
        <Animated.View entering={FadeInDown.delay(100).duration(600).springify()} style={styles.centerBox}>
          <View style={[styles.iconBadge, { backgroundColor: isVoiceMode ? '#F5F3FF' : '#EEF2FF', borderColor: isVoiceMode ? '#DDD6FE' : '#E0E7FF' }]}>
            <Ionicons name={isVoiceMode ? "mic" : "shirt"} size={scaleSize(36)} color={isVoiceMode ? "#8B5CF6" : "#6366F1"} />
          </View>
          <Text style={styles.title}>{isVoiceMode ? "Assistant Vocal Stylist" : "Analyse Morphologique"}</Text>
          <Text style={styles.subtitle}>
            {isVoiceMode 
              ? "Discutez de vive voix avec notre styliste IA. Il répondra à toutes vos questions style et vous composera des looks uniques."
              : "Prenez une photo de votre silhouette de face et laissez notre IA décoder vos proportions pour vous recommander des styles adaptés."}
          </Text>

          {/* Form for Height & Origin (Only shown in silhouette mode) */}
          {!isVoiceMode && (
            <View style={styles.preSelectionCard}>
              <Text style={styles.preSelectionTitle}>Paramètres de Calibration</Text>
              <Text style={styles.preSelectionSubtitle}>Renseignez vos mensurations pour plus de précision :</Text>
              
              <View style={styles.inputContainer}>
                {/* Premium Height Adjuster */}
                <View style={[styles.heightAdjusterRow, isHeightFocused && styles.inputFocused]}>
                  <MaterialCommunityIcons name="ruler" size={20} color="#6366F1" style={{ marginRight: 8 }} />
                  <Text style={styles.heightAdjusterLabel}>Taille :</Text>
                  
                  <Pressable style={styles.adjustBtn} onPress={() => adjustHeight(-1)}>
                    <Feather name="minus" size={16} color="#4B5563" />
                  </Pressable>
                  
                  <TextInput
                    style={styles.heightInput}
                    keyboardType="numeric"
                    value={heightVal}
                    onChangeText={setHeightVal}
                    onFocus={() => setIsHeightFocused(true)}
                    onBlur={() => setIsHeightFocused(false)}
                    maxLength={3}
                  />
                  <Text style={styles.cmText}>cm</Text>

                  <Pressable style={styles.adjustBtn} onPress={() => adjustHeight(1)}>
                    <Feather name="plus" size={16} color="#4B5563" />
                  </Pressable>
                </View>

                {/* Geographical Origin Input */}
                <View style={[styles.inputRow, isOriginFocused && styles.inputFocused, { marginTop: 12 }]}>
                  <Ionicons name="earth" size={18} color="#6366F1" style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Origine géographique (Ex: Maroc)"
                    placeholderTextColor="#9CA3AF"
                    value={originVal}
                    onChangeText={setOriginVal}
                    onFocus={() => setIsOriginFocused(true)}
                    onBlur={() => setIsOriginFocused(false)}
                  />
                </View>

                {/* Popular Origin Badges */}
                <View style={styles.badgesRow}>
                  {['Maroc 🇲🇦', 'France 🇫🇷', 'Afrique 🌍', 'Moyen-Orient 🕌'].map((place) => (
                    <Pressable
                      key={place}
                      style={[styles.badge, originVal.toLowerCase().includes(place.split(' ')[0].toLowerCase()) && styles.badgeActive]}
                      onPress={() => setOriginVal(place)}
                    >
                      <Text style={[styles.badgeText, originVal.toLowerCase().includes(place.split(' ')[0].toLowerCase()) && styles.badgeTextActive]}>
                        {place}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            </View>
          )}

          {/* Voice mode intro card */}
          {isVoiceMode && (
            <View style={styles.voiceIntroCard}>
              <View style={styles.pulseContainer}>
                <Ionicons name="mic-circle" size={48} color="#8B5CF6" />
              </View>
              <Text style={styles.voiceIntroTitle}>Parlez librement à votre styliste</Text>
              <Text style={styles.voiceIntroDesc}>
                Posez vos questions de look, demandez un conseil pour un événement ou discutez de vos préférences stylistiques à haute voix.
              </Text>
            </View>
          )}

          {/* Reanimated Segmented Switch */}
          <View style={styles.scanModeToggleRow}>
            {/* Sliding Pill Indicator */}
            <Animated.View style={[styles.scanModeToggleActivePill, toggleTabStyle, { width: tabWidth }]} />

            <Pressable
              style={styles.scanModeToggleBtn}
              onPress={() => setIsVoiceMode(false)}
            >
              <Ionicons name="camera-outline" size={15} color={!isVoiceMode ? "#FFF" : "#6B7280"} style={{ marginRight: 6 }} />
              <Text style={[styles.scanModeToggleText, !isVoiceMode && styles.scanModeToggleTextActive]}>Silhouette</Text>
            </Pressable>
            
            <Pressable
              style={styles.scanModeToggleBtn}
              onPress={() => setIsVoiceMode(true)}
            >
              <Ionicons name="mic-outline" size={15} color={isVoiceMode ? "#FFF" : "#6B7280"} style={{ marginRight: 6 }} />
              <Text style={[styles.scanModeToggleText, isVoiceMode && styles.scanModeToggleTextActive]}>Assistant Vocal</Text>
            </Pressable>
          </View>

          {/* CTA Button */}
          {isVoiceMode ? (
            <Pressable style={styles.captureBtn} onPress={handleStartVoice}>
              <LinearGradient
                colors={['#8B5CF6', '#A855F7']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.captureBtnGradient}
              >
                <Ionicons name="mic" size={20} color="#FFF" style={{ marginRight: 8 }} />
                <Text style={styles.captureBtnText}>Lancer l'Assistant Vocal</Text>
              </LinearGradient>
            </Pressable>
          ) : (
            <Pressable style={styles.captureBtn} onPress={handleStartAnalysis}>
              <LinearGradient
                colors={['#6366F1', '#A855F7']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.captureBtnGradient}
              >
                <Ionicons name="scan" size={20} color="#FFF" style={{ marginRight: 8 }} />
                <Text style={styles.captureBtnText}>Scanner ma Silhouette</Text>
              </LinearGradient>
            </Pressable>
          )}

          {/* Feature Highlights */}
          <View style={styles.featureList}>
            {[
              { icon: 'body-outline', text: isVoiceMode ? 'Conseils vestimentaires sur-mesure' : 'Analyse de morphologie de face' },
              { icon: 'sparkles-outline', text: 'Coupes, matières & coloris conseillés' },
              { icon: 'shirt-outline', text: 'Accès direct à la cabine d\'essayage' },
            ].map((feat, idx) => (
              <View key={idx} style={styles.featureRow}>
                <View style={styles.featureIconFrame}>
                  <Ionicons name={feat.icon as any} size={15} color="#6366F1" />
                </View>
                <Text style={styles.featureText}>{feat.text}</Text>
              </View>
            ))}
          </View>
        </Animated.View>
      </ScrollView>

      {/* LUXURY GLASS LOADER */}
      <Modal visible={isScanning} transparent animationType="fade">
        <View style={styles.loaderOverlay}>
          <BlurView intensity={90} tint="dark" style={styles.loaderGlass}>
            <ActivityIndicator size="large" color="#6366F1" style={{ marginBottom: 20 }} />
            <Text style={styles.loaderTitle}>Analyse Biométrique...</Text>
            <Text style={styles.loaderSub}>L'IA Llama vision traite vos proportions et colorimétrie avec précision.</Text>
          </BlurView>
        </View>
      </Modal>

      {/* PREMIUM CUSTOM DIALOG */}
      {customAlert?.visible && (
        <Modal transparent animationType="fade" visible={customAlert.visible}>
          <View style={styles.alertOverlay}>
            <BlurView intensity={95} tint="dark" style={styles.alertBox}>
              <View style={[styles.alertIconBadge, { backgroundColor: `${customAlert.iconColor}20` }]}>
                {customAlert.icon === 'ruler' ? (
                  <MaterialCommunityIcons name="ruler" size={26} color={customAlert.iconColor} />
                ) : (
                  <Ionicons name={customAlert.icon as any} size={26} color={customAlert.iconColor} />
                )}
              </View>
              <Text style={styles.alertTitle}>{customAlert.title}</Text>
              <Text style={styles.alertDescription}>{customAlert.description}</Text>
              
              <View style={styles.alertButtonsRow}>
                {customAlert.options.map((opt, i) => (
                  <Pressable
                    key={i}
                    style={[
                      styles.alertBtn,
                      opt.isCancel ? styles.alertBtnCancel : { backgroundColor: customAlert.iconColor }
                    ]}
                    onPress={() => {
                      setCustomAlert(null);
                      opt.onPress();
                    }}
                  >
                    <Text style={styles.alertBtnText}>{opt.text}</Text>
                  </Pressable>
                ))}
              </View>
            </BlurView>
          </View>
        </Modal>
      )}

      {/* SAVED ANALYSES (HISTORY) MODAL */}
      <Modal visible={isFavoritesVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <Pressable style={StyleSheet.absoluteFillObject} onPress={() => setIsFavoritesVisible(false)} />
          <BlurView intensity={95} tint="light" style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <View style={styles.modalIconBadge}>
                <Ionicons name="bookmark" size={20} color="#6366F1" />
              </View>
              <Text style={styles.modalTitle}>Analyses Enregistrées</Text>
              <Text style={styles.modalSub}>Vos inspirations & styles favoris</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ marginBottom: 20 }}>
              {favorites.length === 0 ? (
                <View style={styles.emptyFavs}>
                  <Ionicons name="bookmark-outline" size={48} color="#D1D5DB" style={{ marginBottom: 12 }} />
                  <Text style={styles.emptyFavsTitle}>Aucun favori pour le moment</Text>
                  <Text style={styles.emptyFavsSub}>Faites une analyse de style et cliquez sur l'icône marque-page pour la retrouver ici.</Text>
                </View>
              ) : (
                favorites.map((fav, index) => {
                  const favImgUrl = fav.imageUrl || fav.checkin?.imageUrl || fav.checkin?.answers?.imageUrl;
                  return (
                    <View key={index} style={styles.favItemWrapper}>
                      <Pressable style={styles.favItemCard} onPress={() => handleSelectFavorite(fav)}>
                        {favImgUrl ? (
                          <Image source={{ uri: favImgUrl }} style={styles.favThumbnail} />
                        ) : (
                          <View style={styles.favThumbnailPlaceholder}>
                            <Ionicons name="shirt-outline" size={18} color="#9CA3AF" />
                          </View>
                        )}
                        <View style={[styles.favItemMain, { marginLeft: 12 }]}>
                          <Text numberOfLines={1} style={styles.favItemTitle}>
                            {fav.style_keywords?.join(', ') || 'Style Sans Titre'}
                          </Text>
                          <Text style={styles.favItemDate}>
                            Sauvegardé le {new Date(fav.savedAt || Date.now()).toLocaleDateString('fr-FR')}{fav.transcript ? ' • 🎙️ Assistant' : ''}
                          </Text>
                        </View>
                        <Pressable style={styles.favDeleteBtn} onPress={() => handleDeleteFavorite(fav)}>
                          <Feather name="trash-2" size={18} color="#EF4444" />
                        </Pressable>
                      </Pressable>
                    </View>
                  );
                })
              )}
            </ScrollView>

            <View style={{ flexDirection: 'row' }}>
              <Pressable style={styles.btnGhost} onPress={() => setIsFavoritesVisible(false)}>
                <Text style={styles.btnGhostText}>Fermer</Text>
              </Pressable>
            </View>
          </BlurView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FF',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  orbTopRight: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: '#C7D2FE',
    opacity: 0.4,
  },
  orbBottomLeft: {
    position: 'absolute',
    bottom: -100,
    left: -100,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: '#E0E7FF',
    opacity: 0.4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: isSmallDevice ? 12 : 20,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  historyBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerSubtitle: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 2,
    color: '#6B7280',
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1F2937',
  },
  centerBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 24,
    padding: isSmallDevice ? 16 : 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.7)',
    shadowColor: '#6366F1',
    shadowOpacity: 0.04,
    shadowRadius: 20,
    elevation: 5,
  },
  iconBadge: {
    width: scaleSize(64),
    height: scaleSize(64),
    borderRadius: scaleSize(32),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 1,
  },
  title: {
    fontSize: isSmallDevice ? 18 : 22,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: isSmallDevice ? 11 : 13,
    lineHeight: 18,
    color: '#4B5563',
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 6,
  },
  preSelectionCard: {
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 1,
  },
  preSelectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 2,
  },
  preSelectionSubtitle: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 12,
  },
  inputContainer: {
    width: '100%',
  },
  heightAdjusterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    height: 48,
  },
  heightAdjusterLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
    marginRight: 10,
  },
  adjustBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heightInput: {
    width: 45,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  cmText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    marginRight: 10,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    height: 48,
  },
  inputIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 13,
    color: '#111827',
  },
  inputFocused: {
    borderColor: '#6366F1',
    backgroundColor: '#FFF',
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    gap: 6,
    justifyContent: 'center',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  badgeActive: {
    backgroundColor: '#EEF2FF',
    borderColor: '#818CF8',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#4B5563',
  },
  badgeTextActive: {
    color: '#4F46E5',
  },
  scanModeToggleRow: {
    position: 'relative',
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 14,
    padding: 4,
    width: '100%',
    height: 44,
    marginBottom: 16,
    alignItems: 'center',
  },
  scanModeToggleActivePill: {
    position: 'absolute',
    height: 36,
    borderRadius: 10,
    backgroundColor: '#1F2937',
    left: 4,
  },
  scanModeToggleBtn: {
    flex: 1,
    flexDirection: 'row',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  scanModeToggleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
  },
  scanModeToggleTextActive: {
    color: '#FFF',
  },
  voiceIntroCard: {
    width: '100%',
    backgroundColor: '#F5F3FF',
    borderRadius: 18,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E9D5FF',
    marginBottom: 16,
  },
  pulseContainer: {
    marginBottom: 8,
  },
  voiceIntroTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#7C3AED',
    marginBottom: 4,
  },
  voiceIntroDesc: {
    fontSize: 11,
    color: '#6D28D9',
    textAlign: 'center',
    lineHeight: 16,
  },
  captureBtn: {
    width: '100%',
    height: 50,
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#6366F1',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 3,
  },
  captureBtnGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFF',
  },
  featureList: {
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 14,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureIconFrame: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  featureText: {
    fontSize: 11,
    color: '#4B5563',
  },
  loaderOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  loaderGlass: {
    width: '85%',
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    overflow: 'hidden',
  },
  loaderTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFF',
    marginBottom: 6,
  },
  loaderSub: {
    fontSize: 11,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 15,
  },
  alertOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  alertBox: {
    width: '85%',
    borderRadius: 18,
    padding: 20,
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  alertIconBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFF',
    marginBottom: 6,
  },
  alertDescription: {
    fontSize: 12,
    color: '#D1D5DB',
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 16,
  },
  alertButtonsRow: {
    flexDirection: 'column',
    width: '100%',
  },
  alertBtn: {
    width: '100%',
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  alertBtnCancel: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  alertBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    width: '100%',
    maxHeight: '75%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    backgroundColor: '#FFF',
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  modalIconBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1F2937',
  },
  modalSub: {
    fontSize: 11,
    color: '#6B7280',
  },
  emptyFavs: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyFavsTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4B5563',
    marginBottom: 4,
  },
  emptyFavsSub: {
    fontSize: 11,
    color: '#9CA3AF',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  favItemWrapper: {
    marginBottom: 10,
  },
  favItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 10,
  },
  favThumbnail: {
    width: 40,
    height: 40,
    borderRadius: 6,
  },
  favThumbnailPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 6,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  favItemMain: {
    flex: 1,
  },
  favItemTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F2937',
  },
  favItemDate: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 1,
  },
  favDeleteBtn: {
    padding: 6,
  },
  btnGhost: {
    flex: 1,
    height: 42,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnGhostText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4B5563',
  },
});
