import React, { useState } from 'react';
import {
  View, Text, StyleSheet, Pressable, StatusBar, ActivityIndicator,
  ScrollView, Dimensions, Modal, Platform, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons, Feather } from '@expo/vector-icons';
import Animated, { FadeInUp, FadeInDown, FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { API_URL } from '../constants/Api';

const { width } = Dimensions.get('window');

// Emotion palette for dynamic theming
const EMOTION_THEMES: Record<string, { gradient: [string, string]; accent: string; icon: string }> = {
  'Joie':        { gradient: ['#FDE68A', '#F59E0B'], accent: '#F59E0B', icon: 'sunny' },
  'Enthousiasme':{ gradient: ['#FDE68A', '#F59E0B'], accent: '#F59E0B', icon: 'sunny' },
  'Rayonnant':   { gradient: ['#FCD34D', '#F97316'], accent: '#F97316', icon: 'star' },
  'Fierté':      { gradient: ['#C4B5FD', '#7C3AED'], accent: '#7C3AED', icon: 'trophy' },
  'Confiance':   { gradient: ['#C4B5FD', '#7C3AED'], accent: '#7C3AED', icon: 'shield-checkmark' },
  'Sérénité':    { gradient: ['#A7F3D0', '#10B981'], accent: '#10B981', icon: 'leaf' },
  'Paix':        { gradient: ['#A7F3D0', '#10B981'], accent: '#10B981', icon: 'leaf' },
  'Concentration':{ gradient: ['#93C5FD', '#3B82F6'], accent: '#3B82F6', icon: 'eye' },
  'Focus':       { gradient: ['#93C5FD', '#3B82F6'], accent: '#3B82F6', icon: 'eye' },
  'Pensif':      { gradient: ['#C7D2FE', '#6366F1'], accent: '#6366F1', icon: 'cloudy-night' },
  'Méditatif':   { gradient: ['#C7D2FE', '#6366F1'], accent: '#6366F1', icon: 'cloudy-night' },
  'Fatigue':     { gradient: ['#FED7AA', '#EA580C'], accent: '#EA580C', icon: 'moon' },
  'Épuisement':  { gradient: ['#FED7AA', '#EA580C'], accent: '#EA580C', icon: 'moon' },
  'Stress':      { gradient: ['#FECACA', '#EF4444'], accent: '#EF4444', icon: 'thunderstorm' },
  'Anxiété':     { gradient: ['#FECACA', '#EF4444'], accent: '#EF4444', icon: 'thunderstorm' },
  'Ennui':       { gradient: ['#E5E7EB', '#6B7280'], accent: '#6B7280', icon: 'ellipsis-horizontal' },
  'Lassitude':   { gradient: ['#E5E7EB', '#6B7280'], accent: '#6B7280', icon: 'ellipsis-horizontal' },
  'Surprise':    { gradient: ['#FDE68A', '#EC4899'], accent: '#EC4899', icon: 'flash' },
  'Étonnement':  { gradient: ['#FDE68A', '#EC4899'], accent: '#EC4899', icon: 'flash' },
  'Confusion':   { gradient: ['#DDD6FE', '#8B5CF6'], accent: '#8B5CF6', icon: 'help-circle' },
  'Hésitation':  { gradient: ['#DDD6FE', '#8B5CF6'], accent: '#8B5CF6', icon: 'help-circle' },
};

const DEFAULT_THEME = { gradient: ['#FF6B6B', '#FF8E53'] as [string, string], accent: '#FF6B6B', icon: 'pulse' };

function getEmotionTheme(emotion: string) {
  // Try exact match first, then partial
  if (EMOTION_THEMES[emotion]) return EMOTION_THEMES[emotion];
  const key = Object.keys(EMOTION_THEMES).find(k => emotion.toLowerCase().includes(k.toLowerCase()));
  return key ? EMOTION_THEMES[key] : DEFAULT_THEME;
}

export default function SentimentsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // States
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleTakeSelfie = async () => {
    if (Platform.OS === 'web') {
      launchCapture(false);
      return;
    }

    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    const libraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!cameraPermission.granted || !libraryPermission.granted) {
      Alert.alert("Permissions", "L'accès à l'appareil photo est requis pour l'analyse sentimentale.");
      return;
    }

    Alert.alert(
      "Analyse Sentimentale",
      "Pour une analyse précise, prenez un selfie bien éclairé de face.",
      [
        { text: "Appareil Photo", onPress: () => launchCapture(true) },
        { text: "Galerie", onPress: () => launchCapture(false) },
        { text: "Annuler", style: "cancel" },
      ]
    );
  };

  const launchCapture = async (isCamera: boolean) => {
    try {
      const options: ImagePicker.ImagePickerOptions = {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.6,
        base64: true,
      };

      const pickerResult = isCamera
        ? await ImagePicker.launchCameraAsync(options)
        : await ImagePicker.launchImageLibraryAsync(options);

      if (pickerResult.canceled || !pickerResult.assets || pickerResult.assets.length === 0) return;

      const asset = pickerResult.assets[0];
      if (!asset.base64) return;

      setIsAnalyzing(true);
      setResult(null);

      const token = await AsyncStorage.getItem('token');
      if (!token) {
        setIsAnalyzing(false);
        router.push('/auth');
        return;
      }

      const response = await fetch(`${API_URL}/sentiments/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          base64Image: asset.base64,
          mimeType: asset.mimeType || 'image/jpeg',
        }),
      });

      const resData = await response.json();
      setIsAnalyzing(false);

      if (!response.ok) {
        Alert.alert("Erreur", resData.message || "Analyse impossible.");
        return;
      }

      if (resData.isFaceValid === false) {
        Alert.alert("Visage Non Détecté", resData.errorAlert);
        return;
      }

      setResult(resData);
    } catch (err) {
      setIsAnalyzing(false);
      Alert.alert("Erreur", "Une anomalie s'est produite lors de l'analyse.");
    }
  };

  const theme = result ? getEmotionTheme(result.dominantEmotion) : DEFAULT_THEME;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Ambient Background */}
      <View style={StyleSheet.absoluteFill}>
        <LinearGradient
          colors={result ? [theme.gradient[0] + '40', theme.gradient[1] + '20'] : ['#FFF0F2', '#FFE4E6']}
          style={StyleSheet.absoluteFillObject}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <View style={[styles.orbTopRight, result && { backgroundColor: theme.accent }]} />
        <View style={[styles.orbBottomLeft, result && { backgroundColor: theme.gradient[0] }]} />
        <BlurView intensity={70} tint="light" style={StyleSheet.absoluteFillObject} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <Animated.View entering={FadeInUp.duration(800).springify()} style={styles.header}>
          <Pressable style={styles.closeBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#111827" />
          </Pressable>
          <View style={styles.headerCenter}>
            <Text style={styles.headerSubtitle}>MODULE D'ANALYSE</Text>
            <Text style={styles.headerTitle}>Sentiments</Text>
          </View>
          <View style={styles.placeholderBtn} />
        </Animated.View>

        {!result ? (
          /* ==================== INITIAL STATE: INVITE SELFIE ==================== */
          <Animated.View entering={FadeInDown.delay(200).duration(800).springify()} style={styles.centerBox}>
            <View style={styles.iconBadge}>
              <Ionicons name="pulse" size={40} color="#FF6B6B" />
            </View>
            <Text style={styles.title}>Analyse Émotionnelle</Text>
            <Text style={styles.subtitle}>
              Prenez un selfie et laissez notre IA décoder vos micro-expressions faciales pour révéler votre état émotionnel profond.
            </Text>

            {/* CTA Button */}
            <Pressable style={styles.captureBtn} onPress={handleTakeSelfie}>
              <LinearGradient
                colors={['#FF6B6B', '#FF8E53']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.captureBtnGradient}
              >
                <Ionicons name="camera" size={22} color="#FFF" style={{ marginRight: 10 }} />
                <Text style={styles.captureBtnText}>Scanner mon Aura</Text>
              </LinearGradient>
            </Pressable>

            {/* Feature Highlights */}
            <View style={styles.featureList}>
              {[
                { icon: 'eye-outline', text: 'Lecture des micro-expressions' },
                { icon: 'analytics-outline', text: 'Dosage émotionnel en %' },
                { icon: 'sparkles-outline', text: 'Conseil Aura personnalisé' },
              ].map((feat, idx) => (
                <View key={idx} style={styles.featureRow}>
                  <Ionicons name={feat.icon as any} size={18} color="#FF6B6B" />
                  <Text style={styles.featureText}>{feat.text}</Text>
                </View>
              ))}
            </View>
          </Animated.View>
        ) : (
          /* ==================== RESULT STATE: ANALYSIS REPORT ==================== */
          <>
            {/* VERDICT CARD */}
            <Animated.View entering={FadeInDown.delay(100).duration(800).springify()} style={styles.verdictCardShadow}>
              <View style={styles.verdictCard}>
                <LinearGradient colors={theme.gradient} style={StyleSheet.absoluteFillObject} />

                <View style={styles.verdictHeader}>
                  <View style={styles.emotionIconBadge}>
                    <Ionicons name={theme.icon as any} size={28} color="#FFF" />
                  </View>
                  <View style={styles.emotionLabelWrap}>
                    <Text style={styles.emotionLabelSmall}>ÉMOTION DOMINANTE</Text>
                    <Text style={styles.emotionLabelBig}>{result.dominantEmotion}</Text>
                  </View>
                </View>

                <View style={styles.verdictDivider} />

                <Text style={styles.verdictText}>
                  "{result.verdict}"
                </Text>
              </View>
            </Animated.View>

            {/* INDICATORS BARS */}
            <Animated.View entering={FadeInDown.delay(250).duration(800).springify()} style={styles.section}>
              <Text style={styles.sectionTitle}>Indicateurs Clés</Text>
              <View style={styles.indicatorsList}>
                {result.indicators?.map((ind: any, idx: number) => {
                  const indTheme = getEmotionTheme(ind.label);
                  return (
                    <Animated.View key={idx} entering={FadeIn.delay(300 + idx * 100).duration(500)} style={styles.indicatorRow}>
                      <View style={styles.indicatorLabelRow}>
                        <Text style={styles.indicatorLabel}>{ind.label}</Text>
                        <Text style={[styles.indicatorPercent, { color: indTheme.accent }]}>{ind.percentage}%</Text>
                      </View>
                      <View style={styles.progressBarBg}>
                        <View
                          style={[
                            styles.progressBarFill,
                            { width: `${ind.percentage}%`, backgroundColor: indTheme.accent },
                          ]}
                        />
                      </View>
                    </Animated.View>
                  );
                })}
              </View>
            </Animated.View>

            {/* FACIAL READING */}
            <Animated.View entering={FadeInDown.delay(400).duration(800).springify()} style={styles.section}>
              <Text style={styles.sectionTitle}>Lecture Faciale</Text>
              <View style={styles.readingCard}>
                <Ionicons name="eye" size={20} color={theme.accent} style={{ marginBottom: 12 }} />
                <Text style={styles.readingText}>{result.facialReading}</Text>
              </View>
            </Animated.View>

            {/* CONSEIL AURA */}
            <Animated.View entering={FadeInDown.delay(500).duration(800).springify()} style={styles.section}>
              <Text style={styles.sectionTitle}>Conseil Aura ✨</Text>
              <View style={[styles.conseilCard, { borderColor: theme.accent + '30' }]}>
                <LinearGradient
                  colors={[theme.gradient[0] + '15', theme.gradient[1] + '08']}
                  style={StyleSheet.absoluteFillObject}
                />
                <Ionicons name="sparkles" size={20} color={theme.accent} style={{ marginBottom: 12 }} />
                <Text style={styles.conseilText}>{result.conseilAura}</Text>
              </View>
            </Animated.View>

            {/* ACTION BUTTONS */}
            <Animated.View entering={FadeInDown.delay(600).duration(800).springify()} style={styles.actionsRow}>
              <Pressable style={styles.retryBtn} onPress={handleTakeSelfie}>
                <Ionicons name="refresh" size={20} color="#111827" style={{ marginRight: 8 }} />
                <Text style={styles.retryBtnText}>Nouvelle Analyse</Text>
              </Pressable>

              <Pressable
                style={[styles.doneBtn, { backgroundColor: theme.accent }]}
                onPress={() => router.replace('/(tabs)')}
              >
                <Text style={styles.doneBtnText}>Terminer</Text>
              </Pressable>
            </Animated.View>
          </>
        )}
      </ScrollView>

      {/* LUXURY ANALYZING LOADER */}
      <Modal visible={isAnalyzing} transparent animationType="fade">
        <View style={styles.loaderOverlay}>
          <BlurView intensity={100} tint="dark" style={styles.loaderGlass}>
            <View style={styles.loaderPulse}>
              <Ionicons name="pulse" size={36} color="#FF6B6B" />
            </View>
            <ActivityIndicator size="large" color="#FFF" style={{ marginBottom: 20 }} />
            <Text style={styles.loaderTitle}>Décodage Émotionnel...</Text>
            <Text style={styles.loaderSub}>L'IA analyse vos micro-expressions faciales avec précision.</Text>
          </BlurView>
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
  orbTopRight: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 999,
    backgroundColor: '#FFC0CB',
    top: -80,
    right: -80,
    opacity: 0.6,
  },
  orbBottomLeft: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 999,
    backgroundColor: '#FF8E53',
    bottom: -60,
    left: -80,
    opacity: 0.3,
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
    borderWidth: 1,
    borderColor: '#F3F4F6',
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

  // ========== INITIAL STATE ==========
  centerBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  iconBadge: {
    width: 80,
    height: 80,
    borderRadius: 28,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 36,
    paddingHorizontal: 16,
  },
  captureBtn: {
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 5,
    marginBottom: 40,
  },
  captureBtnGradient: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  captureBtnText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFF',
  },
  featureList: {
    width: '100%',
    gap: 16,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(255,255,255,0.6)',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,107,107,0.1)',
  },
  featureText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
  },

  // ========== RESULT STATE ==========
  verdictCardShadow: {
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.15,
    shadowRadius: 32,
    elevation: 8,
    marginBottom: 32,
  },
  verdictCard: {
    borderRadius: 32,
    padding: 28,
    overflow: 'hidden',
  },
  verdictHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
  },
  emotionIconBadge: {
    width: 56,
    height: 56,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  emotionLabelWrap: {
    flex: 1,
  },
  emotionLabelSmall: {
    fontSize: 10,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  emotionLabelBig: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: -0.5,
  },
  verdictDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginBottom: 20,
  },
  verdictText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFF',
    lineHeight: 24,
    fontStyle: 'italic',
  },

  // Indicators
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.5,
    marginBottom: 16,
  },
  indicatorsList: {
    gap: 16,
  },
  indicatorRow: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  indicatorLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  indicatorLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  indicatorPercent: {
    fontSize: 18,
    fontWeight: '800',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },

  // Facial Reading
  readingCard: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  readingText: {
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 24,
    fontWeight: '500',
  },

  // Conseil Aura
  conseilCard: {
    borderRadius: 24,
    padding: 24,
    overflow: 'hidden',
    borderWidth: 1,
  },
  conseilText: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 24,
    fontWeight: '500',
  },

  // Actions
  actionsRow: {
    gap: 12,
    marginTop: 8,
  },
  retryBtn: {
    height: 56,
    flexDirection: 'row',
    borderRadius: 20,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  retryBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  doneBtn: {
    height: 60,
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
  loaderPulse: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,107,107,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
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
});
