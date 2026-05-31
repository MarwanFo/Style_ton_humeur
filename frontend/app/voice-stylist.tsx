import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, StatusBar, ActivityIndicator, Alert, Dimensions, Image, ScrollView, Modal } from 'react-native';
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
import { useRouter, Stack } from 'expo-router';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system/legacy';
import * as Speech from 'expo-speech';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../constants/Api';

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

  // Assistant Responses & Speech State
  const [lastTranscript, setLastTranscript] = useState<string>('');
  const [aiVoiceMessage, setAiVoiceMessage] = useState<string>('');
  const [aiVoiceMessageUrl, setAiVoiceMessageUrl] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const soundRef = useRef<Audio.Sound | null>(null);

  // Photo attachment states
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [checkinId, setCheckinId] = useState<number | null>(null);

  // Animation values
  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0.4);
  const waveHeight1 = useSharedValue(10);
  const waveHeight2 = useSharedValue(10);
  const waveHeight3 = useSharedValue(10);
  const waveHeight4 = useSharedValue(10);

  useEffect(() => {
    const checkPremium = async () => {
      try {
        const userStr = await AsyncStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : null;
        
        let isPremiumRequired = true;
        try {
          const configRes = await fetch(`${API_URL}/system-config`);
          if (configRes.ok) {
            const data = await configRes.json();
            isPremiumRequired = !!data.isVoicePremium;
            await AsyncStorage.setItem('system_config', JSON.stringify(data));
          } else {
            const cached = await AsyncStorage.getItem('system_config');
            if (cached) isPremiumRequired = !!JSON.parse(cached).isVoicePremium;
          }
        } catch (_) {
          const cached = await AsyncStorage.getItem('system_config');
          if (cached) isPremiumRequired = !!JSON.parse(cached).isVoicePremium;
        }

        if (isPremiumRequired && (!user || user.plan !== 'PREMIUM')) {
          setTimeout(() => {
            Alert.alert(
              "👑 Assistant Vocal Premium",
              "L'Assistant Vocal Stylist est réservé aux membres Aura Premium.",
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
        console.log('Error verifying voice stylist access:', err);
      }
    };
    checkPremium();

    // Request microphone permissions on load
    const reqPermission = async () => {
      await Audio.requestPermissionsAsync();
      await ImagePicker.requestCameraPermissionsAsync();
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    };
    reqPermission();

    return () => {
      // Clean up speech, audio playback and intervals on unmount
      Speech.stop();
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(() => {});
      }
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
      showCustomAlert(
        'Permission microphone',
        "Veuillez accorder la permission d'enregistrer dans les paramètres de votre appareil.",
        [{ text: "OK", onPress: () => {} }],
        "mic-off-outline",
        "#EF4444"
      );
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
          showCustomAlert(
            "Enregistrement vide",
            "Aucun son n'a été détecté. Veuillez vérifier les permissions de votre micro et réessayer.",
            [{ text: "OK", onPress: () => {} }],
            "alert-circle-outline",
            "#EF4444"
          );
          return;
        }

        if (duration < 2) {
          showCustomAlert(
            "Message trop court",
            "Veuillez parler plus longtemps (au moins 2 secondes) pour que l'assistant puisse vous conseiller.",
            [{ text: "OK", onPress: () => {} }],
            "hourglass-outline",
            "#EC4899"
          );
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
      setAiVoiceMessageUrl(data.aiVoiceMessageUrl || null);
      setCheckinId(data.checkin?.id || null);
      setPhotoUri(null);

      // Store recommendations & check-in data locally
      await AsyncStorage.setItem('latestRecommendation', JSON.stringify(data.recommendation));
      await AsyncStorage.setItem('latestCheckin', JSON.stringify(data.checkin));

      // Auto play the AI spoken voice reply
      if (data.aiVoiceMessageUrl) {
        playAudioUrl(data.aiVoiceMessageUrl);
      } else if (data.aiVoiceMessage) {
        speakResponse(data.aiVoiceMessage);
      }
    } catch (err: any) {
      console.log('Processing voice check-in failed:', err.message || err);
      showCustomAlert(
        'Erreur',
        err.message || 'Impossible de transcrire ou de générer les recommandations. Veuillez réessayer.',
        [{ text: "Réessayer", onPress: () => {} }],
        "alert-circle-outline",
        "#EF4444"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const playAudioUrl = async (url: string) => {
    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync().catch(() => {});
        soundRef.current = null;
      }
      setIsSpeaking(true);
      startAnimateWave();

      const { sound } = await Audio.Sound.createAsync(
        { uri: url },
        { shouldPlay: true }
      );
      soundRef.current = sound;
      
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setIsSpeaking(false);
          stopAnimateWave();
        }
      });
    } catch (err) {
      console.error("Failed to play neural voice audio", err);
      if (aiVoiceMessage) {
        speakResponse(aiVoiceMessage);
      } else {
        setIsSpeaking(false);
        stopAnimateWave();
      }
    }
  };

  const stopSpeaking = async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.stopAsync().catch(() => {});
        await soundRef.current.unloadAsync().catch(() => {});
        soundRef.current = null;
      }
      Speech.stop();
    } catch (e) {}
    setIsSpeaking(false);
    stopAnimateWave();
  };

  const speakResponse = (text: string) => {
    setIsSpeaking(true);
    startAnimateWave();
    Speech.speak(text, {
      language: 'fr-FR',
      onDone: () => {
        setIsSpeaking(false);
        stopAnimateWave();
      },
      onError: () => {
        setIsSpeaking(false);
        stopAnimateWave();
      },
    });
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else if (aiVoiceMessageUrl) {
      playAudioUrl(aiVoiceMessageUrl);
    } else if (aiVoiceMessage) {
      speakResponse(aiVoiceMessage);
    }
  };

  const handleUploadPhoto = async () => {
    if (!checkinId) {
      showCustomAlert(
        "Erreur",
        "Session de check-in introuvable.",
        [{ text: "OK", onPress: () => {} }],
        "alert-circle-outline",
        "#EF4444"
      );
      return;
    }

    showCustomAlert(
      "Silhouette & Fitting Room",
      "Ajoutez une photo de votre silhouette complète pour débloquer la cabine d'essayage virtuelle (VTON) :",
      [
        { text: "📸 Appareil Photo", onPress: () => launchImagePicker(true) },
        { text: "🖼️ Galerie photo", onPress: () => launchImagePicker(false) },
        { text: "Annuler", onPress: () => {}, isCancel: true }
      ],
      "camera-outline"
    );
  };

  const launchImagePicker = async (isCamera: boolean) => {
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

      setIsUploadingPhoto(true);
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        setIsUploadingPhoto(false);
        router.push('/auth');
        return;
      }

      const response = await fetch(`${API_URL}/checkins/add-photo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          checkinId: checkinId,
          base64Image: asset.base64,
          mimeType: asset.mimeType || 'image/jpeg',
        }),
      });

      const resData = await response.json();
      setIsUploadingPhoto(false);

      if (!response.ok) {
        showCustomAlert(
          "Erreur",
          resData.message || "Impossible d'importer la photo.",
          [{ text: "OK", onPress: () => {} }],
          "alert-circle-outline",
          "#EF4444"
        );
        return;
      }

      setPhotoUri(resData.imageUrl);
      
      // Update AsyncStorage to make photo available in fitting room
      const latestCheckinStr = await AsyncStorage.getItem('latestCheckin');
      if (latestCheckinStr) {
        const latestCheckin = JSON.parse(latestCheckinStr);
        latestCheckin.imageUrl = resData.imageUrl;
        await AsyncStorage.setItem('latestCheckin', JSON.stringify(latestCheckin));
      }
      
      const latestRecoStr = await AsyncStorage.getItem('latestRecommendation');
      if (latestRecoStr) {
        const latestReco = JSON.parse(latestRecoStr);
        latestReco.imageUrl = resData.imageUrl;
        await AsyncStorage.setItem('latestRecommendation', JSON.stringify(latestReco));
      }

      showCustomAlert(
        "Photo Ajoutée !",
        "Votre silhouette est enregistrée. Elle sera affichée dans le miroir d'essayage.",
        [{ text: "Super !", onPress: () => {} }],
        "checkmark-circle-outline",
        "#10B981"
      );
    } catch (err) {
      setIsUploadingPhoto(false);
      showCustomAlert(
        "Erreur",
        "Une anomalie s'est produite lors de l'import de la photo.",
        [{ text: "OK", onPress: () => {} }],
        "alert-circle-outline",
        "#EF4444"
      );
    }
  };

  const navigateToAnalysis = () => {
    router.replace('/style-analysis');
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" />
      
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

      <View style={[styles.content, { paddingTop: insets.top + 12, paddingBottom: 0, flex: 1 }]}>
        
        {/* HEADER */}
        <Animated.View entering={FadeInUp.duration(800).springify()} style={styles.header}>
          <Pressable style={styles.closeBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </Pressable>
          <Text style={styles.headerTitle}>Pocket Stylist IA</Text>
          <View style={{ width: 48 }} />
        </Animated.View>

        {/* MAIN BODY */}
        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.mainContainer} 
          showsVerticalScrollIndicator={false}
        >
          
          {/* TITLE & DESCRIPTION */}
          <Animated.View entering={FadeInDown.delay(100).duration(800).springify()} style={styles.introBox}>
            <Text style={styles.title}>Comment vous sentez-vous ?</Text>
            <Text style={styles.subtitle}>
              Parlez librement de votre humeur, de votre journée, ou de l'événement que vous préparez. Votre styliste vous écoute et composera votre look.
            </Text>
          </Animated.View>

          {/* AUDIO WAVE VISUALIZATION */}
          <View style={styles.waveContainer}>
            {isRecording || isSpeaking ? (
              <View style={styles.waveRow}>
                <Animated.View style={[styles.waveBar, isSpeaking && styles.waveBarSpeaking, waveAnimStyle1]} />
                <Animated.View style={[styles.waveBar, isSpeaking && styles.waveBarSpeaking, waveAnimStyle2]} />
                <Animated.View style={[styles.waveBar, isSpeaking && styles.waveBarSpeaking, waveAnimStyle3]} />
                <Animated.View style={[styles.waveBar, isSpeaking && styles.waveBarSpeaking, waveAnimStyle4]} />
                <Animated.View style={[styles.waveBar, isSpeaking && styles.waveBarSpeaking, waveAnimStyle3]} />
                <Animated.View style={[styles.waveBar, isSpeaking && styles.waveBarSpeaking, waveAnimStyle2]} />
                <Animated.View style={[styles.waveBar, isSpeaking && styles.waveBarSpeaking, waveAnimStyle1]} />
              </View>
            ) : (
              <View style={styles.idleWave}>
                <Feather name="mic" size={32} color="rgba(255,255,255,0.3)" />
              </View>
            )}
            {isRecording && (
              <Text style={styles.durationText}>{formatDuration(recordDuration)}</Text>
            )}
            {isSpeaking && (
              <Text style={[styles.durationText, { color: '#10B981' }]}>L'assistant parle...</Text>
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

          {/* PHOTO UPLOAD CARD */}
          {lastTranscript && !isProcessing && (
            <Animated.View entering={FadeInDown.delay(100).duration(600)} style={styles.photoUploadCard}>
              <BlurView intensity={25} tint="dark" style={styles.photoUploadBlur}>
                <View style={styles.photoUploadHeader}>
                  <Ionicons name="camera" size={20} color="#EC4899" />
                  <Text style={styles.photoUploadTitle}>
                    {photoUri ? "Silhouette Enregistrée ! ✨" : "Ajustement Cabine (Optionnel) 👗"}
                  </Text>
                </View>
                <Text style={styles.photoUploadText}>
                  {photoUri 
                    ? "Votre photo de silhouette a bien été liée à cette analyse. Vous pourrez l'essayer virtuellement !"
                    : "Prenez ou importez une photo complète de votre silhouette pour essayer virtuellement les looks suggérés."}
                </Text>
                {isUploadingPhoto ? (
                  <View style={styles.uploadingBox}>
                    <ActivityIndicator size="small" color="#EC4899" style={{ marginRight: 8 }} />
                    <Text style={styles.uploadingText}>Téléversement de l'image...</Text>
                  </View>
                ) : photoUri ? (
                  <View style={styles.photoAttachedContainer}>
                    <Image source={{ uri: photoUri }} style={styles.attachedImagePreview} />
                    <Pressable style={styles.changePhotoBtn} onPress={handleUploadPhoto}>
                      <Ionicons name="create-outline" size={16} color="#FFF" style={{ marginRight: 4 }} />
                      <Text style={styles.changePhotoText}>Changer de photo</Text>
                    </Pressable>
                  </View>
                ) : (
                  <Pressable style={styles.addPhotoActionBtn} onPress={handleUploadPhoto}>
                    <Ionicons name="cloud-upload-outline" size={18} color="#FFF" style={{ marginRight: 6 }} />
                    <Text style={styles.addPhotoActionText}>Ajouter ma photo silhouette</Text>
                  </Pressable>
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

        </ScrollView>
      </View>

      {/* PREMIUM CUSTOM ALERT MODAL */}
      <Modal visible={!!customAlert && customAlert.visible} transparent animationType="fade">
        <View style={styles.customAlertOverlay}>
          <Pressable style={StyleSheet.absoluteFillObject} onPress={() => setCustomAlert(null)} />
          <Animated.View entering={FadeInDown.duration(400).springify()} style={styles.customAlertShadow}>
            <BlurView intensity={95} tint="dark" style={styles.customAlertCard}>
              {customAlert?.icon && (
                <View style={[styles.customAlertIconFrame, { backgroundColor: `${customAlert.iconColor || '#8B5CF6'}15` }]}>
                  <Ionicons name={customAlert.icon as any} size={28} color={customAlert.iconColor || '#A78BFA'} />
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
                        isCancel ? styles.customAlertBtnCancel : { backgroundColor: '#8B5CF6' }
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
  },
  scrollView: {
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
    flexGrow: 1,
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
  waveBarSpeaking: {
    backgroundColor: '#10B981',
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
  photoUploadCard: {
    marginVertical: 10,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(236, 72, 153, 0.25)',
    shadowColor: '#EC4899',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  photoUploadBlur: {
    padding: 20,
    backgroundColor: 'rgba(21, 16, 42, 0.6)',
  },
  photoUploadHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  photoUploadTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFF',
    marginLeft: 8,
    letterSpacing: 0.2,
  },
  photoUploadText: {
    fontSize: 12,
    color: '#9CA3AF',
    lineHeight: 18,
    marginBottom: 16,
  },
  uploadingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
  },
  uploadingText: {
    color: '#EC4899',
    fontSize: 13,
    fontWeight: '600',
  },
  photoAttachedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  attachedImagePreview: {
    width: 48,
    height: 64,
    borderRadius: 8,
    backgroundColor: '#374151',
  },
  changePhotoBtn: {
    flex: 1,
    marginLeft: 14,
    height: 38,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  changePhotoText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '600',
  },
  addPhotoActionBtn: {
    height: 44,
    borderRadius: 12,
    backgroundColor: '#EC4899',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    shadowColor: '#EC4899',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  addPhotoActionText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
  customAlertOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  customAlertShadow: {
    width: '100%',
    maxWidth: 320,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 10,
    borderRadius: 28,
    overflow: 'hidden',
  },
  customAlertCard: {
    backgroundColor: 'rgba(17, 24, 39, 0.95)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
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
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  customAlertSub: {
    fontSize: 14,
    color: '#9CA3AF',
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
  },
  customAlertBtnCancel: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  customAlertBtnText: {
    fontSize: 15,
    fontWeight: '700',
  },
  customAlertBtnTextCancel: {
    color: '#D1D5DB',
  },
});
