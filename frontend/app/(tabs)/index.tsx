import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable, ScrollView, Image, TextInput, StatusBar, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSequence, 
  FadeInDown
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNotifications } from '@/hooks/useNotifications';
import { API_URL } from '@/constants/Api';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Alert, ActivityIndicator, Modal, KeyboardAvoidingView } from 'react-native';

const { width } = Dimensions.get('window');

// Moods with premium glowing backgrounds and vivid accents
const MOODS = [
  { id: 'happy', emoji: '☀️', name: 'Rayonnant', bgColors: ['#FFFAF0', '#FFF3E0'], accent: '#F59E0B' },
  { id: 'calme', emoji: '🌿', name: 'Serein', bgColors: ['#E8F5E9', '#C8E6C9'], accent: '#10B981' },
  { id: 'energetic', emoji: '⚡', name: 'Énergique', bgColors: ['#FFEBEE', '#FFCDD2'], accent: '#EF4444' },
  { id: 'melancholic', emoji: '🌙', name: 'Rêveur', bgColors: ['#F3E5F5', '#E1BEE7'], accent: '#8B5CF6' },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [selectedMood, setSelectedMood] = useState(MOODS[1]); 
  const [userProfile, setUserProfile] = useState<any>(null);
  const { registerForPushNotificationsAsync, scheduleDailyStreakReminder } = useNotifications();
  const [isScanning, setIsScanning] = useState(false);
  const [streak, setStreak] = useState(0);
  const [weather, setWeather] = useState({ temp: '--', description: 'Localisation...', icon: 'cloud' });

  // Form states for custom AI style scan
  const [heightVal, setHeightVal] = useState('');
  const [originVal, setOriginVal] = useState('');
  const [isFormModalVisible, setIsFormModalVisible] = useState(false);

  // Favorites states
  const [favorites, setFavorites] = useState<any[]>([]);
  const [isFavoritesModalVisible, setIsFavoritesModalVisible] = useState(false);

  // Custom Alert states
  const [customAlert, setCustomAlert] = useState<{
    visible: boolean;
    title: string;
    description: string;
    options: { text: string; onPress: () => void; isCancel?: boolean }[];
    icon?: string;
    iconColor?: string;
  } | null>(null);

  const showCustomAlert = (
    title: string,
    description: string,
    options: { text: string; onPress: () => void; isCancel?: boolean }[],
    icon = 'sparkles',
    iconColor?: string
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
  }, [isFavoritesModalVisible]);

  const handleOpenFavorites = async () => {
    await loadFavorites();
    setIsFavoritesModalVisible(true);
  };

  const handleSelectFavorite = async (fav: any) => {
    try {
      await AsyncStorage.setItem('latestRecommendation', JSON.stringify(fav));
      setIsFavoritesModalVisible(false);
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
      const updated = favorites.filter((f: any) => 
        f.style_keywords?.join() !== favToDelete.style_keywords?.join()
      );
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

  const handleScanStyle = () => {
    showCustomAlert(
      "Style & Mode",
      "Sélectionnez votre mode d'analyse :",
      [
        {
          text: "🎙️ Assistant Vocal",
          onPress: () => router.push('/voice-stylist')
        },
        {
          text: "📸 Analyser ma silhouette",
          onPress: async () => {
            const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
            const libraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (!cameraPermission.granted || !libraryPermission.granted) {
              showCustomAlert(
                "Permissions",
                "L'accès à l'appareil photo est requis pour cette fonctionnalité premium.",
                [{ text: "OK", onPress: () => {} }],
                "lock-closed-outline",
                "#EF4444"
              );
              return;
            }

            if (userProfile) {
              if (userProfile.height && !heightVal) setHeightVal(String(userProfile.height));
              if (userProfile.origin && !originVal) setOriginVal(userProfile.origin);
            }
            setIsFormModalVisible(true);
          }
        },
        { text: "Annuler", onPress: () => {}, isCancel: true }
      ],
      "sparkles-outline"
    );
  };

  const handleProceedToScan = () => {
    setIsFormModalVisible(false);
    setTimeout(() => {
      showCustomAlert(
        "Intelligence Artificielle",
        "Voulez-vous prendre une photo ou choisir depuis votre galerie ?",
        [
          { text: "📸 Appareil Photo", onPress: () => launchPicker(true) },
          { text: "🖼️ Galerie photo", onPress: () => launchPicker(false) },
          { text: "Annuler", onPress: () => {}, isCancel: true },
        ],
        "camera-outline"
      );
    }, 400);
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

      const result = isCamera ? await ImagePicker.launchCameraAsync(options) : await ImagePicker.launchImageLibraryAsync(options);
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
          height: heightVal ? parseInt(heightVal, 10) : undefined,
          origin: originVal || undefined,
        }),
      });

      const resData = await response.json();
      setIsScanning(false);

      if (!response.ok) {
        showCustomAlert(
          "Erreur",
          resData.message || "Analyse impossible.",
          [{ text: "OK", onPress: () => {} }],
          "alert-circle-outline",
          "#EF4444"
        );
        return;
      }
      if (resData.isFullBodyValid === false) {
        showCustomAlert(
          "Photo Non Conforme",
          resData.errorAlert,
          [{ text: "Réessayer", onPress: () => handleScanStyle() }],
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
        "Erreur",
        "Une anomalie s'est produite.",
        [{ text: "OK", onPress: () => {} }],
        "alert-circle-outline",
        "#EF4444"
      );
    }
  };

  // Ambient backgrounds shifting animations
  const floatAnim1 = useSharedValue(0);
  const floatAnim2 = useSharedValue(0);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const userData = await AsyncStorage.getItem('user');
        if (userData) setUserProfile(JSON.parse(userData));

        try {
          const streakRes = await fetch(`${API_URL}/checkins/streak`, { headers: { Authorization: `Bearer ${token}` } });
          if (streakRes.ok) {
            const streakData = await streakRes.json();
            setStreak(streakData.currentStreak || 0);
          }
        } catch (e) {}

        await registerForPushNotificationsAsync();
        await scheduleDailyStreakReminder();
      }
    };
    checkAuth();

    const loadWeather = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      try {
        const location = await Location.getCurrentPositionAsync({});
        const token = await AsyncStorage.getItem('token');
        const weatherRes = await fetch(`${API_URL}/weather?lat=${location.coords.latitude}&lon=${location.coords.longitude}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined
        });
        if (weatherRes.ok) {
          const weatherData = await weatherRes.json();
          setWeather(weatherData);
        }
      } catch (e) {}
    };
    loadWeather();

    floatAnim1.value = withRepeat(withSequence(withTiming(-20, { duration: 4000 }), withTiming(0, { duration: 4000 })), -1, true);
    floatAnim2.value = withRepeat(withSequence(withTiming(15, { duration: 5000 }), withTiming(0, { duration: 5000 })), -1, true);
  }, []);

  const animatedOrb1 = useAnimatedStyle(() => ({ transform: [{ translateY: floatAnim1.value }] }));
  const animatedOrb2 = useAnimatedStyle(() => ({ transform: [{ translateY: floatAnim2.value }] }));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Dynamic colorful background base */}
      <View style={StyleSheet.absoluteFill}>
        <LinearGradient 
          colors={selectedMood.bgColors as [string, string, ...string[]]} 
          style={StyleSheet.absoluteFillObject} 
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <Animated.View style={[styles.ambientOrb, styles.orbTopRight, { backgroundColor: selectedMood.accent }, animatedOrb1]} />
        <Animated.View style={[styles.ambientOrb, styles.orbBottomLeft, { backgroundColor: selectedMood.accent }, animatedOrb2]} />
        <BlurView intensity={70} tint="light" style={StyleSheet.absoluteFill} />
      </View>

      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 90 }]} showsVerticalScrollIndicator={false}>
        
        {/* TOP HEADER */}
        <Animated.View entering={FadeInDown.duration(800).springify()} style={styles.header}>
          <View style={styles.headerTextWrap}>
            <Text style={styles.brandTitle}>AURA STUDIO</Text>
            <Text numberOfLines={1} style={styles.greeting}>Bonjour, <Text style={styles.userName}>{userProfile?.displayName || 'Marwan'}</Text></Text>
          </View>
          <View style={styles.headerRight}>
            <Pressable style={styles.favHeaderBtn} onPress={handleOpenFavorites}>
              <Ionicons name="bookmark-outline" size={22} color="#111827" />
            </Pressable>
            <View style={[styles.avatarBorder, { borderColor: selectedMood.accent }]}>
              <Image source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80' }} style={styles.avatar} />
            </View>
          </View>
        </Animated.View>

        {/* METRICS WIDGET */}
        <Animated.View entering={FadeInDown.delay(100).duration(800).springify()} style={[styles.metricsContainer, { borderColor: `${selectedMood.accent}30` }]}>
          <BlurView intensity={60} style={styles.metricsBlur}>
            <View style={styles.metricBlock}>
              <Ionicons name="flame-outline" size={20} color={selectedMood.accent} />
              <View style={styles.metricTexts}>
                <Text style={styles.metricValue}>{streak}</Text>
                <Text style={styles.metricLabel}>Jours</Text>
              </View>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricBlock}>
              <Feather name={weather.icon as any} size={20} color="#111827" />
              <View style={[styles.metricTexts, { flexShrink: 1 }]}>
                <Text style={styles.metricValue}>{weather.temp !== '--' ? `${weather.temp}°` : '--'}</Text>
                <Text numberOfLines={1} style={styles.metricLabel}>{weather.description || 'Météo'}</Text>
              </View>
            </View>
          </BlurView>
        </Animated.View>

        {/* MOOD SELECTOR */}
        <Animated.View entering={FadeInDown.delay(200).duration(800).springify()} style={styles.section}>
          <Text style={styles.sectionTitle}>Votre aura du jour</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.moodScroll}>
            {MOODS.map((mood) => {
              const active = selectedMood.id === mood.id;
              return (
                <Pressable
                  key={mood.id}
                  onPress={() => setSelectedMood(mood)}
                  style={[
                    styles.moodPill, 
                    active && { backgroundColor: mood.accent, borderColor: mood.accent, shadowColor: mood.accent, shadowOpacity: 0.3 }
                  ]}
                >
                  <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                  <Text style={[styles.moodName, active && { color: '#FFF' }]}>{mood.name}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </Animated.View>

        {/* 2x2 FEATURES GRID */}
        <Animated.View entering={FadeInDown.delay(300).duration(800).springify()} style={styles.section}>
          <Text style={styles.sectionTitle}>Laboratoire IA</Text>
          <View style={styles.grid}>
            
            {/* FEATURE 1: STYLE */}
            <Pressable style={styles.cardWrapper} onPress={handleScanStyle}>
              <LinearGradient colors={['#6366F1', '#A855F7']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.card}>
                <View style={styles.cardTopRow}>
                  <View style={[styles.iconFrame, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
                    <Ionicons name="scan-outline" size={20} color="#FFF" />
                  </View>
                  <Ionicons name="sparkles" size={16} color="#00E5FF" />
                </View>
                <View>
                  <Text style={[styles.cardTitle, { color: '#FFF' }]}>Style & Mode</Text>
                  <Text style={[styles.cardSub, { color: 'rgba(255,255,255,0.8)' }]}>Scanner votre silhouette</Text>
                </View>
              </LinearGradient>
            </Pressable>

            {/* FEATURE 2: HUMEUR */}
            <Pressable style={styles.cardWrapper} onPress={() => router.push('/sentiments')}>
              <LinearGradient colors={['#FF6B6B', '#FF8E53']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.card}>
                <View style={styles.cardTopRow}>
                  <View style={[styles.iconFrame, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
                    <Ionicons name="pulse-outline" size={20} color="#FFF" />
                  </View>
                </View>
                <View>
                  <Text style={[styles.cardTitle, { color: '#FFF' }]}>Sentiments</Text>
                  <Text style={[styles.cardSub, { color: 'rgba(255,255,255,0.8)' }]}>Analyse psychologique</Text>
                </View>
              </LinearGradient>
            </Pressable>

            {/* FEATURE 3: MUSIQUE */}
            <Pressable style={styles.cardWrapper} onPress={() => Alert.alert('Bientôt disponible', "En développement par l'équipe Musique.")}>
              <LinearGradient colors={['#00C6FF', '#0072FF']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.card}>
                <View style={styles.cardTopRow}>
                  <View style={[styles.iconFrame, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
                    <Ionicons name="headset-outline" size={20} color="#FFF" />
                  </View>
                </View>
                <View>
                  <Text style={[styles.cardTitle, { color: '#FFF' }]}>Musique</Text>
                  <Text style={[styles.cardSub, { color: 'rgba(255,255,255,0.8)' }]}>Fréquences sur-mesure</Text>
                </View>
              </LinearGradient>
            </Pressable>

            {/* FEATURE 4: MAQUILLAGE */}
            <Pressable style={styles.cardWrapper} onPress={() => Alert.alert('Bientôt disponible', "En développement par l'équipe Beauté.")}>
              <LinearGradient colors={['#FF4E50', '#F9D423']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.card}>
                <View style={styles.cardTopRow}>
                  <View style={[styles.iconFrame, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
                    <Ionicons name="color-filter-outline" size={20} color="#FFF" />
                  </View>
                </View>
                <View>
                  <Text style={[styles.cardTitle, { color: '#FFF' }]}>Beauté</Text>
                  <Text style={[styles.cardSub, { color: 'rgba(255,255,255,0.8)' }]}>Routines esthétiques</Text>
                </View>
              </LinearGradient>
            </Pressable>

          </View>
        </Animated.View>

      </ScrollView>

      {/* LUXURY LOADER */}
      <Modal visible={isScanning} transparent animationType="fade">
        <View style={styles.loaderOverlay}>
          <BlurView intensity={100} tint="dark" style={styles.loaderGlass}>
            <ActivityIndicator size="large" color="#FFF" style={{ marginBottom: 20 }} />
            <Text style={styles.loaderTitle}>Analyse Biométrique...</Text>
            <Text style={styles.loaderSub}>L'IA Llama vision traite vos proportions et colorimétrie avec précision.</Text>
          </BlurView>
        </View>
      </Modal>

      {/* LUXURY FORM MODAL */}
      <Modal visible={isFormModalVisible} transparent animationType="slide">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.formOverlay}
        >
          <Pressable style={StyleSheet.absoluteFillObject} onPress={() => setIsFormModalVisible(false)} />
          <BlurView intensity={90} tint="light" style={styles.formContainer}>
            <View style={styles.formHeader}>
              <View style={styles.formIconBadge}>
                <MaterialCommunityIcons name="ruler" size={20} color="#111827" />
              </View>
              <Text style={styles.formTitle}>Précision Requise</Text>
              <Text style={styles.formSub}>Affinez les résultats de l'IA.</Text>
            </View>

            <View style={styles.formBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Taille (cm)</Text>
                <TextInput
                  style={styles.inputElement}
                  placeholder="Ex: 178"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                  value={heightVal}
                  onChangeText={setHeightVal}
                  selectionColor="#111827"
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Origine géographique</Text>
                <TextInput
                  style={styles.inputElement}
                  placeholder="Ex: France, Maroc..."
                  placeholderTextColor="#9CA3AF"
                  value={originVal}
                  onChangeText={setOriginVal}
                  selectionColor="#111827"
                />
              </View>
            </View>

            <View style={styles.formFooter}>
              <Pressable style={styles.btnGhost} onPress={() => setIsFormModalVisible(false)}>
                <Text style={styles.btnGhostText}>Annuler</Text>
              </Pressable>
              <Pressable style={[styles.btnPrimary, { backgroundColor: selectedMood.accent }]} onPress={handleProceedToScan}>
                <Text style={styles.btnPrimaryText}>Démarrer l'Analyse</Text>
              </Pressable>
            </View>
          </BlurView>
        </KeyboardAvoidingView>
      </Modal>

      {/* LUXURY FAVORITES MODAL */}
      <Modal visible={isFavoritesModalVisible} transparent animationType="slide">
        <View style={styles.formOverlay}>
          <Pressable style={StyleSheet.absoluteFillObject} onPress={() => setIsFavoritesModalVisible(false)} />
          <BlurView intensity={95} tint="light" style={[styles.formContainer, { maxHeight: '80%' }]}>
            <View style={styles.formHeader}>
              <View style={styles.formIconBadge}>
                <Ionicons name="bookmark" size={20} color="#8B5CF6" />
              </View>
              <Text style={styles.formTitle}>Analyses Enregistrées</Text>
              <Text style={styles.formSub}>Vos inspirations & styles favoris</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ marginBottom: 20 }}>
              {favorites.length === 0 ? (
                <View style={styles.emptyFavs}>
                  <Ionicons name="bookmark-outline" size={48} color="#9CA3AF" style={{ marginBottom: 12 }} />
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
              <Pressable style={styles.btnGhost} onPress={() => setIsFavoritesModalVisible(false)}>
                <Text style={styles.btnGhostText}>Fermer</Text>
              </Pressable>
            </View>
          </BlurView>
        </View>
      </Modal>

      {/* PREMIUM CUSTOM ALERT MODAL */}
      <Modal visible={!!customAlert && customAlert.visible} transparent animationType="fade">
        <View style={styles.customAlertOverlay}>
          <Pressable style={StyleSheet.absoluteFillObject} onPress={() => setCustomAlert(null)} />
          <Animated.View entering={FadeInDown.duration(400).springify()} style={styles.customAlertShadow}>
            <BlurView intensity={95} tint="light" style={styles.customAlertCard}>
              {customAlert?.icon && (
                <View style={[styles.customAlertIconFrame, { backgroundColor: `${customAlert.iconColor || selectedMood.accent}15` }]}>
                  <Ionicons name={customAlert.icon as any} size={28} color={customAlert.iconColor || selectedMood.accent} />
                </View>
              )}

              <Text style={styles.customAlertTitle}>{customAlert?.title}</Text>
              <Text style={styles.customAlertSub}>{customAlert?.description}</Text>

              <View style={styles.customAlertButtonsWrap}>
                {customAlert?.options.map((opt, idx) => {
                  const isCancel = opt.isCancel;
                  return (
                    <Pressable
                      key={idx}
                      style={[
                        styles.customAlertBtn,
                        isCancel ? styles.customAlertBtnCancel : { backgroundColor: selectedMood.accent }
                      ]}
                      onPress={() => {
                        setCustomAlert(null);
                        opt.onPress();
                      }}
                    >
                      <Text style={[
                        styles.customAlertBtnText,
                        isCancel ? styles.customAlertBtnTextCancel : { color: '#FFF' }
                      ]}>
                        {opt.text}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </BlurView>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  ambientOrb: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.15,
  },
  orbTopRight: {
    width: 300,
    height: 300,
    top: -80,
    right: -80,
    filter: 'blur(60px)',
  },
  orbBottomLeft: {
    width: 250,
    height: 250,
    bottom: 120,
    left: -60,
    filter: 'blur(60px)',
  },
  scrollContent: {
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 36,
  },
  headerTextWrap: {
    flex: 1,
  },
  brandTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#6B7280',
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '300',
    color: '#111827',
    letterSpacing: -0.5,
  },
  userName: {
    fontWeight: '700',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  favHeaderBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  avatarBorder: {
    width: 52,
    height: 52,
    borderRadius: 26,
    padding: 3,
    backgroundColor: '#FFF',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 3,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
  },
  metricsContainer: {
    borderRadius: 24,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.03,
    shadowRadius: 32,
    elevation: 2,
    borderWidth: 1,
    overflow: 'hidden',
  },
  metricsBlur: {
    flexDirection: 'row',
    paddingVertical: 18,
    paddingHorizontal: 24,
  },
  metricBlock: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  metricTexts: {
    justifyContent: 'center',
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 2,
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  metricDivider: {
    width: 1,
    height: '80%',
    backgroundColor: '#E5E7EB',
    marginHorizontal: 16,
  },
  section: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 20,
    letterSpacing: -0.3,
  },
  moodScroll: {
    gap: 12,
    paddingRight: 24,
  },
  moodPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 100,
    gap: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.02,
    shadowRadius: 16,
  },
  moodEmoji: {
    fontSize: 16,
  },
  moodName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardWrapper: {
    width: '48%',
    aspectRatio: 1.15,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 4,
  },
  card: {
    flex: 1,
    borderRadius: 24,
    padding: 16,
    justifyContent: 'space-between',
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  iconFrame: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 2,
    letterSpacing: -0.3,
  },
  cardSub: {
    fontSize: 10,
    fontWeight: '600',
    lineHeight: 14,
  },
  // Loader
  loaderOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loaderGlass: {
    width: '100%',
    maxWidth: 320,
    borderRadius: 32,
    padding: 32,
    alignItems: 'center',
    overflow: 'hidden',
  },
  loaderTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 8,
  },
  loaderSub: {
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
  },
  // Form Modal
  formOverlay: {
    flex: 1,
    backgroundColor: 'rgba(17, 24, 39, 0.4)',
    justifyContent: 'flex-end',
  },
  formContainer: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    padding: 32,
    paddingBottom: Platform.OS === 'ios' ? 48 : 32,
  },
  formHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  formIconBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  formSub: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  formBody: {
    gap: 20,
    marginBottom: 36,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputElement: {
    height: 56,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    paddingHorizontal: 20,
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  formFooter: {
    flexDirection: 'row',
    gap: 12,
  },
  btnGhost: {
    flex: 1,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
  },
  btnGhostText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4B5563',
  },
  btnPrimary: {
    flex: 2,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 4,
  },
  btnPrimaryText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
  // Favorites Styles
  emptyFavs: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyFavsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  emptyFavsSub: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 18,
  },
  favItemWrapper: {
    marginBottom: 12,
  },
  favItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  favItemMain: {
    flex: 1,
    marginRight: 12,
  },
  favItemTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  favItemDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  favDeleteBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favThumbnail: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
  },
  favThumbnailPlaceholder: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  customAlertOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  customAlertShadow: {
    width: '100%',
    maxWidth: 320,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.12,
    shadowRadius: 30,
    elevation: 10,
    borderRadius: 28,
    overflow: 'hidden',
  },
  customAlertCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',
  },
  customAlertIconFrame: {
    width: 60,
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  customAlertTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  customAlertSub: {
    fontSize: 14,
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  customAlertButtonsWrap: {
    width: '100%',
    gap: 10,
  },
  customAlertBtn: {
    height: 52,
    width: '100%',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
  },
  customAlertBtnCancel: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  customAlertBtnText: {
    fontSize: 15,
    fontWeight: '700',
  },
  customAlertBtnTextCancel: {
    color: '#4B5563',
  },
});
