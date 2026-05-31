import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable, 
  Image, 
  Alert, 
  ScrollView,
  ActivityIndicator,
  Switch,
  Modal,
  TextInput,
  Vibration,
  KeyboardAvoidingView,
  Platform,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { API_URL } from '@/constants/Api';
import { useNotifications } from '@/hooks/useNotifications';
import Animated, { FadeIn, FadeInUp, FadeInDown, useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';


const { width, height } = Dimensions.get('window');

const ConfettiParticle = ({ left, color, shape, size }: any) => {
  const translateY = useSharedValue(height);
  const opacity = useSharedValue(1);
  const rotate = useSharedValue(0);

  useEffect(() => {
    translateY.value = withTiming(-100, { duration: Math.random() * 2500 + 1500 });
    opacity.value = withTiming(0, { duration: Math.random() * 2500 + 1500 });
    rotate.value = withTiming(Math.random() * 360, { duration: Math.random() * 2500 + 1500 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    left,
    zIndex: 9999,
    width: size,
    height: size,
    borderRadius: shape === 'circle' ? size / 2 : 2,
    backgroundColor: color,
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` }
    ]
  }));

  return <Animated.View style={animatedStyle} />;
};

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [user, setUser] = useState<any>(null);
  const [streak, setStreak] = useState<any>(null);
  const [badges, setBadges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { notificationsEnabled, toggleNotifications } = useNotifications();
  const [latestReco, setLatestReco] = useState<any>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [show2faModal, setShow2faModal] = useState(false);
  const [twoFactorSecret, setTwoFactorSecret] = useState('');
  const [twoFactorUri, setTwoFactorUri] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [twoFactorLoading, setTwoFactorLoading] = useState(false);

  // Aura Premium Payment States
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [particles, setParticles] = useState<any[]>([]);
  
  // Apple Pay / FaceID Scanner States
  const [isApplePaying, setIsApplePaying] = useState(false);
  const [faceIdState, setFaceIdState] = useState<'idle' | 'scanning' | 'success' | 'failed'>('idle');

  // Dynamic System Configuration state
  const [systemConfig, setSystemConfig] = useState<any>({
    premiumPriceMad: 99.0,
    isTryOnPremium: true,
    isBeautyPremium: true,
    isVoicePremium: true,
    isSentimentsPremium: false,
    isMusicPremium: false,
  });

  const generateParticles = () => {
    const arr = [];
    const colors = ['#FFD700', '#FF8E53', '#8B5CF6', '#10B981', '#3B82F6', '#EC4899'];
    for (let i = 0; i < 40; i++) {
      arr.push({
        id: Math.random().toString(),
        left: Math.random() * width,
        size: Math.random() * 8 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        shape: Math.random() > 0.5 ? 'circle' : 'square',
      });
    }
    setParticles(arr);
    setTimeout(() => setParticles([]), 4500);
  };


  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const userData = await AsyncStorage.getItem('user');

        if (!token || !userData) {
          setTimeout(() => {
            router.replace('/auth');
          }, 150);
          return;
        }

        // Set user immediately from cached local storage
        try {
          setUser(JSON.parse(userData));
        } catch (e) {}

        // Load cached system config, recommendations, and checkin image first
        try {
          const cachedConfig = await AsyncStorage.getItem('system_config');
          if (cachedConfig) {
            setSystemConfig(JSON.parse(cachedConfig));
          }
        } catch (e) {}

        try {
          const recoStr = await AsyncStorage.getItem('latestRecommendation');
          if (recoStr) {
            setLatestReco(JSON.parse(recoStr));
          }
        } catch (e) {}

        try {
          const checkinStr = await AsyncStorage.getItem('latestCheckin');
          if (checkinStr) {
            const parsedCheckin = JSON.parse(checkinStr);
            if (parsedCheckin.imageUrl) {
              setAvatarUrl(parsedCheckin.imageUrl);
            }
          }
        } catch (e) {}

        // DISABLE LOADING SPINNER IMMEDIATELY!
        // This ensures the screen renders instantly using cached local state
        // and doesn't get stuck on the ActivityIndicator if network calls hang!
        setLoading(false);

        // Define a local fetch with timeout to prevent hanging connections
        const fetchWithTimeout = async (url: string, options: any = {}, timeout: number = 2500) => {
          const controller = new AbortController();
          const id = setTimeout(() => controller.abort(), timeout);
          try {
            const response = await fetch(url, { ...options, signal: controller.signal });
            clearTimeout(id);
            return response;
          } catch (err) {
            clearTimeout(id);
            throw err;
          }
        };

        // Fetch fresh user profile details (includes 2FA state) in background
        try {
          const meRes = await fetchWithTimeout(`${API_URL}/users/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });

          if (meRes.status === 401) {
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('user');
            setTimeout(() => {
              router.replace('/auth');
            }, 150);
            return;
          }

          if (meRes.ok) {
            const freshUser = await meRes.json();
            setUser(freshUser);
            await AsyncStorage.setItem('user', JSON.stringify(freshUser));
          }
        } catch (e) {}

        // Fetch dynamic system configuration in background
        try {
          const configRes = await fetchWithTimeout(`${API_URL}/system-config`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (configRes.ok) {
            const data = await configRes.json();
            setSystemConfig(data);
            await AsyncStorage.setItem('system_config', JSON.stringify(data));
          }
        } catch (e) {}

        // Fetch actual streak from backend in background
        try {
          const response = await fetchWithTimeout(`${API_URL}/checkins/streak`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const streakData = await response.json();
            setStreak(streakData);
          }
        } catch (e) {}

        // Fetch badges from backend in background
        try {
          const badgesResponse = await fetchWithTimeout(`${API_URL}/checkins/badges`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (badgesResponse.ok) {
            const badgesData = await badgesResponse.json();
            setBadges(badgesData);
          }
        } catch (e) {}

      } catch (err) {
        // Fallback to local offline state if network is unreachable
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Déconnexion', 
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.clear();
            router.replace('/auth');
          }
        }
      ]
    );
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      'Suppression du compte',
      'ATTENTION: Cette action est irréversible. Toutes vos données seront supprimées définitivement pour respecter la conformité RGPD. Souhaitez-vous continuer ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Supprimer définitivement', 
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              const token = await AsyncStorage.getItem('token');
              const response = await fetch(`${API_URL}/users/me`, {
                method: 'DELETE',
                headers: {
                  'Authorization': `Bearer ${token}`,
                },
              });

              if (response.ok) {
                await AsyncStorage.clear();
                Alert.alert('Compte supprimé', 'Votre compte et toutes vos données associées ont été purgés avec succès.');
                router.replace('/auth');
              } else {
                throw new Error("Échec de la suppression.");
              }
            } catch (err: any) {
              Alert.alert('Erreur', err.message || 'Impossible de supprimer votre compte pour le moment.');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const getBadgeEmoji = (code: string) => {
    switch (code) {
      case 'FIRST_CHECKIN':
        return '🌱';
      case 'STREAK_3':
        return '🔥';
      case 'STREAK_7':
        return '👑';
      default:
        return '⭐';
    }
  };

  const handleShareStylePass = () => {
    Alert.alert(
      "Style Pass Exporté",
      "Votre Style Pass IA a été généré avec succès et enregistré dans votre galerie de photos.",
      [{ text: "Super !", onPress: () => {} }]
    );
  };

  const handle2faPress = async () => {
    if (user?.twoFactorEnabled) {
      setTwoFactorSecret('');
      setTwoFactorUri('');
      setTwoFactorCode('');
      setShow2faModal(true);
    } else {
      setTwoFactorLoading(true);
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await fetch(`${API_URL}/auth/2fa/generate`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Impossible de générer le secret 2FA.');
        }

        setTwoFactorSecret(data.secret);
        setTwoFactorUri(data.otpauthUrl);
        setTwoFactorCode('');
        setShow2faModal(true);
      } catch (err: any) {
        Alert.alert('Erreur', err.message || 'Une erreur est survenue.');
      } finally {
        setTwoFactorLoading(false);
      }
    }
  };

  const handleConfirm2fa = async () => {
    if (!twoFactorCode || twoFactorCode.length !== 6) {
      Alert.alert('Erreur', 'Veuillez saisir le code à 6 chiffres.');
      return;
    }

    setTwoFactorLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const endpoint = user?.twoFactorEnabled ? 'turn-off' : 'turn-on';
      
      const response = await fetch(`${API_URL}/auth/2fa/${endpoint}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ code: twoFactorCode }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Code de validation invalide.');
      }

      const updatedUser = { ...user, twoFactorEnabled: !user.twoFactorEnabled };
      setUser(updatedUser);
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      
      setShow2faModal(false);
      Alert.alert(
        'Succès',
        user?.twoFactorEnabled 
          ? 'La validation en deux étapes a été désactivée.' 
          : 'La validation en deux étapes a été activée avec succès !'
      );
    } catch (err: any) {
      Alert.alert('Erreur', err.message || 'Une erreur est survenue.');
    } finally {
      setTwoFactorLoading(false);
    }
  };

  const handlePay = async () => {
    if (!cardName.trim()) {
      Alert.alert('Erreur', 'Veuillez saisir le nom du titulaire de la carte.');
      return;
    }
    const cleanNum = cardNumber.replace(/\s+/g, '');
    if (cleanNum.length !== 16) {
      Alert.alert('Erreur', 'Le numéro de carte doit contenir 16 chiffres.');
      return;
    }
    if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
      Alert.alert('Erreur', "La date d'expiration doit être au format MM/AA.");
      return;
    }
    if (cardCvv.length < 3) {
      Alert.alert('Erreur', 'Le code CVV doit contenir au moins 3 chiffres.');
      return;
    }

    setIsPaying(true);
    Vibration.vibrate(50);

    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${API_URL}/users/upgrade`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'La transaction a échoué.');
      }

      Vibration.vibrate([0, 100, 50, 100, 50, 200]);
      
      const updatedUser = { ...user, plan: 'PREMIUM', tier: 'PREMIUM' };
      setUser(updatedUser);
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));

      setPaymentSuccess(true);
      generateParticles();
    } catch (err: any) {
      Vibration.vibrate([0, 200, 100, 200]);
      Alert.alert('Échec de la transaction', err.message || 'Impossible de traiter le paiement pour le moment.');
    } finally {
      setIsPaying(false);
    }
  };

  const handleApplePay = async () => {
    setIsApplePaying(true);
    setFaceIdState('scanning');
    Vibration.vibrate(30);

    setTimeout(async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await fetch(`${API_URL}/users/upgrade`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'La transaction a échoué.');
        }

        setFaceIdState('success');
        Vibration.vibrate([0, 100, 50, 100, 50, 200]);

        const updatedUser = { ...user, plan: 'PREMIUM', tier: 'PREMIUM' };
        setUser(updatedUser);
        await AsyncStorage.setItem('user', JSON.stringify(updatedUser));

        setTimeout(() => {
          setIsApplePaying(false);
          setPaymentSuccess(true);
          generateParticles();
        }, 1000);
      } catch (err: any) {
        setFaceIdState('failed');
        Vibration.vibrate([0, 200, 100, 200]);
        setTimeout(() => {
          setIsApplePaying(false);
          Alert.alert('Échec Apple Pay', err.message || 'La transaction a échoué.');
        }, 1000);
      }
    }, 1500);
  };


  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7F00FF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FFF8F8', '#F6F6FF', '#EFF9F9']}
        style={StyleSheet.absoluteFillObject}
      />

      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        
        {/* DYNAMIC STYLE PASS (FASHION PASSPORT) */}
        <Animated.View entering={FadeInUp.duration(800).springify()} style={[
          styles.stylePassShadow,
          user?.plan === 'PREMIUM' && { shadowColor: '#D97706', shadowOpacity: 0.3, shadowRadius: 30 }
        ]}>
          <LinearGradient
            colors={user?.plan === 'PREMIUM' ? ['#F59E0B', '#FCD34D', '#D97706', '#92400E'] : ['#1F2937', '#111827']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.stylePassCard}
          >
            <View style={[styles.passGlow, { backgroundColor: user?.plan === 'PREMIUM' ? '#FFE082' : '#8B5CF6', top: -30, right: -30 }]} />
            <View style={[styles.passGlow, { backgroundColor: user?.plan === 'PREMIUM' ? '#FFD54F' : '#EC4899', bottom: -40, left: -40 }]} />

            <View style={styles.passHeader}>
              <View style={styles.passBrandWrap}>
                <Ionicons name="sparkles" size={14} color="#FFF" style={{ marginRight: 6 }} />
                <Text style={styles.passBrandText}>STYLE TON HUMEUR</Text>
              </View>
              <View style={[styles.passCategoryBadge, user?.plan === 'PREMIUM' && { borderColor: '#FFF', backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                <Text style={[styles.passCategoryText, user?.plan === 'PREMIUM' && { color: '#FFF' }]}>
                  {user?.plan === 'PREMIUM' ? '👑 GOLD PREMIUM PASS' : 'PASSPORT STYLE'}
                </Text>
              </View>
            </View>

            <View style={styles.passBody}>
              <View style={[styles.passAvatarBorder, user?.plan === 'PREMIUM' && { borderColor: '#FFF' }]}>
                <Image 
                  source={{ uri: avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80' }} 
                  style={styles.passAvatar} 
                />
                <View style={[styles.passAvatarGlow, user?.plan === 'PREMIUM' && { borderColor: '#FFF' }]} />
              </View>
              
              <View style={styles.passIdentityWrap}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text numberOfLines={1} style={styles.passName}>{user?.displayName || 'Chaymae'}</Text>
                  {user?.plan === 'PREMIUM' && (
                    <MaterialCommunityIcons name="crown" size={18} color="#FFF" style={{ textShadowColor: 'rgba(0,0,0,0.3)', textShadowRadius: 3 }} />
                  )}
                </View>
                <Text numberOfLines={1} style={styles.passEmail}>{user?.email || 'chaymae@email.com'}</Text>
                
                <View style={styles.passTagsRow}>
                  <View style={styles.passMiniTag}>
                    <Text style={styles.passMiniTagText}>
                      {user?.gender === 'femme' ? '👩 Femme' : '👨 Homme'}
                    </Text>
                  </View>
                  <View style={styles.passMiniTag}>
                    <Text style={styles.passMiniTagText}>🎂 {user?.age || 22} ans</Text>
                  </View>
                  {user?.plan === 'PREMIUM' && (
                    <View style={[styles.passMiniTag, { backgroundColor: 'rgba(255, 255, 255, 0.25)' }]}>
                      <Text style={[styles.passMiniTagText, { color: '#FFF' }]}>👑 Premium</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>

            <View style={styles.passDivider} />

            <View style={styles.passFooter}>
              <View style={styles.passMetaBlock}>
                <Text style={styles.passMetaLabel}>ARCHÉTYPE STYLE</Text>
                <Text style={styles.passMetaValue} numberOfLines={1}>
                  {latestReco?.style_keywords?.join(', ') || 'Explorateur de Style'}
                </Text>
              </View>
              
              <View style={styles.passMetaBlockRight}>
                <Text style={styles.passMetaLabel}>HARMONIE COULEURS</Text>
                <View style={styles.paletteRow}>
                  <View style={[styles.paletteDot, { backgroundColor: '#8B5CF6' }]} />
                  <View style={[styles.paletteDot, { backgroundColor: '#3B82F6' }]} />
                  <View style={[styles.paletteDot, { backgroundColor: '#EC4899' }]} />
                  <View style={[styles.paletteDot, { backgroundColor: '#10B981' }]} />
                </View>
              </View>
            </View>

            <Pressable style={styles.passShareBtn} onPress={handleShareStylePass}>
              <Feather name="share-2" size={14} color="#FFF" style={{ marginRight: 6 }} />
              <Text style={styles.passShareBtnText}>Exporter le Style Pass</Text>
            </Pressable>
          </LinearGradient>
        </Animated.View>

        {/* METRICS SHOWCASE */}
        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <MaterialCommunityIcons name="fire" size={24} color="#FF8E53" />
            <Text style={styles.metricValue}>{streak !== null ? streak.currentStreak : 0} jours</Text>
            <Text style={styles.metricLabel}>Série Active</Text>
          </View>
          <View style={styles.metricCard}>
            <MaterialCommunityIcons name="trophy" size={24} color="#FFD700" />
            <Text style={styles.metricValue}>{streak !== null ? streak.maxStreak : 0} jours</Text>
            <Text style={styles.metricLabel}>Record Historique</Text>
          </View>
        </View>

        {/* AURA PREMIUM SUBSCRIPTION STATUS / BANNER */}
        {user?.plan !== 'PREMIUM' ? (
          <Animated.View entering={FadeInDown.delay(100).duration(800).springify()} style={styles.upgradeBannerShadow}>
            <LinearGradient
              colors={['#8B5CF6', '#EC4899']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.upgradeBanner}
            >
              <View style={styles.upgradeHeader}>
                <View style={styles.upgradeIconBadge}>
                  <MaterialCommunityIcons name="crown" size={24} color="#FFD700" />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.upgradeTitle}>AURA STUDIO PREMIUM</Text>
                  <Text style={styles.upgradeSubtitle}>Libérez tout le potentiel de l'IA</Text>
                </View>
              </View>

              <View style={styles.upgradeFeatures}>
                <View style={styles.upgradeFeatureRow}>
                  <Ionicons name="checkmark-circle" size={16} color="#FFF" style={{ marginRight: 8 }} />
                  <Text style={styles.upgradeFeatureText}>👗 Essayages virtuels cabine illimités</Text>
                </View>
                <View style={styles.upgradeFeatureRow}>
                  <Ionicons name="checkmark-circle" size={16} color="#FFF" style={{ marginRight: 8 }} />
                  <Text style={styles.upgradeFeatureText}>🎨 Débloquer l'Analyse Colorimétrique & Beauté</Text>
                </View>
                <View style={styles.upgradeFeatureRow}>
                  <Ionicons name="checkmark-circle" size={16} color="#FFF" style={{ marginRight: 8 }} />
                  <Text style={styles.upgradeFeatureText}>🎙️ Assistant Vocal prioritaire & sans limite</Text>
                </View>
              </View>

              <Pressable style={styles.upgradeBtn} onPress={() => setShowPaymentModal(true)}>
                <Text style={styles.upgradeBtnText}>Devenir Membre Premium • {systemConfig.premiumPriceMad} MAD/mois</Text>
                <Feather name="arrow-right" size={16} color="#8B5CF6" />
              </Pressable>
            </LinearGradient>
          </Animated.View>
        ) : (
          <View style={styles.premiumSuccessCard}>
            <View style={styles.premiumSuccessIconFrame}>
              <MaterialCommunityIcons name="check-decagram" size={20} color="#F59E0B" />
            </View>
            <Text style={styles.premiumSuccessText}>
              Abonnement Aura Premium Actif. Vous disposez de toutes les fonctionnalités illimitées ! ✨
            </Text>
          </View>
        )}

        {/* BADGES COLLECTION */}
        <Text style={styles.sectionTitle}>Mes Badges Collection</Text>
        <View style={styles.glassWrapper}>
          <BlurView intensity={50} tint="light" style={styles.glassCard}>
            <View style={styles.badgeGrid}>
              {badges.length > 0 ? (
                badges.map((badgeItem: any) => {
                  const isUnlocked = badgeItem.unlockedAt !== null;
                  return (
                    <View key={badgeItem.id} style={styles.badgeItem}>
                      <View style={[
                        styles.badgeIconFrame, 
                        !isUnlocked && styles.badgeIconFrameLocked
                      ]}>
                        <Text style={isUnlocked ? styles.badgeEmoji : styles.badgeEmojiLocked}>
                          {getBadgeEmoji(badgeItem.code)}
                        </Text>
                      </View>
                      <Text style={isUnlocked ? styles.badgeName : styles.badgeNameLocked}>
                        {badgeItem.name}
                      </Text>
                      <Text style={isUnlocked ? styles.badgeStatus : styles.badgeStatusLocked}>
                        {isUnlocked ? 'Obtenu' : 'Verrouillé'}
                      </Text>
                    </View>
                  );
                })
              ) : (
                <Text style={styles.emptyBadgesText}>Aucun badge disponible</Text>
              )}
            </View>
          </BlurView>
        </View>

        {/* SETTINGS ACTIONS */}
        <Text style={styles.sectionTitle}>Paramètres du Compte</Text>
        <View style={styles.actionGroupShadow}>
          <View style={styles.actionGroup}>
            
            {/* Notifications Toggle */}
            <View style={styles.actionItem}>
              <View style={[styles.actionIconFrame, { backgroundColor: 'rgba(127, 0, 255, 0.1)' }]}>
                <Feather name="bell" size={18} color="#7F00FF" />
              </View>
              <Text style={styles.actionText}>Notifications & Rappels</Text>
              <Switch
                value={notificationsEnabled}
                onValueChange={toggleNotifications}
                trackColor={{ false: '#E5E5EA', true: '#7F00FF' }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.actionDivider} />

            {/* 2FA Item */}
            <Pressable style={styles.actionItem} onPress={handle2faPress} disabled={twoFactorLoading}>
              <View style={[styles.actionIconFrame, { backgroundColor: 'rgba(139, 92, 246, 0.1)' }]}>
                {twoFactorLoading ? (
                  <ActivityIndicator size="small" color="#8B5CF6" />
                ) : (
                  <Feather name="shield" size={18} color="#8B5CF6" />
                )}
              </View>
              <Text style={styles.actionText}>Validation en deux étapes (2FA)</Text>
              <View style={styles.badge2fa}>
                <Text style={styles.badge2faText}>
                  {user?.twoFactorEnabled ? 'Activé' : 'Désactivé'}
                </Text>
              </View>
              <Feather name="chevron-right" size={16} color="#8A8A9E" style={{ marginLeft: 8 }} />
            </Pressable>

            <View style={styles.actionDivider} />

            {user?.role === 'ADMIN' && (
              <>
                <Pressable style={styles.actionItem} onPress={() => router.push('/admin' as any)}>
                  <View style={[styles.actionIconFrame, { backgroundColor: 'rgba(245, 158, 11, 0.1)' }]}>
                    <Ionicons name="shield-checkmark" size={18} color="#F59E0B" />
                  </View>
                  <Text style={styles.actionText}>Panneau d'Administration</Text>
                  <Feather name="chevron-right" size={16} color="#8A8A9E" />
                </Pressable>
                <View style={styles.actionDivider} />
              </>
            )}

            {/* Decconnexion */}
            <Pressable style={styles.actionItem} onPress={handleLogout}>
              <View style={[styles.actionIconFrame, { backgroundColor: 'rgba(255, 142, 83, 0.1)' }]}>
                <Feather name="log-out" size={18} color="#FF8E53" />
              </View>
              <Text style={styles.actionText}>Se déconnecter</Text>
              <Feather name="chevron-right" size={16} color="#8A8A9E" />
            </Pressable>

            <View style={styles.actionDivider} />

            {/* Supprimer mon compte */}
            <Pressable style={styles.actionItem} onPress={handleDeleteAccount}>
              <View style={[styles.actionIconFrame, { backgroundColor: 'rgba(231, 76, 60, 0.1)' }]}>
                <Feather name="trash-2" size={18} color="#E74C3C" />
              </View>
              <Text style={[styles.actionText, { color: '#E74C3C' }]}>Supprimer définitivement mon compte</Text>
              <Feather name="chevron-right" size={16} color="#8A8A9E" />
            </Pressable>

          </View>
        </View>

      </ScrollView>

      {/* 2FA SETUP MODAL */}
      <Modal
        visible={show2faModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShow2faModal(false)}
      >
        <View style={styles.modalOverlay}>
          <BlurView intensity={40} tint="dark" style={styles.modalBlur}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {user?.twoFactorEnabled ? 'Désactiver le 2FA' : 'Activer le 2FA'}
                </Text>
                <Pressable onPress={() => setShow2faModal(false)} style={styles.modalCloseBtn}>
                  <Ionicons name="close" size={24} color="#FFF" />
                </Pressable>
              </View>

              <ScrollView contentContainerStyle={styles.modalScroll} showsVerticalScrollIndicator={false}>
                <Text style={styles.modalDesc}>
                  {user?.twoFactorEnabled 
                    ? 'Saisissez le code de validation à 6 chiffres généré par votre application d\'authentification pour confirmer la désactivation.'
                    : 'Scannez le QR Code ci-dessous avec votre application d\'authentification (Google Authenticator, Authy, etc.) ou copiez la clé secrète.'}
                </Text>

                {!user?.twoFactorEnabled && twoFactorUri ? (
                  <View style={styles.qrWrapper}>
                    <View style={styles.qrFrame}>
                      <Image 
                        source={{ uri: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(twoFactorUri)}` }} 
                        style={styles.qrImage}
                      />
                    </View>
                    <View style={styles.secretBox}>
                      <Text style={styles.secretLabel}>CLÉ SECRÈTE</Text>
                      <Text selectable style={styles.secretValue}>{twoFactorSecret}</Text>
                    </View>
                  </View>
                ) : null}

                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>Code de validation à 6 chiffres</Text>
                  <View style={styles.inputContainer}>
                    <Feather name="shield" size={18} color="#8B5CF6" style={styles.inputIcon} />
                    <TextInput 
                      placeholder="000000" 
                      placeholderTextColor="rgba(255, 255, 255, 0.4)"
                      keyboardType="numeric"
                      maxLength={6}
                      value={twoFactorCode}
                      onChangeText={setTwoFactorCode}
                      style={styles.input}
                      selectionColor="#8B5CF6"
                    />
                  </View>
                </View>

                <Pressable style={styles.confirmBtn} onPress={handleConfirm2fa} disabled={twoFactorLoading}>
                  {twoFactorLoading ? (
                    <ActivityIndicator size="small" color="#FFF" />
                  ) : (
                    <Text style={styles.confirmBtnText}>
                      {user?.twoFactorEnabled ? 'Désactiver' : 'Activer'}
                    </Text>
                  )}
                </Pressable>
              </ScrollView>
            </View>
          </BlurView>
        </View>
      </Modal>

      {/* CONFETTI OVERLAY */}
      {particles.map((p) => (
        <ConfettiParticle
          key={p.id}
          left={p.left}
          size={p.size}
          color={p.color}
          shape={p.shape}
        />
      ))}

      {/* AURA PREMIUM PAYMENT MODAL */}
      <Modal
        visible={showPaymentModal}
        transparent
        animationType="slide"
        onRequestClose={() => {
          if (!isPaying && !isApplePaying) {
            setShowPaymentModal(false);
            setPaymentSuccess(false);
          }
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <View style={styles.modalOverlay}>
            <BlurView intensity={30} tint="dark" style={styles.modalBlur}>
              <View style={[styles.modalCard, { maxHeight: '90%', width: width * 0.95, paddingBottom: 24 }]}>
                
                {/* Header */}
                <View style={styles.modalHeader}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <MaterialCommunityIcons name="shield-check" size={20} color="#10B981" style={{ marginRight: 6 }} />
                    <Text style={styles.modalTitle}>Paiement Sécurisé Aura</Text>
                  </View>
                  {!isPaying && !isApplePaying && (
                    <Pressable 
                      onPress={() => {
                        setShowPaymentModal(false);
                        setPaymentSuccess(false);
                      }} 
                      style={styles.modalCloseBtn}
                    >
                      <Ionicons name="close" size={22} color="#FFF" />
                    </Pressable>
                  )}
                </View>

                {paymentSuccess ? (
                  /* Success View */
                  <Animated.View entering={FadeInUp.duration(600)} style={styles.paymentSuccessContainer}>
                    <View style={styles.successGlowOrb}>
                      <MaterialCommunityIcons name="crown" size={60} color="#FFD700" />
                    </View>
                    <Text style={styles.successPaymentTitle}>Bienvenue au Club Premium !</Text>
                    <Text style={styles.successPaymentDesc}>
                      Votre Style Pass est maintenant doré. Toutes les fonctionnalités de création look, cabine d'essayage et analyses sont désormais illimitées.
                    </Text>
                    <Pressable 
                      style={styles.successDoneBtn} 
                      onPress={() => {
                        setShowPaymentModal(false);
                        setPaymentSuccess(false);
                      }}
                    >
                      <Text style={styles.successDoneBtnText}>Commencer l'expérience ✨</Text>
                    </Pressable>
                  </Animated.View>
                ) : isApplePaying ? (
                  /* FaceID scanning simulation view */
                  <View style={styles.applePayContainer}>
                    {faceIdState === 'scanning' ? (
                      <Animated.View entering={FadeIn.duration(400)} style={styles.applePayScanner}>
                        <Ionicons name="scan" size={80} color="#FFF" />
                        <Text style={styles.applePayText}>Vérification FaceID / TouchID...</Text>
                        <ActivityIndicator size="small" color="#FFF" style={{ marginTop: 12 }} />
                      </Animated.View>
                    ) : faceIdState === 'success' ? (
                      <Animated.View entering={FadeIn.duration(400)} style={styles.applePaySuccess}>
                        <Ionicons name="checkmark-circle" size={80} color="#10B981" />
                        <Text style={[styles.applePayText, { color: '#10B981', fontWeight: '800' }]}>Paiement Approuvé</Text>
                      </Animated.View>
                    ) : (
                      <Animated.View entering={FadeIn.duration(400)} style={styles.applePayFailed}>
                        <Ionicons name="close-circle" size={80} color="#EF4444" />
                        <Text style={[styles.applePayText, { color: '#EF4444' }]}>Échec FaceID</Text>
                      </Animated.View>
                    )}
                  </View>
                ) : (
                  /* Main checkout page */
                  <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 4 }}>
                    
                    {/* Apple / Google Pay Express Checkout */}
                    <Text style={styles.paymentSectionLabel}>RÉGLEMENT RAPIDE</Text>
                    <View style={styles.expressPayRow}>
                      <Pressable style={styles.applePayBtn} onPress={handleApplePay}>
                        <Ionicons name="logo-apple" size={18} color="#000" style={{ marginRight: 6 }} />
                        <Text style={styles.applePayBtnText}>Apple Pay</Text>
                      </Pressable>
                      <Pressable style={styles.googlePayBtn} onPress={handleApplePay}>
                        <Ionicons name="logo-google" size={16} color="#FFF" style={{ marginRight: 6 }} />
                        <Text style={styles.googlePayBtnText}>Pay</Text>
                      </Pressable>
                    </View>

                    <View style={styles.orDividerRow}>
                      <View style={styles.orLine} />
                      <Text style={styles.orText}>OU PAR CARTE BANCAIRE</Text>
                      <View style={styles.orLine} />
                    </View>

                    {/* VIRTUAL CREDIT CARD WRAPPER */}
                    <Pressable 
                      onPress={() => setIsCardFlipped(!isCardFlipped)}
                      style={styles.virtualCardWrapper}
                    >
                      <LinearGradient
                        colors={isCardFlipped ? ['#1E2937', '#111827'] : ['#D4AF37', '#855E15']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.virtualCard}
                      >
                        {!isCardFlipped ? (
                          /* Front of Card */
                          <View style={{ flex: 1, justifyContent: 'space-between' }}>
                            <View style={styles.cardFrontHeader}>
                              <Text style={styles.cardBrandName}>AURA PREMIUM</Text>
                              <MaterialCommunityIcons name="nfc" size={24} color="#FFF" />
                            </View>
                            
                            <Image 
                              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/6404/6404078.png' }}
                              style={styles.cardChip}
                            />
                            
                            <Text style={styles.cardVisualNumber}>
                              {cardNumber ? cardNumber.replace(/(.{4})/g, '$1 ').trim() : '•••• •••• •••• ••••'}
                            </Text>

                            <View style={styles.cardFrontFooter}>
                              <View>
                                <Text style={styles.cardVisualLabel}>TITULAIRE</Text>
                                <Text numberOfLines={1} style={styles.cardVisualValue}>
                                  {cardName ? cardName.toUpperCase() : 'VOTRE NOM'}
                                </Text>
                              </View>
                              <View style={{ alignItems: 'flex-end' }}>
                                <Text style={styles.cardVisualLabel}>EXPIRE</Text>
                                <Text style={styles.cardVisualValue}>{cardExpiry || 'MM/AA'}</Text>
                              </View>
                            </View>
                          </View>
                        ) : (
                          /* Back of Card */
                          <View style={{ flex: 1, justifyContent: 'space-between', paddingVertical: 10 }}>
                            <View style={styles.cardBlackStrip} />
                            
                            <View style={styles.cardBackCvvRow}>
                              <View style={styles.cardWhiteStrip}>
                                <Text style={styles.cardSignatureDummy}>Aura Member</Text>
                              </View>
                              <View style={styles.cardCvvBadge}>
                                <Text style={styles.cardCvvText}>{cardCvv || '•••'}</Text>
                              </View>
                            </View>

                            <Text style={styles.cardBackDisclaimer}>
                              Carte de simulation pour environnement de test Aura Studio. Aucun prélèvement réel n'aura lieu.
                            </Text>
                          </View>
                        )}
                      </LinearGradient>
                      <Text style={styles.cardFlipPrompt}>
                        💡 Tapoter la carte pour la {isCardFlipped ? 'retourner face' : 'retourner pile'}
                      </Text>
                    </Pressable>

                    {/* Form Fields */}
                    <View style={styles.paymentForm}>
                      <View style={styles.paymentInputWrapper}>
                        <Text style={styles.paymentInputLabel}>Nom du Titulaire</Text>
                        <TextInput
                          style={styles.paymentInput}
                          placeholder="Chaymae"
                          placeholderTextColor="rgba(255,255,255,0.3)"
                          value={cardName}
                          onChangeText={setCardName}
                          onFocus={() => setIsCardFlipped(false)}
                          selectionColor="#F59E0B"
                        />
                      </View>

                      <View style={styles.paymentInputWrapper}>
                        <Text style={styles.paymentInputLabel}>Numéro de Carte</Text>
                        <TextInput
                          style={styles.paymentInput}
                          placeholder="4532 7182 9301 8472"
                          placeholderTextColor="rgba(255,255,255,0.3)"
                          keyboardType="numeric"
                          maxLength={16}
                          value={cardNumber}
                          onChangeText={(txt) => setCardNumber(txt.replace(/\D/g, ''))}
                          onFocus={() => setIsCardFlipped(false)}
                          selectionColor="#F59E0B"
                        />
                      </View>

                      <View style={styles.paymentRowInputs}>
                        <View style={[styles.paymentInputWrapper, { flex: 1.2, marginRight: 12 }]}>
                          <Text style={styles.paymentInputLabel}>Date Expiration</Text>
                          <TextInput
                            style={styles.paymentInput}
                            placeholder="12/28"
                            placeholderTextColor="rgba(255,255,255,0.3)"
                            maxLength={5}
                            value={cardExpiry}
                            onChangeText={(txt) => {
                              let clean = txt.replace(/\D/g, '');
                              if (clean.length > 2) {
                                clean = clean.substring(0, 2) + '/' + clean.substring(2, 4);
                              }
                              setCardExpiry(clean);
                            }}
                            onFocus={() => setIsCardFlipped(false)}
                            selectionColor="#F59E0B"
                          />
                        </View>

                        <View style={[styles.paymentInputWrapper, { flex: 0.8 }]}>
                          <Text style={styles.paymentInputLabel}>Code CVV</Text>
                          <TextInput
                            style={styles.paymentInput}
                            placeholder="123"
                            placeholderTextColor="rgba(255,255,255,0.3)"
                            keyboardType="numeric"
                            maxLength={3}
                            secureTextEntry
                            value={cardCvv}
                            onChangeText={(txt) => setCardCvv(txt.replace(/\D/g, ''))}
                            onFocus={() => setIsCardFlipped(true)}
                            selectionColor="#F59E0B"
                          />
                        </View>
                      </View>
                    </View>

                    {/* Price and Action */}
                    <View style={styles.pricingSummaryRow}>
                      <View>
                        <Text style={styles.pricingPeriodText}>Abonnement mensuel</Text>
                        <Text style={styles.pricingValueText}>{systemConfig.premiumPriceMad} MAD <Text style={{ fontSize: 12, fontWeight: 'normal', color: 'rgba(255,255,255,0.5)' }}>/ mois</Text></Text>
                      </View>
                      <Pressable 
                        style={[styles.paySubmitBtn, isPaying && { opacity: 0.8 }]} 
                        onPress={handlePay}
                        disabled={isPaying}
                      >
                        {isPaying ? (
                          <ActivityIndicator size="small" color="#000" />
                        ) : (
                          <>
                            <Text style={styles.paySubmitBtnText}>Confirmer</Text>
                            <Feather name="arrow-right" size={16} color="#000" />
                          </>
                        )}
                      </Pressable>
                    </View>
                    
                    <Text style={styles.secureBadgeFooter}>
                      🔒 Cryptage SSL 256 bits. Aucun frais réel ne sera facturé.
                    </Text>

                  </ScrollView>
                )}

              </View>
            </BlurView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFCFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFCFF',
  },
  scrollContent: {
    paddingHorizontal: 22,
  },
  stylePassShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
    marginBottom: 26,
    borderRadius: 28,
    overflow: 'hidden',
  },
  stylePassCard: {
    borderRadius: 28,
    padding: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  passGlow: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    opacity: 0.25,
  },
  passHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  passBrandWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passBrandText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: 2,
  },
  passCategoryBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  passCategoryText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#E5E7EB',
    letterSpacing: 1.5,
  },
  passBody: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  passAvatarBorder: {
    position: 'relative',
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: '#374151',
    padding: 2,
  },
  passAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  passAvatarGlow: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 24,
    borderWidth: 2.5,
    borderColor: '#8B5CF6',
    opacity: 0.8,
  },
  passIdentityWrap: {
    flex: 1,
    marginLeft: 16,
  },
  passName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  passEmail: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 10,
  },
  passTagsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  passMiniTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  passMiniTagText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },
  passDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 16,
  },
  passFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  passMetaBlock: {
    flex: 1,
  },
  passMetaBlockRight: {
    alignItems: 'flex-end',
  },
  passMetaLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: '#9CA3AF',
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  passMetaValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFF',
  },
  paletteRow: {
    flexDirection: 'row',
    gap: 6,
  },
  paletteDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  passShareBtn: {
    width: '100%',
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  passShareBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFF',
  },
  // Metrics row
  metricsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 30,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 2,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E1E2C',
    marginTop: 8,
    marginBottom: 2,
  },
  metricLabel: {
    fontSize: 11,
    color: '#8A8A9E',
    fontWeight: '600',
  },
  // Badge collection
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E1E2C',
    marginBottom: 14,
    letterSpacing: -0.2,
  },
  glassWrapper: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.03,
    shadowRadius: 15,
    marginBottom: 30,
  },
  glassCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    padding: 18,
  },
  badgeGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  badgeItem: {
    flex: 1,
    alignItems: 'center',
  },
  badgeIconFrame: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    marginBottom: 8,
  },
  badgeIconFrameLocked: {
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  badgeEmoji: {
    fontSize: 22,
  },
  badgeEmojiLocked: {
    fontSize: 20,
    opacity: 0.3,
  },
  badgeName: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1E1E2C',
    textAlign: 'center',
    marginBottom: 2,
  },
  badgeNameLocked: {
    fontSize: 11,
    fontWeight: '800',
    color: '#8A8A9E',
    textAlign: 'center',
    marginBottom: 2,
  },
  badgeStatus: {
    fontSize: 9,
    fontWeight: '700',
    color: '#2ECC71',
  },
  badgeStatusLocked: {
    fontSize: 9,
    fontWeight: '700',
    color: '#8A8A9E',
  },
  // Setting list
  actionGroupShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.03,
    shadowRadius: 15,
  },
  actionGroup: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
    overflow: 'hidden',
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  actionIconFrame: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  actionText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: '#1E1E2C',
  },
  actionDivider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.04)',
    marginHorizontal: 16,
  },
  emptyBadgesText: {
    fontSize: 12,
    color: '#8A8A9E',
    fontWeight: '500',
    textAlign: 'center',
    width: '100%',
    paddingVertical: 10,
  },
  badge2fa: {
    backgroundColor: 'rgba(139, 92, 246, 0.08)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.15)',
  },
  badge2faText: {
    color: '#8B5CF6',
    fontSize: 11,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalBlur: {
    width: '90%',
    maxHeight: '85%',
    borderRadius: 24,
    overflow: 'hidden',
  },
  modalCard: {
    padding: 24,
    backgroundColor: 'rgba(31, 41, 55, 0.92)',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFF',
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalScroll: {
    gap: 16,
  },
  modalDesc: {
    fontSize: 13,
    color: '#9CA3AF',
    lineHeight: 18,
  },
  qrWrapper: {
    alignItems: 'center',
    gap: 14,
    marginVertical: 10,
  },
  qrFrame: {
    padding: 10,
    backgroundColor: '#FFF',
    borderRadius: 16,
  },
  qrImage: {
    width: 180,
    height: 180,
  },
  secretBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
  },
  secretLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: '#9CA3AF',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  secretValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: 1,
  },
  inputWrapper: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF',
    textTransform: 'uppercase',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 52,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#FFF',
    fontWeight: '600',
  },
  confirmBtn: {
    backgroundColor: '#8B5CF6',
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  confirmBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
  // Premium and Payment Styles
  upgradeBannerShadow: {
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 8,
    borderRadius: 24,
    marginBottom: 30,
    overflow: 'hidden',
  },
  upgradeBanner: {
    borderRadius: 24,
    padding: 20,
  },
  upgradeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  upgradeIconBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  upgradeTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: 1.5,
  },
  upgradeSubtitle: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
  },
  upgradeFeatures: {
    gap: 10,
    marginBottom: 20,
  },
  upgradeFeatureRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  upgradeFeatureText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  upgradeBtn: {
    backgroundColor: '#FFF',
    height: 48,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  upgradeBtnText: {
    color: '#8B5CF6',
    fontSize: 12,
    fontWeight: '800',
  },
  premiumSuccessCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F3E5AB',
    shadowColor: '#D97706',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 30,
  },
  premiumSuccessIconFrame: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  premiumSuccessText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    color: '#92400E',
    lineHeight: 16,
  },

  // Payment Modal Specific
  paymentSuccessContainer: {
    alignItems: 'center',
    paddingVertical: 30,
    gap: 16,
  },
  successGlowOrb: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.4)',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  successPaymentTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFF',
    textAlign: 'center',
  },
  successPaymentDesc: {
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 10,
  },
  successDoneBtn: {
    backgroundColor: '#FFD700',
    height: 50,
    borderRadius: 14,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  successDoneBtnText: {
    color: '#1F2937',
    fontSize: 14,
    fontWeight: '800',
  },

  applePayContainer: {
    height: 320,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applePayScanner: {
    alignItems: 'center',
    gap: 16,
  },
  applePaySuccess: {
    alignItems: 'center',
    gap: 16,
  },
  applePayFailed: {
    alignItems: 'center',
    gap: 16,
  },
  applePayText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFF',
    marginTop: 8,
  },

  paymentSectionLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#9CA3AF',
    letterSpacing: 1.5,
    marginBottom: 10,
    marginTop: 8,
  },
  expressPayRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  applePayBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  applePayBtnText: {
    color: '#000',
    fontWeight: '800',
    fontSize: 13,
  },
  googlePayBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#000',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  googlePayBtnText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 13,
  },
  orDividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 14,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  orText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#6B7280',
    marginHorizontal: 12,
    letterSpacing: 1.5,
  },

  virtualCardWrapper: {
    marginVertical: 10,
    alignItems: 'center',
  },
  virtualCard: {
    width: '100%',
    height: 180,
    borderRadius: 16,
    padding: 16,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  cardFrontHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardBrandName: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: 2,
  },
  cardChip: {
    width: 32,
    height: 24,
    borderRadius: 4,
    opacity: 0.9,
  },
  cardVisualNumber: {
    fontSize: 18,
    color: '#FFF',
    letterSpacing: 2,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    marginVertical: 10,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  cardFrontFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardVisualLabel: {
    fontSize: 7,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 2,
  },
  cardVisualValue: {
    fontSize: 11,
    color: '#FFF',
    fontWeight: '800',
    letterSpacing: 1,
  },
  cardFlipPrompt: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 4,
  },

  cardBlackStrip: {
    height: 35,
    backgroundColor: '#000',
    marginHorizontal: -16,
    marginTop: 4,
  },
  cardBackCvvRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  cardWhiteStrip: {
    flex: 1,
    height: 32,
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    paddingLeft: 8,
  },
  cardSignatureDummy: {
    fontSize: 11,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    color: '#4B5563',
    fontStyle: 'italic',
    fontWeight: '700',
  },
  cardCvvBadge: {
    width: 50,
    height: 32,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  cardCvvText: {
    fontSize: 13,
    color: '#000',
    fontWeight: '800',
  },
  cardBackDisclaimer: {
    fontSize: 8,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 11,
    paddingHorizontal: 12,
  },

  paymentForm: {
    gap: 12,
    marginVertical: 12,
  },
  paymentInputWrapper: {
    gap: 6,
  },
  paymentInputLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#9CA3AF',
    textTransform: 'uppercase',
  },
  paymentInput: {
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 12,
    fontSize: 13,
    color: '#FFF',
    fontWeight: '700',
  },
  paymentRowInputs: {
    flexDirection: 'row',
  },
  pricingSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 18,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
  pricingPeriodText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF',
  },
  pricingValueText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFF',
    marginTop: 2,
  },
  paySubmitBtn: {
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFD700',
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  paySubmitBtnText: {
    color: '#000',
    fontSize: 13,
    fontWeight: '800',
  },
  secureBadgeFooter: {
    fontSize: 9,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 14,
    fontWeight: '700',
  },
});

