import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable, 
  StatusBar, 
  ActivityIndicator, 
  Alert, 
  TextInput, 
  ScrollView, 
  Switch, 
  Dimensions, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, Stack } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { API_URL } from '../constants/Api';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function AdminConfigScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Loaders & State
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form states
  const [priceMad, setPriceMad] = useState('99');
  const [isTryOnPremium, setIsTryOnPremium] = useState(true);
  const [isBeautyPremium, setIsBeautyPremium] = useState(true);
  const [isVoicePremium, setIsVoicePremium] = useState(true);
  const [isSentimentsPremium, setIsSentimentsPremium] = useState(false);
  const [isMusicPremium, setIsMusicPremium] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          router.replace('/auth');
          return;
        }

        const response = await fetch(`${API_URL}/system-config`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          setPriceMad(String(data.premiumPriceMad || 99));
          setIsTryOnPremium(!!data.isTryOnPremium);
          setIsBeautyPremium(!!data.isBeautyPremium);
          setIsVoicePremium(!!data.isVoicePremium);
          setIsSentimentsPremium(!!data.isSentimentsPremium);
          setIsMusicPremium(!!data.isMusicPremium);
          
          await AsyncStorage.setItem('system_config', JSON.stringify(data));
        } else {
          Alert.alert('Erreur', 'Impossible de charger la configuration globale.');
        }
      } catch (err) {
        console.log('Error loading admin config:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  const handleSave = async () => {
    const parsedPrice = parseFloat(priceMad);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      Alert.alert('Erreur', 'Veuillez saisir un prix valide supérieur à 0.');
      return;
    }

    setSaving(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${API_URL}/system-config`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          premiumPriceMad: parsedPrice,
          isTryOnPremium,
          isBeautyPremium,
          isVoicePremium,
          isSentimentsPremium,
          isMusicPremium
        })
      });

      if (response.ok) {
        const updatedData = await response.json();
        await AsyncStorage.setItem('system_config', JSON.stringify(updatedData));
        Alert.alert('Succès', 'Configurations système enregistrées avec succès ! ✨');
        router.back();
      } else {
        const errData = await response.json();
        throw new Error(errData.message || 'La mise à jour a échoué.');
      }
    } catch (err: any) {
      Alert.alert('Erreur de sauvegarde', err.message || 'Impossible de mettre à jour le système.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" />
        <LinearGradient colors={['#0A0612', '#140E26']} style={StyleSheet.absoluteFillObject} />
        <ActivityIndicator size="large" color="#FF8E53" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" />

      {/* Luxury Dark Mode Gradient Background */}
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

      <View style={[styles.content, { paddingTop: insets.top + 12 }]}>
        
        {/* HEADER */}
        <Animated.View entering={FadeInUp.duration(800).springify()} style={styles.header}>
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </Pressable>
          <Text style={styles.headerTitle}>Gestion Système</Text>
          <View style={{ width: 48 }} />
        </Animated.View>

        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={[styles.mainScroll, { paddingBottom: insets.bottom + 40 }]}
          showsVerticalScrollIndicator={false}
        >
          
          {/* INTRO BOX */}
          <Animated.View entering={FadeInDown.delay(100).duration(800).springify()} style={styles.introBox}>
            <View style={styles.adminIconBadge}>
              <MaterialCommunityIcons name="shield-key" size={32} color="#F59E0B" />
            </View>
            <Text style={styles.title}>Panneau d'Administration</Text>
            <Text style={styles.subtitle}>
              Configurez dynamiquement le modèle économique de l'application Aura. Modifiez le prix du plan Premium et choisissez quelles fonctionnalités sont gratuites ou payantes.
            </Text>
          </Animated.View>

          {/* SECTION: PRICE */}
          <Animated.View entering={FadeInDown.delay(200).duration(800).springify()} style={styles.sectionCardShadow}>
            <BlurView intensity={30} tint="dark" style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>💰 Tarif Aura Premium</Text>
              <Text style={styles.sectionDesc}>Définissez le prix mensuel de l'abonnement en Dirham Marocain (MAD).</Text>
              
              <View style={styles.priceInputRow}>
                <TextInput
                  style={styles.priceInput}
                  value={priceMad}
                  onChangeText={setPriceMad}
                  keyboardType="numeric"
                  placeholder="99"
                  placeholderTextColor="rgba(255,255,255,0.2)"
                  selectionColor="#F59E0B"
                />
                <Text style={styles.priceSuffix}>MAD / mois</Text>
              </View>
            </BlurView>
          </Animated.View>

          {/* SECTION: PREMIUM SWITCHES */}
          <Animated.View entering={FadeInDown.delay(300).duration(800).springify()} style={styles.sectionCardShadow}>
            <BlurView intensity={30} tint="dark" style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>🔒 Statut des fonctionnalités</Text>
              <Text style={styles.sectionDesc}>Activez pour rendre la fonctionnalité payante (Premium) ou désactivez pour la rendre gratuite pour tous.</Text>
              
              <View style={styles.switchesContainer}>
                
                {/* Switch VTON */}
                <View style={styles.switchRow}>
                  <View style={styles.switchTexts}>
                    <View style={styles.featureLabelRow}>
                      <Ionicons name="shirt-outline" size={18} color="#FF6B6B" style={{ marginRight: 8 }} />
                      <Text style={styles.switchLabel}>Essayage Virtuel (VTON)</Text>
                    </View>
                    <Text style={styles.switchSub}>Essayage virtuel de vêtements avec IA (3 essais gratuits pour les non-premium)</Text>
                  </View>
                  <Switch
                    value={isTryOnPremium}
                    onValueChange={setIsTryOnPremium}
                    trackColor={{ false: '#4A4A6A', true: '#8B5CF6' }}
                    thumbColor="#FFF"
                  />
                </View>

                <View style={styles.divider} />

                {/* Switch Beauté */}
                <View style={styles.switchRow}>
                  <View style={styles.switchTexts}>
                    <View style={styles.featureLabelRow}>
                      <Ionicons name="color-filter-outline" size={18} color="#F59E0B" style={{ marginRight: 8 }} />
                      <Text style={styles.switchLabel}>Colorimétrie & Beauté</Text>
                    </View>
                    <Text style={styles.switchSub}>Palette de couleurs saisonnière et guide cosmétique complet</Text>
                  </View>
                  <Switch
                    value={isBeautyPremium}
                    onValueChange={setIsBeautyPremium}
                    trackColor={{ false: '#4A4A6A', true: '#8B5CF6' }}
                    thumbColor="#FFF"
                  />
                </View>

                <View style={styles.divider} />

                {/* Switch Voice */}
                <View style={styles.switchRow}>
                  <View style={styles.switchTexts}>
                    <View style={styles.featureLabelRow}>
                      <Ionicons name="mic-outline" size={18} color="#00C6FF" style={{ marginRight: 8 }} />
                      <Text style={styles.switchLabel}>Assistant Vocal Pocket Stylist</Text>
                    </View>
                    <Text style={styles.switchSub}>Recommandations de tenues à la voix via IA</Text>
                  </View>
                  <Switch
                    value={isVoicePremium}
                    onValueChange={setIsVoicePremium}
                    trackColor={{ false: '#4A4A6A', true: '#8B5CF6' }}
                    thumbColor="#FFF"
                  />
                </View>

                <View style={styles.divider} />

                {/* Switch Sentiments */}
                <View style={styles.switchRow}>
                  <View style={styles.switchTexts}>
                    <View style={styles.featureLabelRow}>
                      <Ionicons name="pulse-outline" size={18} color="#EC4899" style={{ marginRight: 8 }} />
                      <Text style={styles.switchLabel}>Analyse Sentiments</Text>
                    </View>
                    <Text style={styles.switchSub}>Analyse émotionnelle de visage / voix</Text>
                  </View>
                  <Switch
                    value={isSentimentsPremium}
                    onValueChange={setIsSentimentsPremium}
                    trackColor={{ false: '#4A4A6A', true: '#8B5CF6' }}
                    thumbColor="#FFF"
                  />
                </View>

                <View style={styles.divider} />

                {/* Switch Music */}
                <View style={styles.switchRow}>
                  <View style={styles.switchTexts}>
                    <View style={styles.featureLabelRow}>
                      <Ionicons name="headset-outline" size={18} color="#10B981" style={{ marginRight: 8 }} />
                      <Text style={styles.switchLabel}>Recommandation Musique</Text>
                    </View>
                    <Text style={styles.switchSub}>Playlist d'ambiance et thérapie de fréquence selon humeur</Text>
                  </View>
                  <Switch
                    value={isMusicPremium}
                    onValueChange={setIsMusicPremium}
                    trackColor={{ false: '#4A4A6A', true: '#8B5CF6' }}
                    thumbColor="#FFF"
                  />
                </View>

              </View>
            </BlurView>
          </Animated.View>

          {/* ACTION BUTTON */}
          <Animated.View entering={FadeInDown.delay(400).duration(800).springify()} style={styles.saveContainer}>
            <Pressable 
              style={[styles.saveBtn, saving && { opacity: 0.8 }]} 
              onPress={handleSave}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator size="small" color="#000" />
              ) : (
                <>
                  <Ionicons name="checkmark-circle-outline" size={20} color="#000" style={{ marginRight: 8 }} />
                  <Text style={styles.saveBtnText}>Enregistrer la configuration</Text>
                </>
              )}
            </Pressable>
          </Animated.View>

        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  mainScroll: {
    paddingVertical: 12,
  },
  orbTopRight: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 999,
    backgroundColor: '#8B5CF6',
    top: -50,
    right: -50,
    opacity: 0.25,
  },
  orbBottomLeft: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 999,
    backgroundColor: '#FF8E53',
    bottom: -100,
    left: -100,
    opacity: 0.15,
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
  backBtn: {
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
  introBox: {
    alignItems: 'center',
    marginBottom: 28,
    marginTop: 10,
  },
  adminIconBadge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.25)',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFF',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: '#A0A0B0',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 12,
  },
  sectionCardShadow: {
    marginBottom: 22,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 6,
    overflow: 'hidden',
  },
  sectionCard: {
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFF',
    marginBottom: 6,
  },
  sectionDesc: {
    fontSize: 12,
    color: '#A0A0B0',
    lineHeight: 18,
    marginBottom: 16,
  },
  priceInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    height: 60,
    paddingHorizontal: 18,
  },
  priceInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: '800',
    color: '#F59E0B',
  },
  priceSuffix: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFF',
  },
  switchesContainer: {
    gap: 16,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchTexts: {
    flex: 1,
    marginRight: 16,
  },
  featureLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFF',
  },
  switchSub: {
    fontSize: 11,
    color: '#7E7E94',
    lineHeight: 16,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  saveContainer: {
    marginTop: 10,
  },
  saveBtn: {
    height: 56,
    borderRadius: 18,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FFF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#000',
  },
});
