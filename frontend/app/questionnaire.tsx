import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable, 
  Dimensions, 
  ActivityIndicator,
  Alert 
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

    // Auto-advance with a slight elegant delay
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

      // Format answers as key-value JSON representing the user input
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

      // Save recommendation to storage to read on screen
      await AsyncStorage.setItem('latestRecommendation', JSON.stringify(data.recommendation));
      await AsyncStorage.setItem('latestCheckin', JSON.stringify(data.checkin));
      
      // Go to recommendations screen
      router.replace('/recommendations');
    } catch (err: any) {
      Alert.alert('Échec de génération', err.message || 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  const progressPercent = ((currentStep + 1) / QUESTIONS.length) * 100;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FFF9F9', '#F5F7FF', '#EFF9F6']}
        style={StyleSheet.absoluteFillObject}
      />

      {/* TOP NAVIGATION */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Pressable onPress={handleBack} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#1E1E2C" />
        </Pressable>
        <Text style={styles.headerTitle}>Mood Quiz</Text>
        <View style={styles.placeholderBtn} />
      </View>

      {/* PROGRESS BAR */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
      </View>

      {/* CARD CONTENT CONTAINER */}
      <View style={styles.cardWrapper}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#7F00FF" />
            <Text style={styles.loadingTitle}>Consultation de l'IA...</Text>
            <Text style={styles.loadingSub}>Gemini analyse vos envies et génère vos tenues et playlists idéales.</Text>
          </View>
        ) : (
          <Animated.View 
            key={currentStep}
            entering={FadeInRight.duration(400)}
            exiting={FadeOutLeft.duration(300)}
            layout={Layout.springify()}
            style={styles.questionCard}
          >
            <Text style={styles.questionStep}>QUESTION {currentStep + 1} SUR {QUESTIONS.length}</Text>
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
                      color={isSelected ? "#7F00FF" : "#8A8A9E"} 
                    />
                  </Pressable>
                );
              })}
            </View>
          </Animated.View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFCFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingBottom: 16,
  },
  backBtn: {
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E1E2C',
  },
  placeholderBtn: {
    width: 44,
  },
  progressContainer: {
    height: 6,
    backgroundColor: 'rgba(0,0,0,0.04)',
    marginHorizontal: 22,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 30,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#7F00FF',
    borderRadius: 3,
  },
  cardWrapper: {
    flex: 1,
    paddingHorizontal: 22,
    justifyContent: 'flex-start',
  },
  questionCard: {
    flex: 1,
  },
  questionStep: {
    fontSize: 10,
    fontWeight: '900',
    color: '#8A8A9E',
    letterSpacing: 2,
    marginBottom: 12,
  },
  questionTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1E1E2C',
    lineHeight: 32,
    marginBottom: 8,
  },
  questionSubtitle: {
    fontSize: 14,
    color: '#7C7C8E',
    lineHeight: 20,
    marginBottom: 32,
    fontWeight: '500',
  },
  optionsList: {
    gap: 16,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 3,
  },
  optionItemActive: {
    borderColor: '#7F00FF',
    borderWidth: 2,
    shadowColor: '#7F00FF',
    shadowOpacity: 0.08,
  },
  emojiFrame: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.03)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  emojiFrameActive: {
    backgroundColor: 'rgba(127,0,255,0.1)',
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
    color: '#1E1E2C',
    marginBottom: 4,
  },
  optionLabelActive: {
    color: '#7F00FF',
  },
  optionDesc: {
    fontSize: 12,
    color: '#8A8A9E',
  },
  // Loading state
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E1E2C',
    marginTop: 24,
    marginBottom: 8,
  },
  loadingSub: {
    fontSize: 14,
    color: '#8A8A9E',
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '500',
  },
});
