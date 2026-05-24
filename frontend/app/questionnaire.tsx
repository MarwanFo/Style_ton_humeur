import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable, 
  Dimensions, 
  ActivityIndicator,
  Alert,
  StatusBar,
  ScrollView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { 
  FadeInRight, 
  FadeOutLeft, 
  Layout 
} from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { API_URL } from '@/constants/Api';

const { width } = Dimensions.get('window');

const QUESTIONS = [
  {
    id: 'energy',
    title: 'Quel est votre niveau d\'énergie ?',
    subtitle: 'Ressentez votre corps et choisissez le rythme du jour.',
    options: [
      { value: 'faible', label: 'Faible', emoji: '🔋', desc: 'Besoin de douceur et de calme' },
      { value: 'moyen', label: 'Moyen', emoji: '⚡', desc: 'Équilibre parfait et serein' },
      { value: 'eleve', label: 'Élevé', emoji: '💥', desc: 'Prêt à conquérir le monde' },
    ]
  },
  {
    id: 'desire',
    title: 'Quelle est votre envie vestimentaire ?',
    subtitle: 'Habillez votre état d\'esprit du moment.',
    options: [
      { value: 'confortable', label: 'Confortable', emoji: '☁️', desc: 'Des tissus amples et doux' },
      { value: 'audacieux', label: 'Audacieux', emoji: '🔥', desc: 'Des pièces fortes et uniques' },
      { value: 'minimaliste', label: 'Minimaliste', emoji: '✨', desc: 'L\'élégance de la simplicité' },
      { value: 'elegant', label: 'Élégant', emoji: '🎩', desc: 'Raffinement pour briller' },
    ]
  },
  {
    id: 'context',
    title: 'Quel est le contexte de votre journée ?',
    subtitle: 'Où va s\'exprimer votre style ?',
    options: [
      { value: 'travail', label: 'Travail / Études', emoji: '💼', desc: 'Professionnel et structuré' },
      { value: 'sortie', label: 'Sortie / Soirée', emoji: '🍹', desc: 'Chic, festif et détendu' },
      { value: 'sport', label: 'Sport / Cardio', emoji: '👟', desc: 'Actif, technique et aéré' },
      { value: 'maison', label: 'Détente Maison', emoji: '🏡', desc: 'Cosy et 100% cocooning' },
    ]
  },
  {
    id: 'style',
    title: 'Quel style d\'IA souhaitez-vous ?',
    subtitle: 'Choisissez l\'esthétique directrice de l\'algorithme.',
    options: [
      { value: 'casual', label: 'Casual', emoji: '👕', desc: 'Style de tous les jours moderne' },
      { value: 'chic', label: 'Chic', emoji: '👜', desc: 'Sophistiqué et haut de gamme' },
      { value: 'streetwear', label: 'Streetwear', emoji: '🧢', desc: 'Urbain, branché et jeune' },
      { value: 'classique', label: 'Classique', emoji: '🧥', desc: 'Intemporel et très soigné' },
    ]
  }
];

