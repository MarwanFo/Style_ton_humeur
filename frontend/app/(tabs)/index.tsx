import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable, ScrollView, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons, Feather, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSequence, 
  Easing,
  FadeInDown,
  FadeInLeft,
  FadeIn
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNotifications } from '@/hooks/useNotifications';
import { API_URL } from '@/constants/Api';
import * as ImagePicker from 'expo-image-picker';
import { Alert, ActivityIndicator, Modal } from 'react-native';

const { width } = Dimensions.get('window');

// Mood configurations with specific theme colors
const MOODS = [
  { id: 'happy', emoji: '☀️', name: 'Joyeux', colors: ['#FFFDF0', '#FFF3F3', '#EFF6FF'], accent: '#FFB100', bg: 'rgba(255, 177, 0, 0.12)' },
  { id: 'calme', emoji: '🌿', name: 'Calme', colors: ['#F3FFF6', '#F0F9FF', '#F8FAFC'], accent: '#2ECC71', bg: 'rgba(46, 204, 113, 0.12)' },
  { id: 'energetic', emoji: '⚡', name: 'Énergique', colors: ['#FFF5F5', '#FFF0EA', '#FFF5F8'], accent: '#FF4E50', bg: 'rgba(255, 78, 80, 0.12)' },
  { id: 'serene', emoji: '🌊', name: 'Serein', colors: ['#E0F7FA', '#E8EAF6', '#FFFFFF'], accent: '#00BCD4', bg: 'rgba(0, 188, 212, 0.12)' },
  { id: 'melancholic', emoji: '🌙', name: 'Mélancolique', colors: ['#F3E5F5', '#ECEFF1', '#F5F5F5'], accent: '#9C27B0', bg: 'rgba(156, 39, 176, 0.12)' },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [selectedMood, setSelectedMood] = useState(MOODS[1]); // Calme by default
  const [isPlaying, setIsPlaying] = useState(false);
  const [freezeActive, setFreezeActive] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const { registerForPushNotificationsAsync, scheduleDailyStreakReminder } = useNotifications();
  const [isScanning, setIsScanning] = useState(false);

  const handleScanStyle = async () => {
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    const libraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!cameraPermission.granted || !libraryPermission.granted) {
      Alert.alert(
        "Permissions requises",
        "Nous avons besoin de l'accès à votre caméra et galerie de photos pour scanner votre style."
      );
      return;
    }

    Alert.alert(
      "Scanner mon Style 📷",
      "Choisissez une photo pour que notre IA Gemini analyse votre look, morphologie et colorimétrie.",
      [
        {
          text: "Prendre une photo",
          onPress: () => launchPicker(true),
        },
        {
          text: "Galerie de photos",
          onPress: () => launchPicker(false),
        },
        {
          text: "Annuler",
          style: "cancel",
        },
      ]
    );
  };

  const launchPicker = async (isCamera: boolean) => {
    try {
      const options: ImagePicker.ImagePickerOptions = {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
        base64: true,
      };

      const result = isCamera
        ? await ImagePicker.launchCameraAsync(options)
        : await ImagePicker.launchImageLibraryAsync(options);

      if (result.canceled || !result.assets || result.assets.length === 0) return;

      const asset = result.assets[0];
      if (!asset.base64) {
        Alert.alert("Erreur", "Impossible de traiter l'image sélectionnée.");
        return;
      }

      setIsScanning(true);

      const token = await AsyncStorage.getItem('token');
      if (!token) {
        setIsScanning(false);
        router.push('/auth');
        return;
      }

      const mimeType = asset.mimeType || 'image/jpeg';

      const response = await fetch(`${API_URL}/checkins/scan-style`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          base64Image: asset.base64,
          mimeType: mimeType,
        }),
      });

      const resData = await response.json();
      setIsScanning(false);

      if (!response.ok) {
        Alert.alert("Erreur d'analyse", resData.message || "Impossible d'analyser votre style.");
        return;
      }

      await AsyncStorage.setItem('latestRecommendation', JSON.stringify(resData.recommendation));
      await AsyncStorage.setItem('latestCheckin', JSON.stringify(resData.checkin));
      
      router.replace('/recommendations');

    } catch (err) {
      setIsScanning(false);
      Alert.alert("Erreur", "Une erreur inattendue est survenue lors de l'analyse.");
    }
  };

  const handleStartQuiz = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      router.push('/auth');
    } else {
      router.push('/questionnaire');
    }
  };

  // Background floating orbs positions
  const floatAnim1 = useSharedValue(0);
  const floatAnim2 = useSharedValue(0);
  const floatAnim3 = useSharedValue(0);

  useEffect(() => {
    // Check if token exists to load profile, but do not force redirect
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          setUserProfile(JSON.parse(userData));
        }
        // Init notifications for authenticated users
        await registerForPushNotificationsAsync();
        await scheduleDailyStreakReminder();
      }
    };
    checkAuth();

    floatAnim1.value = withRepeat(withSequence(withTiming(-15, { duration: 3000 }), withTiming(0, { duration: 3000 })), -1, true);
    floatAnim2.value = withRepeat(withSequence(withTiming(20, { duration: 4000 }), withTiming(0, { duration: 4000 })), -1, true);
    floatAnim3.value = withRepeat(withSequence(withTiming(-10, { duration: 2500 }), withTiming(0, { duration: 2500 })), -1, true);
  }, []);

  const animatedOrb1 = useAnimatedStyle(() => ({ transform: [{ translateY: floatAnim1.value }] }));
  const animatedOrb2 = useAnimatedStyle(() => ({ transform: [{ translateY: floatAnim2.value }] }));

  return (
    <View style={styles.container}>
      {/* 1. DYNAMIC COLOR BACKGROUND based on selected mood */}
      <LinearGradient
        colors={selectedMood.colors as [string, string, ...string[]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Elegant glass blobs that morph color */}
      <Animated.View style={[styles.orb, styles.orb1, { backgroundColor: selectedMood.accent + '25' }, animatedOrb1]} />
      <Animated.View style={[styles.orb, styles.orb2, { backgroundColor: selectedMood.accent + '15' }, animatedOrb2]} />

      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 90 }]} 
        showsVerticalScrollIndicator={false}
      >
        {/* BRAND NAVIGATION & PROFILE */}
        <Animated.View entering={FadeInDown.duration(800).springify()} style={styles.header}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text numberOfLines={1} style={styles.brandTitle}>S T Y L E   T O N   H U M E U R</Text>
            <Text numberOfLines={1} style={styles.greeting}>Bonjour, <Text style={[styles.userName, { color: selectedMood.accent }]}>{userProfile?.displayName || 'Chaymae'}</Text> ✨</Text>
          </View>
          <View style={styles.headerRight}>
            {/* STREAK FREEZE TRIGGER (Premium Snowflake) */}
            <Pressable 
              onPress={() => setFreezeActive(!freezeActive)}
              style={[
                styles.freezeBtn, 
                freezeActive && { backgroundColor: '#E0F7FA', borderColor: '#00BCD4' }
              ]}
            >
              <FontAwesome5 name="snowflake" size={18} color={freezeActive ? '#00BCD4' : '#8A8A9E'} />
              <View style={[styles.freezeIndicator, { backgroundColor: freezeActive ? '#00BCD4' : '#C4C4C4' }]} />
            </Pressable>
            <View style={[styles.avatarBorder, { borderColor: selectedMood.accent }]}>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80' }} 
                style={styles.avatar} 
              />
            </View>
          </View>
        </Animated.View>

        {/* MOTIVATIONAL STATEMENT */}
        <Animated.View entering={FadeInDown.delay(100).duration(800).springify()} style={styles.quoteCard}>
          <Text style={styles.quoteText}>
            Votre esprit est calme aujourd'hui. Laissez votre garde-robe refléter cette douce sérénité.
          </Text>
        </Animated.View>

        {/* METRICS CARD (Glassmorphism Double Panel) */}
        <Animated.View entering={FadeInDown.delay(200).duration(800).springify()}>
          <View style={styles.glassWrapper}>
            <BlurView intensity={80} tint="light" style={styles.glassCard}>
              <View style={styles.statsContainer}>
                
                {/* Left Panel: Streak */}
                <View style={styles.statBox}>
                  <View style={[styles.statIconFrame, { backgroundColor: selectedMood.accent + '20' }]}>
                    <MaterialCommunityIcons name="fire" size={24} color={selectedMood.accent} />
                  </View>
                  <View style={styles.statTextColumn}>
                    <Text numberOfLines={1} style={styles.statLabel}>SÉRIE</Text>
                    <Text numberOfLines={1} style={styles.statValue}>12 Jours</Text>
                    <Text numberOfLines={1} style={styles.statSub}>+1 aujourd'hui</Text>
                  </View>
                </View>

                <View style={styles.divider} />

                {/* Right Panel: Weather */}
                <View style={styles.statBox}>
                  <View style={[styles.statIconFrame, { backgroundColor: '#E0F2FE' }]}>
                    <Feather name="cloud-drizzle" size={22} color="#0284C7" />
                  </View>
                  <View style={styles.statTextColumn}>
                    <Text numberOfLines={1} style={styles.statLabel}>MÉTÉO</Text>
                    <Text numberOfLines={1} style={styles.statValue}>18°C</Text>
                    <Text numberOfLines={1} style={styles.statSub}>Pluie légère</Text>
                  </View>
                </View>

              </View>
            </BlurView>
          </View>
        </Animated.View>

        {/* INTERACTIVE MOOD PICKER */}
        <Animated.View entering={FadeInDown.delay(300).duration(800).springify()} style={styles.moodSection}>
          <Text style={styles.sectionTitle}>Votre humeur instantanée</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.moodScroll}
          >
            {MOODS.map((mood) => {
              const active = selectedMood.id === mood.id;
              return (
                <Pressable
                  key={mood.id}
                  onPress={() => setSelectedMood(mood)}
                  style={[
                    styles.moodBubble,
                    { backgroundColor: mood.bg },
                    active && { borderColor: mood.accent, borderWidth: 2, transform: [{ scale: 1.05 }] }
                  ]}
                >
                  <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                  <Text style={[styles.moodName, active && { fontWeight: '800', color: '#1E1E2C' }]}>
                    {mood.name}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </Animated.View>

        {/* MASSIVE LUXURY AI CALL-TO-ACTION */}
        <Animated.View entering={FadeInDown.delay(400).duration(800).springify()} style={styles.generatorShadow}>
          <LinearGradient
            colors={['#7F00FF', '#E100FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.generatorGradient}
          >
            <Pressable style={styles.generatorAction} onPress={handleStartQuiz}>
              <View style={styles.generatorLeft}>
                <View style={styles.crystalBadge}>
                  <Text style={styles.crystalText}>GEMINI POWERED</Text>
                </View>
                <Text style={styles.generatorTitle}>Style mon Humeur</Text>
                <Text style={styles.generatorSub}>Créer une tenue & playlist sur-mesure</Text>
              </View>
              <View style={styles.sparkleOrb}>
                <Ionicons name="sparkles" size={24} color="#7F00FF" />
              </View>
            </Pressable>
          </LinearGradient>
        </Animated.View>

        {/* PREMIUM SCAN MY STYLE CTA CARD */}
        <Animated.View entering={FadeInDown.delay(450).duration(800).springify()} style={styles.generatorShadow}>
          <LinearGradient
            colors={['#111827', '#1E293B']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.generatorGradient, { borderWidth: 1, borderColor: '#00C6FF30' }]}
          >
            <Pressable style={styles.generatorAction} onPress={handleScanStyle}>
              <View style={styles.generatorLeft}>
                <View style={[styles.crystalBadge, { backgroundColor: '#00C6FF25' }]}>
                  <Text style={[styles.crystalText, { color: '#00C6FF' }]}>MULTIMODAL IA</Text>
                </View>
                <Text style={styles.generatorTitle}>Scanner mon Style 📷</Text>
                <Text style={styles.generatorSub}>Prendre un selfie pour analyser votre colorimétrie & look</Text>
              </View>
              <View style={[styles.sparkleOrb, { backgroundColor: '#00C6FF15', borderWidth: 1, borderColor: '#00C6FF' }]}>
                <Ionicons name="camera" size={24} color="#00C6FF" />
              </View>
            </Pressable>
          </LinearGradient>
        </Animated.View>

        {/* GLASS MUSIC PLAYER (Ultimate Luxury Detail) */}
        <Animated.View entering={FadeInDown.delay(500).duration(800).springify()} style={styles.playerShadow}>
          <View style={styles.playerGlassWrapper}>
            <BlurView intensity={60} tint="light" style={styles.playerCard}>
              <View style={styles.playerRow}>
                <Image 
                  source={{ uri: 'https://images.unsplash.com/photo-1614680376593-902f74fa0d41?w=400&q=80' }} 
                  style={styles.albumArt} 
                />
                <View style={styles.playerMeta}>
                  <Text numberOfLines={1} style={styles.playerTitle}>Symphonie Printanière</Text>
                  <Text numberOfLines={1} style={styles.playerArtist}>Lofi Relaxation Collective</Text>
                  <View style={styles.playerProgressBg}>
                    <View style={[styles.playerProgressFill, { width: '45%', backgroundColor: selectedMood.accent }]} />
                  </View>
                </View>
                <Pressable onPress={() => setIsPlaying(!isPlaying)} style={[styles.playButton, { backgroundColor: selectedMood.accent }]}>
                  <Ionicons name={isPlaying ? "pause" : "play"} size={18} color="#FFF" />
                </Pressable>
              </View>
            </BlurView>
          </View>
        </Animated.View>

        {/* BADGES PROGRESSION */}
        <Animated.View entering={FadeInDown.delay(600).duration(800).springify()} style={styles.badgeSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Objectifs du Mois</Text>
            <Text style={[styles.seeAllText, { color: selectedMood.accent }]}>3/8 validés</Text>
          </View>
          <View style={styles.badgeBoxShadow}>
            <BlurView intensity={40} tint="light" style={styles.badgeCard}>
              <View style={styles.badgeRow}>
                <View style={styles.badgeIcon}>
                  <Text style={styles.badgeEmojiLarge}>💎</Text>
                </View>
                <View style={styles.badgeInfoColumn}>
                  <Text style={styles.badgeName}>Semaine Parfaite</Text>
                  <Text style={styles.badgeProgressText}>5 check-ins consécutifs sur 7</Text>
                  <View style={styles.badgeProgressBarBg}>
                    <View style={[styles.badgeProgressBarFill, { width: '70%', backgroundColor: selectedMood.accent }]} />
                  </View>
                </View>
              </View>
            </BlurView>
          </View>
        </Animated.View>

        {/* DAILY BEAUTIFUL LOOK PREVIEW */}
        <Animated.View entering={FadeInDown.delay(700).duration(800).springify()}>
          <Text style={styles.sectionTitle}>Proposition Vedette</Text>
          <View style={styles.cardShowcase}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&q=80' }} 
              style={styles.showcaseImage} 
            />
            <View style={styles.showcaseGlassContainer}>
              <BlurView intensity={90} tint="light" style={styles.showcaseGlass}>
                <View style={styles.showcaseMetaRow}>
                  <View>
                    <Text style={[styles.showcaseTag, { color: selectedMood.accent }]}>LOOK DU JOUR</Text>
                    <Text style={styles.showcaseTitle}>Manteau d'Automne Léger</Text>
                  </View>
                  <Pressable style={styles.showcaseHeart}>
                    <Ionicons name="heart" size={20} color="#FF6B6B" />
                  </Pressable>
                </View>
              </BlurView>
            </View>
          </View>
        </Animated.View>

      </ScrollView>

      {/* AI Visual Scan Loading Overlay */}
      <Modal visible={isScanning} transparent animationType="fade">
        <View style={styles.loaderOverlay}>
          <BlurView intensity={90} tint="dark" style={styles.loaderGlass}>
            <ActivityIndicator size="large" color="#00C6FF" />
            <Text style={styles.loaderTitle}>Analyse Visuelle Gemini...</Text>
            <Text style={styles.loaderSub}>L'intelligence artificielle analyse votre look, votre morphologie et colorimétrie pour générer votre tenue et playlist idéales.</Text>
          </BlurView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFCFF',
  },
  orb: {
    position: 'absolute',
    borderRadius: 150,
  },
  orb1: {
    top: -40,
    right: -40,
    width: 280,
    height: 280,
  },
  orb2: {
    bottom: 250,
    left: -80,
    width: 240,
    height: 240,
  },
  scrollContent: {
    paddingTop: 70,
    paddingHorizontal: 22,
    paddingBottom: 130,
  },
  // Brand header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  brandTitle: {
    fontSize: 10,
    fontWeight: '900',
    color: '#8A8A9E',
    letterSpacing: 4,
    marginBottom: 6,
  },
  greeting: {
    fontSize: 26,
    fontWeight: '300',
    color: '#1E1E2C',
    letterSpacing: -0.5,
  },
  userName: {
    fontWeight: '800',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  freezeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
  },
  freezeIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  avatarBorder: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#FFF',
    padding: 2,
    borderWidth: 2,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  // Daily Quote card
  quoteCard: {
    marginBottom: 26,
    paddingHorizontal: 4,
  },
  quoteText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#7C7C8E',
    lineHeight: 20,
    fontWeight: '500',
  },
  // Double stats card
  glassWrapper: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.04,
    shadowRadius: 20,
    elevation: 3,
    marginBottom: 30,
  },
  glassCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
  },
  statBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statIconFrame: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statTextColumn: {
    flex: 1,
    justifyContent: 'center',
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: '#8A8A9E',
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E1E2C',
  },
  statSub: {
    fontSize: 10,
    color: '#A0A0B0',
    marginTop: 1,
  },
  divider: {
    width: 1,
    height: 36,
    backgroundColor: 'rgba(0,0,0,0.06)',
    marginHorizontal: 12,
  },
  // Mood Picker
  moodSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E1E2C',
    marginBottom: 14,
    letterSpacing: -0.3,
  },
  moodScroll: {
    gap: 10,
  },
  moodBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 18,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  moodEmoji: {
    fontSize: 18,
  },
  moodName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6A6A7A',
  },
  // AI Generator card
  generatorShadow: {
    marginBottom: 30,
    shadowColor: '#7F00FF',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  generatorGradient: {
    borderRadius: 24,
  },
  generatorAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 22,
  },
  generatorLeft: {
    flex: 1,
  },
  crystalBadge: {
    backgroundColor: 'rgba(255,255,255,0.22)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  crystalText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  generatorTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFF',
    marginBottom: 4,
  },
  generatorSub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '500',
  },
  sparkleOrb: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  // Music Player card
  playerShadow: {
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.04,
    shadowRadius: 15,
  },
  playerGlassWrapper: {
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
  },
  playerCard: {
    backgroundColor: 'rgba(255,255,255,0.4)',
    padding: 14,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  albumArt: {
    width: 54,
    height: 54,
    borderRadius: 12,
  },
  playerMeta: {
    flex: 1,
    justifyContent: 'center',
  },
  playerTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E1E2C',
    marginBottom: 2,
  },
  playerArtist: {
    fontSize: 11,
    color: '#8A8A9E',
    marginBottom: 8,
  },
  playerProgressBg: {
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(0,0,0,0.05)',
    width: '90%',
  },
  playerProgressFill: {
    height: 4,
    borderRadius: 2,
  },
  playButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  // Badges progression
  badgeSection: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '700',
  },
  badgeBoxShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.03,
    shadowRadius: 15,
  },
  badgeCard: {
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.7)',
    padding: 16,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  badgeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)',
  },
  badgeEmojiLarge: {
    fontSize: 22,
  },
  badgeInfoColumn: {
    flex: 1,
  },
  badgeName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E1E2C',
    marginBottom: 2,
  },
  badgeProgressText: {
    fontSize: 11,
    color: '#8A8A9E',
    marginBottom: 6,
  },
  badgeProgressBarBg: {
    height: 5,
    borderRadius: 2.5,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  badgeProgressBarFill: {
    height: 5,
    borderRadius: 2.5,
  },
  // Showcase Card
  cardShowcase: {
    height: 280,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 15,
    elevation: 4,
  },
  showcaseImage: {
    width: '100%',
    height: '100%',
  },
  showcaseGlassContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 14,
  },
  showcaseGlass: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.7)',
  },
  showcaseMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  showcaseTag: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  showcaseTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1E1E2C',
  },
  showcaseHeart: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  loaderOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loaderGlass: {
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
    backgroundColor: 'rgba(26, 27, 47, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  loaderTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFF',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  loaderSub: {
    fontSize: 12,
    color: '#A0A0B0',
    textAlign: 'center',
    lineHeight: 18,
    fontWeight: '500',
  },
});
