import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Pressable, StatusBar, ActivityIndicator,
  ScrollView, Dimensions, Modal, Platform, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons, Feather } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import Animated, {
  FadeInUp, FadeInDown, FadeIn,
  useSharedValue, useAnimatedStyle, withTiming
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';
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
  if (!emotion) return DEFAULT_THEME;
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

  // Pre-Selection & Voice States
  const [selectedPreMood, setSelectedPreMood] = useState<string | null>(null);
  const [isVoiceMode, setIsVoiceMode] = useState(false);

  // Voice recording states
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordDuration, setRecordDuration] = useState(0);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const durationInterval = useRef<NodeJS.Timeout | null>(null);

  // New States for History, Comparison, and Remedies
  const [history, setHistory] = useState<any[]>([]);
  const [comparison, setComparison] = useState<any>(null);
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);

  // Breathing remedy states
  const [selectedExercise, setSelectedExercise] = useState<'breathing' | 'meditation'>('breathing');
  const [isBreathingVisible, setIsBreathingVisible] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<'inspire' | 'retenez' | 'expire'>('inspire');
  const [breathingTimer, setBreathingTimer] = useState(60);
  const [isBreathingActive, setIsBreathingActive] = useState(false);

  // Guided Meditation states
  const [isMeditationVisible, setIsMeditationVisible] = useState(false);
  const [meditationTimer, setMeditationTimer] = useState(120);
  const [isMeditationActive, setIsMeditationActive] = useState(false);
  const [meditationPhase, setMeditationPhase] = useState<'ancrage' | 'observation' | 'gratitude' | 'harmonisation'>('ancrage');
  // Positive Affirmations states
  const [currentAffirmation, setCurrentAffirmation] = useState('');

  // Animated breathing circle scale
  const scale = useSharedValue(1);

  const soundRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(() => {});
      }
      if (durationInterval.current) {
        clearInterval(durationInterval.current);
      }
    };
  }, []);

  // Fetch History and Comparison from backend
  const fetchHistoryAndComparison = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;

      const histRes = await fetch(`${API_URL}/sentiments/history`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (histRes.ok) {
        const histData = await histRes.json();
        setHistory(histData);
      }

      const compRes = await fetch(`${API_URL}/sentiments/comparison`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (compRes.ok) {
        const compData = await compRes.json();
        setComparison(compData);
      }
    } catch (err) {
      console.log('Error fetching history/comparison:', err);
    }
  };

  useEffect(() => {
    fetchHistoryAndComparison();
  }, [result]);

  useEffect(() => {
    const checkPremium = async () => {
      try {
        const userStr = await AsyncStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : null;
        
        let isPremiumRequired = false;
        try {
          const configRes = await fetch(`${API_URL}/system-config`);
          if (configRes.ok) {
            const data = await configRes.json();
            isPremiumRequired = !!data.isSentimentsPremium;
            await AsyncStorage.setItem('system_config', JSON.stringify(data));
          } else {
            const cached = await AsyncStorage.getItem('system_config');
            if (cached) isPremiumRequired = !!JSON.parse(cached).isSentimentsPremium;
          }
        } catch (_) {
          const cached = await AsyncStorage.getItem('system_config');
          if (cached) isPremiumRequired = !!JSON.parse(cached).isSentimentsPremium;
        }

        if (isPremiumRequired && (!user || user.plan !== 'PREMIUM')) {
          setTimeout(() => {
            Alert.alert(
              "👑 Analyse Émotionnelle Premium",
              "L'Analyse Sentimentale & Vocale IA est réservée aux membres Aura Premium.",
              [
                { text: "Devenir Premium 👑", onPress: () => router.replace('/(tabs)/two') },
                { text: "Retour", onPress: () => {
                  if (router.canGoBack()) {
                    router.back();
                  } else {
                    router.replace('/(tabs)');
                  }
                }, style: "cancel" }
              ],
              { cancelable: false }
            );
          }, 150);
        }
      } catch (err) {
        console.log('Error verifying sentiments access:', err);
      }
    };
    checkPremium();
  }, []);

  // Breathing Reanimated scale transition
  useEffect(() => {
    if (isBreathingActive) {
      if (breathingPhase === 'inspire') {
        scale.value = withTiming(1.5, { duration: 4000 });
      } else if (breathingPhase === 'retenez') {
        scale.value = withTiming(1.6, { duration: 2000 });
      } else {
        scale.value = withTiming(1.0, { duration: 4000 });
      }
    } else {
      scale.value = withTiming(1.0, { duration: 500 });
    }
  }, [breathingPhase, isBreathingActive]);

  const breathingCircleStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  // Breathing timer counting down (1s interval)
  useEffect(() => {
    let timerInterval: any;
    if (isBreathingActive && breathingTimer > 0) {
      timerInterval = setInterval(() => {
        setBreathingTimer(prev => {
          if (prev <= 1) {
            setIsBreathingActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerInterval);
  }, [isBreathingActive]);

  // Breathing phase switcher (4s interval)
  useEffect(() => {
    let phaseInterval: any;
    if (isBreathingActive) {
      phaseInterval = setInterval(() => {
        setBreathingPhase(prev => {
          if (prev === 'inspire') return 'retenez';
          if (prev === 'retenez') return 'expire';
          return 'inspire';
        });
      }, 4000);
    }
    return () => clearInterval(phaseInterval);
  }, [isBreathingActive]);

  // Meditation timer counting down (1s interval)
  useEffect(() => {
    let timerInterval: any;
    if (isMeditationActive && meditationTimer > 0) {
      timerInterval = setInterval(() => {
        setMeditationTimer(prev => {
          if (prev <= 1) {
            setIsMeditationActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerInterval);
  }, [isMeditationActive]);

  // Meditation phase switcher (30s interval for 4 phases in 120s)
  useEffect(() => {
    let phaseInterval: any;
    if (isMeditationActive) {
      phaseInterval = setInterval(() => {
        setMeditationPhase(prev => {
          if (prev === 'ancrage') return 'observation';
          if (prev === 'observation') return 'gratitude';
          if (prev === 'gratitude') return 'harmonisation';
          return 'ancrage';
        });
      }, 30000);
    }
    return () => clearInterval(phaseInterval);
  }, [isMeditationActive]);

  const AFFIRMATIONS: Record<string, string[]> = {
    calm: [
      "Je libère toute tension de mon corps et choisis le calme ici et maintenant.",
      "Chaque défi que je traverse me rapproche de ma paix intérieure.",
      "Je fais de mon mieux, et cela est amplement suffisant.",
      "Mon esprit s'apaise à chaque respiration profonde.",
      "Je suis en sécurité et en pleine possession de mes moyens."
    ],
    comfort: [
      "Mes émotions sont valides, et je m'accorde la douceur nécessaire.",
      "Après la pluie vient le beau temps; ma lumière intérieure brillera à nouveau.",
      "Je suis digne d'amour, de paix et de bonheur infini.",
      "Je m'autorise à ralentir et à me ressourcer en douceur.",
      "Chaque jour est un nouveau départ plein de promesses."
    ],
    joy: [
      "Mon énergie positive rayonne autour de moi et inspire les autres.",
      "Je saisis toutes les belles opportunités de ma journée.",
      "Je crois pleinement en mon potentiel et en ma réussite.",
      "Je célèbre chaque petit succès avec joie et fierté.",
      "Ma vie est remplie d'abondance, de rires et de gratitude."
    ]
  };

  const handleNextAffirmation = (emotion: string) => {
    const lower = (emotion || '').toLowerCase();
    let category = 'joy';
    if (lower.includes('stress') || lower.includes('anxi') || lower.includes('fatig') || lower.includes('épuis') || lower.includes('lassi') || lower.includes('ennui')) {
      category = 'calm';
    } else if (lower.includes('trist') || lower.includes('mélan') || lower.includes('pensif') || lower.includes('médit') || lower.includes('confus')) {
      category = 'comfort';
    }
    const list = AFFIRMATIONS[category];
    const randomIndex = Math.floor(Math.random() * list.length);
    setCurrentAffirmation(list[randomIndex]);
  };

  useEffect(() => {
    if (result) {
      handleNextAffirmation(result.dominantEmotion);
    }
  }, [result]);

  const handleStartMeditation = () => {
    setMeditationTimer(120);
    setMeditationPhase('ancrage');
    setIsMeditationActive(true);
    setIsMeditationVisible(true);
  };

  const handleStartBreathing = () => {
    setBreathingTimer(60);
    setBreathingPhase('inspire');
    setIsBreathingActive(true);
    setIsBreathingVisible(true);
  };



  const loadPastScan = (scan: any) => {
    setResult({
      id: scan.id,
      isFaceValid: true,
      dominantEmotion: scan.dominantEmotion,
      verdict: scan.verdict,
      indicators: scan.indicators,
      facialReading: scan.facialReading,
      conseilAura: scan.conseilAura,
      imageUrl: scan.imageUrl,
      analyzedAt: scan.createdAt,
    });
    setIsHistoryVisible(false);
  };

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
          moodSelected: selectedPreMood || undefined,
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

  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          'Microphone requis',
          "L'accès au microphone est nécessaire pour scanner votre voix. Veuillez l'autoriser dans les réglages de votre appareil."
        );
        return;
      }

      // Configure audio session for recording
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(recording);
      setIsRecording(true);
      setRecordDuration(0);

      // Start duration counter
      durationInterval.current = setInterval(() => {
        setRecordDuration((prev) => prev + 1);
      }, 1000) as any;
    } catch (err) {
      console.error('Failed to start voice recording', err);
      Alert.alert(
        'Erreur Microphone',
        "Impossible de démarrer l'enregistrement vocal."
      );
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    setIsRecording(false);
    if (durationInterval.current) {
      clearInterval(durationInterval.current);
    }

    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      const duration = recordDuration;
      setRecording(null);

      // Restore silent mode playback config after recording is finished
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        playThroughEarpieceAndroid: false,
      });

      if (uri) {
        const fileInfo = await FileSystem.getInfoAsync(uri);
        if (!fileInfo.exists || (fileInfo as any).size < 1000) {
          Alert.alert("Enregistrement vide", "Aucun son détecté. Parlez plus fort ! 😊");
          return;
        }

        if (duration < 2) {
          Alert.alert("Enregistrement court", "Parlez au moins 2 secondes pour décoder votre voix.");
          return;
        }

        processVoiceAudio(uri);
      }
    } catch (err) {
      console.error('Failed to stop recording', err);
    }
  };

  const processVoiceAudio = async (uri: string) => {
    setIsAnalyzing(true);
    setResult(null);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        setIsAnalyzing(false);
        router.push('/auth');
        return;
      }

      // Convert audio file to Base64
      const base64Audio = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const response = await fetch(`${API_URL}/sentiments/analyze-voice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          base64Audio,
          mimeType: 'audio/mp4',
          moodSelected: selectedPreMood || undefined,
        }),
      });

      const resData = await response.json();
      setIsAnalyzing(false);

      if (!response.ok) {
        throw new Error(resData.message || "Impossible d'analyser votre voix.");
      }

      setResult({
        id: resData.id,
        isFaceValid: true,
        dominantEmotion: resData.dominantEmotion,
        verdict: resData.verdict,
        indicators: resData.indicators,
        facialReading: resData.facialReading, // acts as vocal reading
        conseilAura: resData.conseilAura,
        imageUrl: null,
        analyzedAt: resData.analyzedAt,
        isVoiceScan: true,
        transcript: resData.transcript,
      });
    } catch (err: any) {
      setIsAnalyzing(false);
      Alert.alert("Erreur Analyse Vocale", err.message || "Une erreur s'est produite lors de l'envoi de votre voix.");
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
          <Pressable style={styles.historyBtn} onPress={() => setIsHistoryVisible(true)}>
            <Ionicons name="time" size={24} color="#111827" />
          </Pressable>
        </Animated.View>

        {!result ? (
          /* ==================== INITIAL STATE: INVITE SELFIE / VOICE ==================== */
          <Animated.View entering={FadeInDown.delay(200).duration(800).springify()} style={styles.centerBox}>
            <View style={styles.iconBadge}>
              <Ionicons name={isVoiceMode ? "mic" : "pulse"} size={40} color="#FF6B6B" />
            </View>
            <Text style={styles.title}>{isVoiceMode ? "Analyse Vocale Aura" : "Analyse Émotionnelle"}</Text>
            <Text style={styles.subtitle}>
              {isVoiceMode 
                ? "Parlez librement pendant 5 secondes. Notre IA décodera le ton, le rythme et les émotions de votre voix."
                : "Prenez un selfie et laissez notre IA décoder vos micro-expressions faciales pour révéler votre état émotionnel profond."}
            </Text>

            {/* "How do you feel right now?" Pre-Selection */}
            <View style={styles.preSelectionCard}>
              <Text style={styles.preSelectionTitle}>Comment vous sentez-vous en ce moment ?</Text>
              <Text style={styles.preSelectionSubtitle}>Sélectionnez votre humeur actuelle :</Text>
              <View style={styles.preSelectionMoodsRow}>
                {[
                  { emoji: '😌', label: 'Calme' },
                  { emoji: '😄', label: 'Joyeux' },
                  { emoji: '😔', label: 'Fatigué' },
                  { emoji: '🤯', label: 'Stressé' },
                ].map((mood) => {
                  const isActive = selectedPreMood === mood.label;
                  return (
                    <Pressable
                      key={mood.label}
                      style={[
                        styles.preSelectionMoodItem,
                        isActive && styles.preSelectionMoodItemActive
                      ]}
                      onPress={() => setSelectedPreMood(isActive ? null : mood.label)}
                    >
                      <Text style={styles.preSelectionMoodEmoji}>{mood.emoji}</Text>
                      <Text style={[
                        styles.preSelectionMoodLabel,
                        isActive && styles.preSelectionMoodLabelActive
                      ]}>
                        {mood.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Scan Mode Segmented Selector */}
            <View style={styles.scanModeToggleRow}>
              <Pressable
                style={[styles.scanModeToggleBtn, !isVoiceMode && styles.scanModeToggleBtnActive]}
                onPress={() => {
                  if (isRecording) stopRecording();
                  setIsVoiceMode(false);
                }}
              >
                <Ionicons name="camera" size={16} color={!isVoiceMode ? "#FFF" : "#4B5563"} style={{ marginRight: 6 }} />
                <Text style={[styles.scanModeToggleText, !isVoiceMode && styles.scanModeToggleTextActive]}>Selfie Visuel</Text>
              </Pressable>
              
              <Pressable
                style={[styles.scanModeToggleBtn, isVoiceMode && styles.scanModeToggleBtnActive]}
                onPress={() => setIsVoiceMode(true)}
              >
                <Ionicons name="mic" size={16} color={isVoiceMode ? "#FFF" : "#4B5563"} style={{ marginRight: 6 }} />
                <Text style={[styles.scanModeToggleText, isVoiceMode && styles.scanModeToggleTextActive]}>Scanner par la voix</Text>
              </Pressable>
            </View>

            {isVoiceMode ? (
              /* Voice Check-in Recorder Interface */
              <View style={styles.voiceRecorderCard}>
                {isRecording ? (
                  <View style={styles.voiceWaveContainer}>
                    <View style={styles.waveRow}>
                      <View style={[styles.waveBar, { height: 16 }]} />
                      <View style={[styles.waveBar, { height: 32 }]} />
                      <View style={[styles.waveBar, { height: 48 }]} />
                      <View style={[styles.waveBar, { height: 28 }]} />
                      <View style={[styles.waveBar, { height: 40 }]} />
                      <View style={[styles.waveBar, { height: 20 }]} />
                      <View style={[styles.waveBar, { height: 12 }]} />
                    </View>
                    <Text style={styles.voiceDurationText}>
                      Enregistrement en cours... {Math.floor(recordDuration / 60)}:{(recordDuration % 60) < 10 ? '0' : ''}{recordDuration % 60}
                    </Text>
                  </View>
                ) : (
                  <View style={styles.voiceIdleContainer}>
                    <Ionicons name="mic" size={32} color="#8B5CF6" style={{ marginBottom: 8 }} />
                    <Text style={styles.voiceInstructionText}>
                      Maintenez le bouton ci-dessous enfoncé et exprimez-vous à voix haute sur votre état d'esprit...
                    </Text>
                  </View>
                )}

                <Pressable
                  onPressIn={isRecording ? undefined : startRecording}
                  onPressOut={isRecording ? stopRecording : undefined}
                  style={[
                    styles.voiceMicWrapper,
                    isRecording && styles.voiceMicWrapperActive
                  ]}
                >
                  <View style={[styles.voiceMicButton, isRecording && styles.voiceMicButtonActive]}>
                    <Ionicons
                      name={isRecording ? "stop" : "mic"}
                      size={28}
                      color="#FFF"
                    />
                  </View>
                </Pressable>
                
                <Text style={styles.voiceActionHint}>
                  {isRecording ? "Relâchez pour lancer l'analyse" : "Maintenir pour parler"}
                </Text>
              </View>
            ) : (
              /* Visual Selfie Scan Button */
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
            )}

            {/* Feature Highlights */}
            <View style={styles.featureList}>
              {[
                { icon: 'eye-outline', text: isVoiceMode ? 'Analyse de cadence & ton vocal' : 'Lecture des micro-expressions' },
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
            {/* COMPARATIVE WOW BANNER */}
            {selectedPreMood && (
              <Animated.View entering={FadeInDown.delay(50).duration(800).springify()} style={styles.comparisonBannerCard}>
                <LinearGradient
                  colors={['#F5F3FF', '#FAE8FF']}
                  style={StyleSheet.absoluteFillObject}
                />
                <View style={styles.comparisonBannerHeader}>
                  <Ionicons name="sparkles" size={16} color="#8B5CF6" />
                  <Text style={styles.comparisonBannerTitle}>RÉALIGNEMENT ÉMOTIONNEL</Text>
                </View>
                <Text style={styles.comparisonBannerText}>
                  Vous vous sentiez <Text style={{ fontWeight: '800', color: '#7C3AED' }}>{selectedPreMood}</Text> en commençant, mais l'analyse {result.isVoiceScan ? "vocale" : "de vos micro-expressions"} a capté un dosage dominant de <Text style={{ fontWeight: '800', color: '#7C3AED' }}>{result.dominantEmotion}</Text>{result.indicators.some((ind: any) => ind.label.includes('Fatigue') || ind.label.includes('Stress') || ind.label.includes('Trist')) ? " et un soupçon de Fatigue Cachée" : ""}. Réalignons votre Aura ! ✨
                </Text>
              </Animated.View>
            )}

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

            {/* DAILY COMPARISON CARD */}
            {comparison && (
              <Animated.View entering={FadeInDown.delay(320).duration(800).springify()} style={styles.section}>
                <Text style={styles.sectionTitle}>Évolution de l'Aura 📊</Text>
                <View style={styles.comparisonCard}>
                  {comparison.hasComparison ? (
                    <>
                      <Text style={styles.comparisonSub}>
                        Comparé à votre précédent scan ({new Date(comparison.previousScan.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}) :
                      </Text>
                      <View style={styles.comparisonList}>
                        {comparison.changes.map((change: any, idx: number) => {
                          const isUp = change.diff > 0;
                          const absDiff = Math.abs(change.diff);
                          const isPositiveChange = (['Joie', 'Enthousiasme', 'Rayonnant', 'Confiance', 'Fierté', 'Sérénité', 'Paix', 'Focus', 'Concentration'].includes(change.label) && isUp) ||
                                                  (['Stress', 'Anxiété', 'Fatigue', 'Épuisement', 'Ennui', 'Lassitude'].includes(change.label) && !isUp);

                          if (absDiff === 0) return null;

                          return (
                            <View key={idx} style={styles.comparisonRow}>
                              <View style={styles.comparisonLabelWrap}>
                                <Ionicons 
                                  name={isPositiveChange ? "trending-up-outline" : "trending-down-outline"} 
                                  size={18} 
                                  color={isPositiveChange ? "#10B981" : "#EF4444"} 
                                />
                                <Text style={styles.comparisonLabel}>{change.label}</Text>
                              </View>
                              <View style={styles.comparisonDeltaWrap}>
                                <Text style={styles.comparisonPercent}>{change.todayPercentage}%</Text>
                                <Text style={[
                                  styles.comparisonDelta, 
                                  { color: isPositiveChange ? "#10B981" : "#EF4444" }
                                ]}>
                                  {isUp ? '+' : '-'}{absDiff}%
                                </Text>
                              </View>
                            </View>
                          );
                        })}
                      </View>
                    </>
                  ) : (
                    <Text style={styles.comparisonSub}>
                      {comparison.message || "Prenez un autre selfie pour comparer vos résultats avec votre scan précédent ! 😊"}
                    </Text>
                  )}
                </View>
              </Animated.View>
            )}

            {/* FACIAL / VOCAL READING */}
            <Animated.View entering={FadeInDown.delay(400).duration(800).springify()} style={styles.section}>
              <Text style={styles.sectionTitle}>{result.isVoiceScan ? "Décodage Vocal 🎙️" : "Lecture Faciale"}</Text>
              <View style={styles.readingCard}>
                <Ionicons name={result.isVoiceScan ? "mic-outline" : "eye"} size={20} color={theme.accent} style={{ marginBottom: 12 }} />
                {result.isVoiceScan && result.transcript && (
                  <Text style={styles.voiceTranscriptText}>
                    <Text style={{ fontWeight: '700' }}>Transcription :</Text> "{result.transcript}"{"\n"}
                  </Text>
                )}
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
            {/* QUICK EXERCISE REMEDY SECTION */}
            {(() => {
              const isStressOrSad = ['stress', 'anxi', 'fatig', 'épuis', 'trist', 'mélan', 'ennui', 'lassi'].some(
                (e) => result.dominantEmotion?.toLowerCase().includes(e)
              );
              
              return (
                <Animated.View entering={FadeInDown.delay(550).duration(800).springify()} style={styles.section}>
                  <Text style={styles.sectionTitle}>Réalignement de l'Aura 🧘‍♂️</Text>
                  <View style={styles.remedyCard}>
                    <Text style={styles.remedyIntro}>
                      {isStressOrSad 
                        ? "L'IA détecte une tension ou baisse d'énergie. Choisissez votre exercice de réalignement sur mesure :"
                        : "Votre Aura est radieuse ! Sélectionnez un exercice pour amplifier et prolonger ces bonnes vibrations :"}
                    </Text>

                    {/* Premium Segment Toggler for choosing the exercise */}
                    <View style={styles.exerciseToggleRow}>
                      <Pressable
                        style={[
                          styles.exerciseToggleBtn,
                          selectedExercise === 'breathing' && [styles.exerciseToggleBtnActive, { backgroundColor: theme.accent }]
                        ]}
                        onPress={() => setSelectedExercise('breathing')}
                      >
                        <Ionicons 
                          name="leaf" 
                          size={16} 
                          color={selectedExercise === 'breathing' ? "#FFF" : "#4B5563"} 
                          style={{ marginRight: 6 }} 
                        />
                        <Text style={[
                          styles.exerciseToggleText,
                          selectedExercise === 'breathing' && styles.exerciseToggleTextActive
                        ]}>
                          Respiration
                        </Text>
                      </Pressable>
                      
                      <Pressable
                        style={[
                          styles.exerciseToggleBtn,
                          selectedExercise === 'meditation' && [styles.exerciseToggleBtnActive, { backgroundColor: '#8B5CF6' }]
                        ]}
                        onPress={() => setSelectedExercise('meditation')}
                      >
                        <Ionicons 
                          name="sunny" 
                          size={16} 
                          color={selectedExercise === 'meditation' ? "#FFF" : "#4B5563"} 
                          style={{ marginRight: 6 }} 
                        />
                        <Text style={[
                          styles.exerciseToggleText,
                          selectedExercise === 'meditation' && styles.exerciseToggleTextActive
                        ]}>
                          Méditation
                        </Text>
                      </Pressable>
                    </View>

                    {/* Selected Exercise Detail Card */}
                    {selectedExercise === 'breathing' ? (
                      <Animated.View entering={FadeIn.duration(400)} style={styles.exerciseDetailBox}>
                        <View style={styles.exerciseHeaderRow}>
                          <View style={[styles.exerciseBadgeBg, { backgroundColor: theme.accent + '20' }]}>
                            <Ionicons name="leaf-outline" size={20} color={theme.accent} />
                          </View>
                          <View style={{ flex: 1, marginLeft: 12 }}>
                            <Text style={styles.exerciseDetailTitle}>
                              {isStressOrSad ? "Respiration Cardiaque Cohérente" : "Respiration d'Activation Positive"}
                            </Text>
                            <Text style={styles.exerciseDetailDuration}>⏱️ Durée : 1 Minute</Text>
                          </View>
                        </View>
                        <Text style={styles.exerciseDetailDesc}>
                          {isStressOrSad 
                            ? "Cet exercice de cohérence cardiaque régule instantanément votre système nerveux, abaisse le niveau de cortisol (l'hormone du stress) et libère les tensions accumulées."
                            : "Une série de respirations rythmées pour oxygéner votre cerveau, amplifier votre clarté mentale et booster votre niveau d'énergie positive."}
                        </Text>
                        <View style={styles.exerciseDetailBenefitsRow}>
                          <Ionicons name="shield-checkmark" size={16} color="#10B981" />
                          <Text style={styles.exerciseDetailBenefitsText}>Calme mental immédiat & rééquilibrage de l'Aura</Text>
                        </View>
                        <Pressable 
                          style={[styles.startExerciseBtn, { backgroundColor: theme.accent }]}
                          onPress={handleStartBreathing}
                        >
                          <Ionicons name="play" size={16} color="#FFF" style={{ marginRight: 8 }} />
                          <Text style={styles.startExerciseBtnText}>Démarrer la Respiration</Text>
                        </Pressable>
                      </Animated.View>
                    ) : (
                      <Animated.View entering={FadeIn.duration(400)} style={styles.exerciseDetailBox}>
                        <View style={styles.exerciseHeaderRow}>
                          <View style={[styles.exerciseBadgeBg, { backgroundColor: 'rgba(139,92,246,0.15)' }]}>
                            <Ionicons name="sunny-outline" size={20} color="#8B5CF6" />
                          </View>
                          <View style={{ flex: 1, marginLeft: 12 }}>
                            <Text style={styles.exerciseDetailTitle}>Méditation Guidée Immersive</Text>
                            <Text style={styles.exerciseDetailDuration}>⏱️ Durée : 2 Minutes</Text>
                          </View>
                        </View>
                        <Text style={styles.exerciseDetailDesc}>
                          Un voyage sensoriel guidé en 4 phases (Ancrage, Observation, Gratitude, Harmonisation). Conçu pour déconnecter votre esprit des sources d'anxiété et vous recentrer en douceur.
                        </Text>
                        <View style={styles.exerciseDetailBenefitsRow}>
                          <Ionicons name="sparkles" size={16} color="#8B5CF6" />
                          <Text style={styles.exerciseDetailBenefitsText}>Reconnexion spirituelle profonde & clarté d'esprit</Text>
                        </View>
                        <Pressable 
                          style={[styles.startExerciseBtn, { backgroundColor: '#8B5CF6' }]}
                          onPress={handleStartMeditation}
                        >
                          <Ionicons name="play" size={16} color="#FFF" style={{ marginRight: 8 }} />
                          <Text style={styles.startExerciseBtnText}>Démarrer la Méditation</Text>
                        </Pressable>
                      </Animated.View>
                    )}

                    <View style={styles.remedyDivider} />

                    {/* Daily Affirmation Card (Stays active for extra boost!) */}
                    {currentAffirmation && (
                      <View style={styles.affirmationCard}>
                        <LinearGradient
                          colors={['#F5F3FF', '#FAE8FF']}
                          style={StyleSheet.absoluteFillObject}
                        />
                        <View style={styles.affirmationHeader}>
                          <Ionicons name="heart-outline" size={18} color="#8B5CF6" />
                          <Text style={styles.affirmationHeading}>Affirmation Positive du Jour</Text>
                        </View>
                        <Text style={styles.affirmationText}>"{currentAffirmation}"</Text>
                        <Pressable 
                          style={styles.affirmationNextBtn} 
                          onPress={() => handleNextAffirmation(result.dominantEmotion)}
                        >
                          <Ionicons name="sync-outline" size={14} color="#8B5CF6" style={{ marginRight: 6 }} />
                          <Text style={styles.affirmationNextBtnText}>Affirmation Suivante</Text>
                        </Pressable>
                      </View>
                    )}
                  </View>
                </Animated.View>
              );
            })()}

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
            <Text style={styles.loaderSub}>
              {isVoiceMode 
                ? "L'IA analyse la cadence et le ton de votre voix avec précision." 
                : "L'IA analyse vos micro-expressions faciales avec précision."}
            </Text>
          </BlurView>
        </View>
      </Modal>

      {/* HISTORY / RECENT SCANS MODAL */}
      <Modal visible={isHistoryVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <BlurView intensity={90} tint="light" style={StyleSheet.absoluteFillObject} />
          
          <View style={[styles.modalContent, { paddingTop: insets.top + 20 }]}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Historique d'Aura ⏳</Text>
              <Pressable style={styles.modalCloseBtn} onPress={() => setIsHistoryVisible(false)}>
                <Ionicons name="close" size={24} color="#111827" />
              </Pressable>
            </View>

            <ScrollView 
              contentContainerStyle={{ paddingBottom: 40 }}
              showsVerticalScrollIndicator={false}
            >
              {/* Distribution Chart Card */}
              {history.length > 0 && (
                <View style={styles.chartCard}>
                  <Text style={styles.chartTitle}>Distribution de vos États d'Esprit</Text>
                  <Text style={styles.chartSubtitle}>Basé sur vos {history.length} derniers scans</Text>
                  
                  <View style={styles.chartBars}>
                    {(() => {
                      const counts: Record<string, number> = {};
                      history.forEach(scan => {
                        counts[scan.dominantEmotion] = (counts[scan.dominantEmotion] || 0) + 1;
                      });
                      
                      return Object.entries(counts)
                        .sort((a, b) => b[1] - a[1])
                        .map(([emotion, count], idx) => {
                          const percent = Math.round((count / history.length) * 100);
                          const emotionTheme = getEmotionTheme(emotion);
                          return (
                            <View key={idx} style={styles.chartBarRow}>
                              <View style={styles.chartBarLabelWrap}>
                                <Ionicons name={emotionTheme.icon as any} size={14} color={emotionTheme.accent} />
                                <Text style={styles.chartBarLabel}>{emotion}</Text>
                              </View>
                              <View style={styles.chartBarProgressBg}>
                                <View style={[styles.chartBarProgressFill, { width: `${percent}%`, backgroundColor: emotionTheme.accent }]} />
                              </View>
                              <Text style={styles.chartBarPercent}>{percent}%</Text>
                            </View>
                          );
                        });
                    })()}
                  </View>
                </View>
              )}

              {/* History Scans List */}
              <Text style={styles.historyListTitle}>Scans Récents</Text>
              {history.length === 0 ? (
                <View style={styles.emptyHistoryBox}>
                  <Ionicons name="camera-outline" size={48} color="#9CA3AF" style={{ marginBottom: 16 }} />
                  <Text style={styles.emptyHistoryText}>Aucun scan enregistré pour le moment.</Text>
                  <Text style={styles.emptyHistorySub}>Prenez votre premier selfie pour commencer à suivre votre humeur !</Text>
                </View>
              ) : (
                <View style={styles.historyList}>
                  {history.map((scan, idx) => {
                    const scanTheme = getEmotionTheme(scan.dominantEmotion);
                    const formattedDate = new Date(scan.createdAt).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    });
                    
                    return (
                      <Pressable 
                        key={scan.id || idx} 
                        style={styles.historyItem} 
                        onPress={() => loadPastScan(scan)}
                      >
                        <LinearGradient 
                          colors={[scanTheme.gradient[0] + '15', scanTheme.gradient[1] + '05']} 
                          style={StyleSheet.absoluteFillObject}
                        />
                        
                        <View style={styles.historyItemLeft}>
                          <View style={[styles.historyItemIconBg, { backgroundColor: scanTheme.accent }]}>
                            <Ionicons name={scanTheme.icon as any} size={20} color="#FFF" />
                          </View>
                          <View style={styles.historyItemInfo}>
                            <Text style={styles.historyItemEmotion}>{scan.dominantEmotion}</Text>
                            <Text style={styles.historyItemDate}>{formattedDate}</Text>
                            <Text style={styles.historyItemVerdict} numberOfLines={1}>
                              "{scan.verdict}"
                            </Text>
                          </View>
                        </View>
                        
                        <View style={styles.historyItemRight}>
                          <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* GUIDED BREATHING EXERCISE MODAL */}
      <Modal visible={isBreathingVisible} animationType="fade" transparent>
        <View style={styles.breathingOverlay}>
          <BlurView intensity={100} tint="dark" style={StyleSheet.absoluteFillObject} />
          
          <View style={styles.breathingContent}>
            <Pressable 
              style={styles.breathingCloseBtn} 
              onPress={() => {
                setIsBreathingActive(false);
                setIsBreathingVisible(false);
              }}
            >
              <Ionicons name="close" size={24} color="#FFF" />
            </Pressable>

            {breathingTimer > 0 ? (
              <>
                <Text style={styles.breathingSubtitle}>EXERCICE DE RESPIRATION</Text>
                <Text style={styles.breathingTimerText}>
                  {Math.floor(breathingTimer / 60).toString().padStart(2, '0')}:{(breathingTimer % 60).toString().padStart(2, '0')}
                </Text>
                
                <View style={styles.breathingContainer}>
                  <Animated.View style={[styles.breathingCircleOuter, breathingCircleStyle]}>
                    <LinearGradient 
                      colors={theme.gradient} 
                      style={StyleSheet.absoluteFillObject}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    />
                    <View style={styles.breathingCircleInner} />
                  </Animated.View>
                </View>
                
                <View style={styles.phaseLabelContainer}>
                  <Text style={styles.phaseLabelBig}>
                    {breathingPhase === 'inspire' ? 'INSPIRER' : 
                     breathingPhase === 'retenez' ? 'RETENIR' : 'EXPIRER'}
                  </Text>
                  <Text style={styles.phaseLabelSub}>
                    {breathingPhase === 'inspire' ? 'Gonflez votre poitrine lentement...' : 
                     breathingPhase === 'retenez' ? 'Gardez l\'air dans vos poumons...' : 'Relâchez tout le stress doucement...'}
                  </Text>
                </View>

                <View style={styles.phaseDots}>
                  {['inspire', 'retenez', 'expire'].map((p) => (
                    <View 
                      key={p} 
                      style={[
                        styles.phaseDot, 
                        breathingPhase === p && { backgroundColor: theme.accent, width: 24 }
                      ]} 
                    />
                  ))}
                </View>
              </>
            ) : (
              <Animated.View entering={FadeIn.duration(800)} style={styles.congratsBox}>
                <View style={styles.congratsBadge}>
                  <Ionicons name="sparkles" size={40} color="#F59E0B" />
                </View>
                <Text style={styles.congratsTitle}>Session Terminée ! ✨</Text>
                <Text style={styles.congratsSub}>
                  Votre esprit est apaisé et votre Aura s'est réalignée. Prenez un instant pour savourer ce calme retrouvé.
                </Text>
                
                <Pressable 
                  style={[styles.congratsBtn, { backgroundColor: theme.accent }]}
                  onPress={() => setIsBreathingVisible(false)}
                >
                  <Text style={styles.congratsBtnText}>Retour au Rapport</Text>
                </Pressable>
              </Animated.View>
            )}
          </View>
        </View>
      </Modal>

      {/* GUIDED MEDITATION EXERCISE MODAL */}
      <Modal visible={isMeditationVisible} animationType="fade" transparent>
        <View style={styles.breathingOverlay}>
          <BlurView intensity={100} tint="dark" style={StyleSheet.absoluteFillObject} />
          
          <View style={styles.breathingContent}>
            <Pressable 
              style={styles.breathingCloseBtn} 
              onPress={() => {
                setIsMeditationActive(false);
                setIsMeditationVisible(false);
              }}
            >
              <Ionicons name="close" size={24} color="#FFF" />
            </Pressable>

            {meditationTimer > 0 ? (
              <>
                <Text style={styles.breathingSubtitle}>MÉDITATION D'IMMERSION MENTALE</Text>
                <Text style={styles.breathingTimerText}>
                  {Math.floor(meditationTimer / 60).toString().padStart(2, '0')}:{(meditationTimer % 60).toString().padStart(2, '0')}
                </Text>
                
                <View style={styles.breathingContainer}>
                  <View style={[styles.breathingCircleOuter, { width: 150, height: 150, borderRadius: 75 }]}>
                    <LinearGradient 
                      colors={['#8B5CF6', '#C084FC']} 
                      style={StyleSheet.absoluteFillObject}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    />
                    <View style={styles.breathingCircleInner} />
                  </View>
                </View>
                
                <View style={styles.phaseLabelContainer}>
                  <Text style={styles.phaseLabelBig}>
                    {meditationPhase === 'ancrage' ? 'ANCRAGE' : 
                     meditationPhase === 'observation' ? 'OBSERVATION' : 
                     meditationPhase === 'gratitude' ? 'GRATITUDE' : 'HARMONISATION'}
                  </Text>
                  <Text style={styles.phaseLabelSub}>
                    {meditationPhase === 'ancrage' ? 'Prenez conscience des points de contact avec le sol, respirez profondément...' : 
                     meditationPhase === 'observation' ? 'Laissez filer vos pensées comme des nuages, sans les retenir...' : 
                     meditationPhase === 'gratitude' ? 'Pensez à 3 choses pour lesquelles vous êtes reconnaissant aujourd\'hui...' : 
                     'Ressentez l\'harmonie de votre Aura se diffuser dans tout votre corps...'}
                  </Text>
                </View>

                <View style={styles.phaseDots}>
                  {['ancrage', 'observation', 'gratitude', 'harmonisation'].map((p) => (
                    <View 
                      key={p} 
                      style={[
                        styles.phaseDot, 
                        meditationPhase === p && { backgroundColor: '#8B5CF6', width: 24 }
                      ]} 
                    />
                  ))}
                </View>
              </>
            ) : (
              <Animated.View entering={FadeIn.duration(800)} style={styles.congratsBox}>
                <View style={[styles.congratsBadge, { backgroundColor: 'rgba(139,92,246,0.15)', borderColor: 'rgba(139,92,246,0.2)' }]}>
                  <Ionicons name="sparkles" size={40} color="#8B5CF6" />
                </View>
                <Text style={styles.congratsTitle}>Méditation Réalisée ! ✨</Text>
                <Text style={styles.congratsSub}>
                  Votre clarté d'esprit et alignement vibratoire sont maintenant optimisés au maximum. Savourez cette légèreté.
                </Text>
                
                <Pressable 
                  style={[styles.congratsBtn, { backgroundColor: '#8B5CF6' }]}
                  onPress={() => setIsMeditationVisible(false)}
                >
                  <Text style={styles.congratsBtnText}>Retour au Rapport</Text>
                </Pressable>
              </Animated.View>
            )}
          </View>
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
  historyBtn: {
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

  // Daily Comparison Card styles
  comparisonCard: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  comparisonSub: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 12,
    fontWeight: '500',
    lineHeight: 18,
  },
  comparisonList: {
    gap: 12,
  },
  comparisonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  comparisonLabelWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  comparisonLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  comparisonDeltaWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  comparisonPercent: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  comparisonDelta: {
    fontSize: 14,
    fontWeight: '700',
  },

  // Quick Remedy Styles
  remedyCard: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  remedyIntro: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 20,
    fontWeight: '500',
  },
  remedyExerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  remedyExerciseIconBg: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  remedyExerciseInfo: {
    flex: 1,
    marginLeft: 14,
  },
  remedyExerciseTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  remedyExerciseSub: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },
  remedyExercisePlayBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  remedyDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 20,
  },
  remedyPlaylistHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  remedyPlaylistTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  remedyPlaylistSub: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  remedyTracksList: {
    gap: 10,
    marginBottom: 10,
  },
  remedyTrackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
  },
  remedyTrackRowActive: {
    backgroundColor: '#FFF8F6',
    borderWidth: 1,
    borderColor: 'rgba(255,107,107,0.15)',
  },
  remedyTrackLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  remedyTrackNumberBg: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  remedyTrackName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  remedyTrackArtist: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
  },
  remedyTrackDuration: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '500',
  },

  // Spotify-style Mini Player
  miniPlayerBar: {
    marginTop: 16,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  miniPlayerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
  },
  miniPlayerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  miniPlayerDisc: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  miniPlayerTrackName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  miniPlayerTrackArtist: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 1,
  },
  miniPlayerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  visualizer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 20,
    gap: 3,
  },
  visualizerBar: {
    width: 3,
    borderRadius: 1.5,
  },
  miniPlayerControlBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  miniPlayerProgressBg: {
    height: 3,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  miniPlayerProgressFill: {
    height: '100%',
  },

  // Modals Styling
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.15)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingHorizontal: 24,
    height: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -12 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.5,
  },
  modalCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Chart
  chartCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    marginBottom: 24,
  },
  chartTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  chartSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 16,
    fontWeight: '500',
  },
  chartBars: {
    gap: 12,
  },
  chartBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chartBarLabelWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    width: '28%',
  },
  chartBarLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
  },
  chartBarProgressBg: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    flex: 1,
    marginHorizontal: 12,
    overflow: 'hidden',
  },
  chartBarProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  chartBarPercent: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111827',
    width: '10%',
    textAlign: 'right',
  },

  historyListTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 14,
    letterSpacing: -0.2,
  },
  emptyHistoryBox: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyHistoryText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 8,
  },
  emptyHistorySub: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 30,
  },
  historyList: {
    gap: 12,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
  historyItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  historyItemIconBg: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyItemInfo: {
    marginLeft: 14,
    flex: 1,
  },
  historyItemEmotion: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  historyItemDate: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
    fontWeight: '500',
  },
  historyItemVerdict: {
    fontSize: 12,
    color: '#4B5563',
    marginTop: 4,
    fontStyle: 'italic',
  },
  historyItemRight: {
    marginLeft: 10,
  },

  // Guided Breathing Overlay Styling
  breathingOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  breathingContent: {
    width: '100%',
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  breathingCloseBtn: {
    position: 'absolute',
    top: -80,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  breathingSubtitle: {
    fontSize: 11,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 3,
    marginBottom: 8,
  },
  breathingTimerText: {
    fontSize: 48,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: -1,
    marginBottom: 40,
  },
  breathingContainer: {
    width: 280,
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  breathingCircleOuter: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
  },
  breathingCircleInner: {
    width: '88%',
    height: '88%',
    borderRadius: 999,
    backgroundColor: 'rgba(17, 24, 39, 0.85)',
  },
  phaseLabelContainer: {
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: 24,
    marginBottom: 32,
  },
  phaseLabelBig: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: 8,
  },
  phaseLabelSub: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
    lineHeight: 16,
    fontWeight: '500',
  },
  phaseDots: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  phaseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  congratsBox: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 32,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  congratsBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(245,158,11,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(245,158,11,0.2)',
  },
  congratsTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFF',
    marginBottom: 10,
    textAlign: 'center',
  },
  congratsSub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
    fontWeight: '500',
  },
  congratsBtn: {
    height: 52,
    borderRadius: 16,
    paddingHorizontal: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 4,
  },
  congratsBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFF',
  },
  affirmationCard: {
    borderRadius: 24,
    padding: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E9D5FF',
    marginTop: 8,
  },
  affirmationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
    width: '100%',
  },
  affirmationHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: '#7C3AED',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    flex: 1,
  },
  affirmationText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#4C1D95',
    lineHeight: 22,
    marginBottom: 16,
    fontStyle: 'italic',
  },
  affirmationNextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(139,92,246,0.1)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  affirmationNextBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8B5CF6',
  },
  preSelectionCard: {
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  preSelectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
    textAlign: 'center',
  },
  preSelectionSubtitle: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 12,
    textAlign: 'center',
  },
  preSelectionMoodsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  preSelectionMoodItem: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  preSelectionMoodItemActive: {
    backgroundColor: '#EEF2FF',
    borderColor: '#6366F1',
  },
  preSelectionMoodEmoji: {
    fontSize: 22,
    marginBottom: 4,
  },
  preSelectionMoodLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#4B5563',
  },
  preSelectionMoodLabelActive: {
    color: '#4F46E5',
  },
  scanModeToggleRow: {
    flexDirection: 'row',
    backgroundColor: '#E5E7EB',
    borderRadius: 16,
    padding: 4,
    marginBottom: 20,
    width: '100%',
  },
  scanModeToggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
  },
  scanModeToggleBtnActive: {
    backgroundColor: '#4B5563',
  },
  scanModeToggleText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563',
  },
  scanModeToggleTextActive: {
    color: '#FFF',
  },
  voiceRecorderCard: {
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
    marginBottom: 16,
  },
  voiceWaveContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  waveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    height: 60,
    marginBottom: 8,
  },
  waveBar: {
    width: 4,
    borderRadius: 2,
    backgroundColor: '#8B5CF6',
  },
  voiceDurationText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8B5CF6',
  },
  voiceIdleContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  voiceInstructionText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 8,
  },
  voiceMicWrapper: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(139,92,246,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  voiceMicWrapperActive: {
    backgroundColor: 'rgba(239,68,68,0.15)',
  },
  voiceMicButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  voiceMicButtonActive: {
    backgroundColor: '#EF4444',
  },
  voiceActionHint: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  comparisonBannerCard: {
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#DDD6FE',
    overflow: 'hidden',
  },
  comparisonBannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  comparisonBannerTitle: {
    fontSize: 10,
    fontWeight: '900',
    color: '#7C3AED',
    letterSpacing: 2,
  },
  comparisonBannerText: {
    fontSize: 13,
    color: '#4C1D95',
    lineHeight: 20,
    fontWeight: '600',
  },
  voiceTranscriptText: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 18,
    fontStyle: 'italic',
  },
  exerciseToggleRow: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    padding: 4,
    marginBottom: 16,
  },
  exerciseToggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
  },
  exerciseToggleBtnActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  exerciseToggleText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4B5563',
  },
  exerciseToggleTextActive: {
    color: '#FFF',
  },
  exerciseDetailBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  exerciseHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  exerciseBadgeBg: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exerciseDetailTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 2,
  },
  exerciseDetailDuration: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
  },
  exerciseDetailDesc: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 18,
    marginBottom: 12,
  },
  exerciseDetailBenefitsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  exerciseDetailBenefitsText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
  },
  startExerciseBtn: {
    height: 48,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  startExerciseBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFF',
  },
});