export default function QuestionnaireScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const activeQuestion = QUESTIONS[currentStep];

  const handleSelectOption = (value: string) => {
    setAnswers(prev => ({
      ...prev,
      [activeQuestion.id]: value
    }));

    setTimeout(() => {
      if (currentStep < QUESTIONS.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        handleSubmit({ ...answers, [activeQuestion.id]: value });
      }
    }, 300);
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    } else {
      router.back();
    }
  };

  const handleSubmit = async (finalAnswers: Record<string, string>) => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Session expirée', 'Veuillez vous reconnecter.');
        router.replace('/auth');
        return;
      }

      const response = await fetch(`${API_URL}/checkins`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          answers: finalAnswers
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Impossible de soumettre le check-in.');
      }

      await AsyncStorage.setItem('latestRecommendation', JSON.stringify(data.recommendation));
      await AsyncStorage.setItem('latestCheckin', JSON.stringify(data.checkin));
      
      router.replace('/style-analysis');
    } catch (err: any) {
      Alert.alert('Échec de génération', err.message || 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  const progressPercent = ((currentStep + 1) / QUESTIONS.length) * 100;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Absolute Ambient Background */}
      <View style={StyleSheet.absoluteFill}>
        <LinearGradient
          colors={['#F5F3FF', '#FCE7F3', '#FFE4E6']}
          style={StyleSheet.absoluteFillObject}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <View style={styles.orbTopRight} />
        <View style={styles.orbBottomLeft} />
        <BlurView intensity={70} tint="light" style={StyleSheet.absoluteFillObject} />
      </View>

      {/* TOP NAVIGATION */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Pressable onPress={handleBack} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#111827" />
        </Pressable>
        <Text style={styles.headerTitle}>AURA QUIZ</Text>
        <View style={styles.placeholderBtn} />
      </View>

      {/* PROGRESS BAR */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBg}>
          <LinearGradient
            colors={['#8B5CF6', '#EC4899']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[StyleSheet.absoluteFillObject, { width: `${progressPercent}%`, borderRadius: 4 }]}
          />
        </View>
      </View>

      {/* ENTIRE LAYOUT SCROLLABLE FOR FULL RESPONSIVENESS */}
      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]} 
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#8B5CF6" />
            <Text style={styles.loadingTitle}>Consultation de l'IA...</Text>
            <Text style={styles.loadingSub}>Gemini analyse vos envies pour façonner vos recommandations exclusives de style.</Text>
          </View>
        ) : (
          <Animated.View 
            key={currentStep}
            entering={FadeInRight.duration(400)}
            exiting={FadeOutLeft.duration(300)}
            layout={Layout.springify()}
            style={styles.questionCard}
          >
            <Text style={styles.questionStep}>ÉTAPE {currentStep + 1} SUR {QUESTIONS.length}</Text>
            <Text style={styles.questionTitle}>{activeQuestion.title}</Text>
            <Text style={styles.questionSubtitle}>{activeQuestion.subtitle}</Text>

            <View style={styles.optionsList}>
              {activeQuestion.options.map((opt) => {
                const isSelected = answers[activeQuestion.id] === opt.value;
                return (
                  <Pressable
                    key={opt.value}
                    onPress={() => handleSelectOption(opt.value)}
                    style={[
                      styles.optionItem,
                      isSelected && styles.optionItemActive
                    ]}
                  >
                    <View style={[styles.emojiFrame, isSelected && styles.emojiFrameActive]}>
                      <Text style={styles.emojiText}>{opt.emoji}</Text>
                    </View>
                    <View style={styles.optionInfo}>
                      <Text style={[styles.optionLabel, isSelected && styles.optionLabelActive]}>
                        {opt.label}
                      </Text>
                      <Text style={styles.optionDesc}>{opt.desc}</Text>
                    </View>
                    <Ionicons 
                      name={isSelected ? "checkmark-circle" : "chevron-forward-outline"} 
                      size={20} 
                      color={isSelected ? "#8B5CF6" : "#9CA3AF"} 
                    />
                  </Pressable>
                );
              })}
            </View>
          </Animated.View>
        )}
      </ScrollView>
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
    backgroundColor: '#C7D2FE',
    top: -100,
    right: -100,
    opacity: 0.6,
  },
  orbBottomLeft: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 999,
    backgroundColor: '#FBCFE8',
    bottom: -60,
    left: -80,
    opacity: 0.6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  backBtn: {
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
  headerTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#6B7280',
    letterSpacing: 4,
  },
  placeholderBtn: {
    width: 48,
  },
  progressContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  progressBg: {
    height: 6,
    backgroundColor: 'rgba(0,0,0,0.04)',
    borderRadius: 100,
    overflow: 'hidden',
  },
  scrollContent: {
    paddingHorizontal: 24,
    flexGrow: 1,
  },
  questionCard: {
    flex: 1,
  },
  questionStep: {
    fontSize: 10,
    fontWeight: '800',
    color: '#8B5CF6',
    letterSpacing: 2,
    marginBottom: 12,
  },
  questionTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    lineHeight: 32,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  questionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 28,
    fontWeight: '500',
  },
  optionsList: {
    gap: 16,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.02,
    shadowRadius: 16,
    elevation: 3,
  },
  optionItemActive: {
    borderColor: '#8B5CF6',
    borderWidth: 2,
    shadowColor: '#8B5CF6',
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  emojiFrame: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  emojiFrameActive: {
    backgroundColor: '#F5F3FF',
  },
  emojiText: {
    fontSize: 22,
  },
  optionInfo: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  optionLabelActive: {
    color: '#8B5CF6',
  },
  optionDesc: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    marginTop: 24,
    marginBottom: 8,
  },
  loadingSub: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    fontWeight: '500',
  },
});
