import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, StatusBar, ActivityIndicator, Alert, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons, Feather } from '@expo/vector-icons';
import Animated, { 
  FadeInUp, 
  FadeInDown, 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSequence,
  cancelAnimation
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system/legacy';
import * as Speech from 'expo-speech';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@/constants/Api';

const { width } = Dimensions.get('window');

export default function VoiceStylistScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Recording State
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordDuration, setRecordDuration] = useState(0);
  const durationInterval = useRef<NodeJS.Timeout | null>(null);

  // Assistant Responses & Speech State
  const [lastTranscript, setLastTranscript] = useState<string>('');
  const [aiVoiceMessage, setAiVoiceMessage] = useState<string>('');
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Animation values
  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0.4);
  const waveHeight1 = useSharedValue(10);
  const waveHeight2 = useSharedValue(10);
  const waveHeight3 = useSharedValue(10);
  const waveHeight4 = useSharedValue(10);

  useEffect(() => {
    // Request microphone permissions on load
    const reqPermission = async () => {
      await Audio.requestPermissionsAsync();
    };
    reqPermission();

    return () => {
      // Clean up speech and intervals on unmount
      Speech.stop();
      if (durationInterval.current) clearInterval(durationInterval.current);
    };
  }, []);

  // Pulsating button styling when recording
  const recordButtonAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const pulseRingAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value + 0.3 }],
    opacity: pulseOpacity.value,
  }));

  // Animated waveforms
  const waveAnimStyle1 = useAnimatedStyle(() => ({ height: waveHeight1.value }));
  const waveAnimStyle2 = useAnimatedStyle(() => ({ height: waveHeight2.value }));
  const waveAnimStyle3 = useAnimatedStyle(() => ({ height: waveHeight3.value }));
  const waveAnimStyle4 = useAnimatedStyle(() => ({ height: waveHeight4.value }));

  const startAnimateWave = () => {
    pulseScale.value = withRepeat(withTiming(1.15, { duration: 600 }), -1, true);
    pulseOpacity.value = withRepeat(withTiming(0, { duration: 1200 }), -1, false);

    waveHeight1.value = withRepeat(withSequence(withTiming(50, { duration: 300 }), withTiming(10, { duration: 300 })), -1, true);
    waveHeight2.value = withRepeat(withSequence(withTiming(70, { duration: 400 }), withTiming(15, { duration: 400 })), -1, true);
    waveHeight3.value = withRepeat(withSequence(withTiming(60, { duration: 350 }), withTiming(12, { duration: 350 })), -1, true);
    waveHeight4.value = withRepeat(withSequence(withTiming(40, { duration: 250 }), withTiming(8, { duration: 250 })), -1, true);
  };

  const stopAnimateWave = () => {
    cancelAnimation(pulseScale);
    cancelAnimation(pulseOpacity);
    cancelAnimation(waveHeight1);
    cancelAnimation(waveHeight2);
    cancelAnimation(waveHeight3);
    cancelAnimation(waveHeight4);

    pulseScale.value = withTiming(1, { duration: 300 });
    pulseOpacity.value = withTiming(0.4, { duration: 300 });
    waveHeight1.value = withTiming(10, { duration: 300 });
    waveHeight2.value = withTiming(10, { duration: 300 });
    waveHeight3.value = withTiming(10, { duration: 300 });
    waveHeight4.value = withTiming(10, { duration: 300 });
  };

  const startRecording = async () => {
    try {
      // Configure audio session
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
      startAnimateWave();

      // Start duration counter
      durationInterval.current = setInterval(() => {
        setRecordDuration((prev) => prev + 1);
      }, 1000) as any;
    } catch (err) {
      console.error('Failed to start recording', err);
      Alert.alert('Permission microphone', 'Veuillez accorder la permission d\'enregistrer dans les paramètres de votre appareil.');
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    setIsRecording(false);
    stopAnimateWave();

    if (durationInterval.current) {
      clearInterval(durationInterval.current);
    }

    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      const duration = recordDuration;
      setRecording(null);

      if (uri) {
        const fileInfo = await FileSystem.getInfoAsync(uri);
        console.log(`Audio file size: ${fileInfo.exists ? (fileInfo as any).size : 0} bytes, duration: ${duration}s`);

        if (!fileInfo.exists || (fileInfo as any).size < 1000) {
          Alert.alert("Enregistrement vide", "Aucun son n'a été détecté. Veuillez vérifier les permissions de votre micro et réessayer.");
          return;
        }

        if (duration < 2) {
          Alert.alert("Message trop court", "Veuillez parler plus longtemps (au moins 2 secondes) pour que l'assistant puisse vous conseiller.");
          return;
        }

        processAudio(uri);
      }
    } catch (err) {
      console.error('Failed to stop recording', err);
    }
  };

  const formatDuration = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const processAudio = async (uri: string) => {
    setIsProcessing(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        router.push('/auth');
        return;
      }

      // Convert audio file to Base64
      const base64Audio = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Call voice-checkin endpoint on backend
      const response = await fetch(`${API_URL}/checkins/voice-checkin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          base64Audio,
          mimeType: 'audio/m4a',
        }),
      });

      if (!response.ok) {
        let errorMessage = 'Server responded with error';
        try {
          const errData = await response.json();
          if (errData && errData.message) {
            errorMessage = Array.isArray(errData.message)
              ? errData.message.join(', ')
              : errData.message;
          }
        } catch (_) {}
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      setLastTranscript(data.transcript || '');
      setAiVoiceMessage(data.aiVoiceMessage || '');

      // Store recommendations & check-in data locally
      await AsyncStorage.setItem('latestRecommendation', JSON.stringify(data.recommendation));
      await AsyncStorage.setItem('latestCheckin', JSON.stringify(data.checkin));

      // Auto play the AI spoken voice reply
      if (data.aiVoiceMessage) {
        speakResponse(data.aiVoiceMessage);
      }
    } catch (err: any) {
      console.log('Processing voice check-in failed:', err.message || err);
      Alert.alert('Erreur', err.message || 'Impossible de transcrire ou de générer les recommandations. Veuillez réessayer.');
    } finally {
      setIsProcessing(false);
    }
  };

  const speakResponse = (text: string) => {
    setIsSpeaking(true);
    Speech.speak(text, {
      language: 'fr-FR',
      onDone: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
    } else if (aiVoiceMessage) {
      speakResponse(aiVoiceMessage);
    }
  };

  const navigateToAnalysis = () => {
    router.replace('/style-analysis');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Ambient Premium Gradient Background */}
      <View style={StyleSheet.absoluteFill}>
        <LinearGradient 
          colors={['#0F0C20', '#15102A', '#06040A']} 
          style={StyleSheet.absoluteFillObject}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <View style={styles.orbTopRight} />
        <View style={styles.orbBottomLeft} />
      </View>

      <View style={[styles.content, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }]}>
        
        {/* HEADER */}
        <Animated.View entering={FadeInUp.duration(800).springify()} style={styles.header}>
          <Pressable style={styles.closeBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </Pressable>
          <Text style={styles.headerTitle}>Pocket Stylist IA</Text>
          <View style={{ width: 48 }} />
        </Animated.View>

        {/* MAIN BODY */}
        <View style={styles.mainContainer}>
          
          {/* TITLE & DESCRIPTION */}
          <Animated.View entering={FadeInDown.delay(100).duration(800).springify()} style={styles.introBox}>
            <Text style={styles.title}>Comment vous sentez-vous ?</Text>
            <Text style={styles.subtitle}>
              Parlez librement de votre humeur, de votre journée, ou de l'événement que vous préparez. Votre styliste vous écoute et composera votre look.
            </Text>
          </Animated.View>

          {/* AUDIO WAVE VISUALIZATION */}
          <View style={styles.waveContainer}>
            {isRecording ? (
              <View style={styles.waveRow}>
                <Animated.View style={[styles.waveBar, waveAnimStyle1]} />
                <Animated.View style={[styles.waveBar, waveAnimStyle2]} />
                <Animated.View style={[styles.waveBar, waveAnimStyle3]} />
                <Animated.View style={[styles.waveBar, waveAnimStyle4]} />
                <Animated.View style={[styles.waveBar, waveAnimStyle3]} />
                <Animated.View style={[styles.waveBar, waveAnimStyle2]} />
                <Animated.View style={[styles.waveBar, waveAnimStyle1]} />
              </View>
            ) : (
              <View style={styles.idleWave}>
                <Feather name="mic" size={32} color="rgba(255,255,255,0.3)" />
              </View>
            )}
            {isRecording && (
              <Text style={styles.durationText}>{formatDuration(recordDuration)}</Text>
            )}
          </View>

          {/* TRANSCRIPTION RESULT (Visible once recorded) */}
          {(lastTranscript || isProcessing) && (
            <Animated.View entering={FadeInDown.duration(600)} style={styles.transcriptCardShadow}>
              <BlurView intensity={20} tint="dark" style={styles.transcriptCard}>
                {isProcessing ? (
                  <View style={styles.loadingBox}>
                    <ActivityIndicator size="small" color="#A855F7" style={{ marginBottom: 8 }} />
                    <Text style={styles.processingText}>Transcription & composition du style par l'IA...</Text>
                  </View>
                ) : (
                  <View>
                    <View style={styles.transcriptHeader}>
                      <Ionicons name="chatbubble-ellipses-outline" size={16} color="#A855F7" />
                      <Text style={styles.transcriptLabel}>Vous avez dit :</Text>
                    </View>
                    <Text style={styles.transcriptText}>"{lastTranscript}"</Text>

                    {aiVoiceMessage && (
                      <View style={styles.voiceMessageSection}>
                        <View style={styles.divider} />
                        <View style={styles.voiceMessageHeader}>
                          <Pressable style={styles.playBtn} onPress={toggleSpeech}>
                            <Ionicons 
                              name={isSpeaking ? "pause-circle" : "play-circle"} 
                              size={28} 
                              color="#10B981" 
                            />
                          </Pressable>
                          <View style={{ flex: 1, marginLeft: 8 }}>
                            <Text style={styles.aiLabel}>Styliste de Poche :</Text>
                            <Text style={styles.aiMessageText}>{aiVoiceMessage}</Text>
                          </View>
                        </View>
                      </View>
                    )}
                  </View>
                )}
              </BlurView>
            </Animated.View>
          )}

          {/* BUTTON ACTIONS */}
          <View style={styles.actionsContainer}>
            {!lastTranscript && !isProcessing && (
              <Animated.View entering={FadeInDown.delay(200).duration(800).springify()} style={styles.micButtonContainer}>
                {isRecording && (
                  <Animated.View style={[styles.pulseRing, pulseRingAnimStyle]} />
                )}
                <Pressable
                  onPressIn={isRecording ? undefined : startRecording}
                  onPressOut={isRecording ? stopRecording : undefined}
                  style={styles.micWrapper}
                >
                  <Animated.View style={[styles.micButton, isRecording && styles.micButtonActive, recordButtonAnimStyle]}>
                    <Ionicons 
                      name={isRecording ? "stop" : "mic"} 
                      size={36} 
                      color="#FFF" 
                    />
                  </Animated.View>
                </Pressable>
                <Text style={styles.actionPrompt}>
                  {isRecording ? "Relâchez pour terminer" : "Maintenir pour parler"}
                </Text>
              </Animated.View>
            )}

            {lastTranscript && !isProcessing && (
              <Animated.View entering={FadeInDown.duration(600)} style={styles.navRow}>
                <Pressable style={styles.btnSecondary} onPress={() => { setLastTranscript(''); setAiVoiceMessage(''); Speech.stop(); }}>
                  <Ionicons name="refresh" size={18} color="#FFF" style={{ marginRight: 8 }} />
                  <Text style={styles.btnSecondaryText}>Recommencer</Text>
                </Pressable>

                <Pressable style={styles.btnPrimary} onPress={navigateToAnalysis}>
                  <LinearGradient 
                    colors={['#8B5CF6', '#EC4899']} 
                    start={{ x: 0, y: 0 }} 
                    end={{ x: 1, y: 1 }} 
                    style={styles.gradientBtn}
                  >
                    <Text style={styles.btnPrimaryText}>Voir les Tenues 👗</Text>
                    <Ionicons name="arrow-forward" size={18} color="#FFF" style={{ marginLeft: 8 }} />
                  </LinearGradient>
                </Pressable>
              </Animated.View>
            )}
          </View>

        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  orbTopRight: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 999,
    backgroundColor: '#8B5CF6',
    top: -50,
    right: -50,
    opacity: 0.35,
  },
  orbBottomLeft: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 999,
    backgroundColor: '#EC4899',
    bottom: -100,
    left: -100,
    opacity: 0.2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  closeBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: -0.5,
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  introBox: {
    alignItems: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 12,
  },
  waveContainer: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  waveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 80,
  },
  waveBar: {
    width: 6,
    borderRadius: 3,
    backgroundColor: '#8B5CF6',
    marginHorizontal: 3,
  },
  idleWave: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.03)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  durationText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 12,
    letterSpacing: 1,
  },
  transcriptCardShadow: {
    marginVertical: 10,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  transcriptCard: {
    padding: 20,
    backgroundColor: 'rgba(15, 12, 32, 0.5)',
  },
  loadingBox: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  processingText: {
    color: '#9CA3AF',
    fontSize: 13,
  },
  transcriptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  transcriptLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#A855F7',
    marginLeft: 6,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  transcriptText: {
    fontSize: 15,
    color: '#E5E7EB',
    fontStyle: 'italic',
    lineHeight: 22,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginVertical: 12,
  },
  voiceMessageSection: {
    marginTop: 4,
  },
  voiceMessageHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  playBtn: {
    marginTop: 2,
  },
  aiLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#10B981',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  aiMessageText: {
    fontSize: 14,
    color: '#D1D5DB',
    lineHeight: 20,
  },
  actionsContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  micButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseRing: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: '#EC4899',
    backgroundColor: 'rgba(236, 72, 153, 0.2)',
  },
  micWrapper: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  micButton: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 8,
  },
  micButtonActive: {
    backgroundColor: '#EC4899',
    shadowColor: '#EC4899',
  },
  actionPrompt: {
    color: '#9CA3AF',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 16,
    letterSpacing: 0.5,
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 8,
  },
  btnSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: 16,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  btnSecondaryText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
  btnPrimary: {
    flex: 1,
    marginLeft: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  gradientBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    paddingHorizontal: 20,
  },
  btnPrimaryText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
