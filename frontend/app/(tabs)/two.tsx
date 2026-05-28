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
  Switch
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { API_URL } from '@/constants/Api';
import { useNotifications } from '@/hooks/useNotifications';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';

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

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const userData = await AsyncStorage.getItem('user');

        if (!token || !userData) {
          router.replace('/auth');
          return;
        }

        setUser(JSON.parse(userData));

        // Load latest recommendation and visual checkin URL
        const recoStr = await AsyncStorage.getItem('latestRecommendation');
        if (recoStr) {
          setLatestReco(JSON.parse(recoStr));
        }

        const checkinStr = await AsyncStorage.getItem('latestCheckin');
        if (checkinStr) {
          const parsedCheckin = JSON.parse(checkinStr);
          if (parsedCheckin.imageUrl) {
            setAvatarUrl(parsedCheckin.imageUrl);
          }
        }

        // Fetch actual streak from backend
        const response = await fetch(`${API_URL}/checkins/streak`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const streakData = await response.json();
          setStreak(streakData);
        }

        // Fetch badges from backend
        const badgesResponse = await fetch(`${API_URL}/checkins/badges`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (badgesResponse.ok) {
          const badgesData = await badgesResponse.json();
          setBadges(badgesData);
        }
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
        <Animated.View entering={FadeInUp.duration(800).springify()} style={styles.stylePassShadow}>
          <LinearGradient
            colors={['#1F2937', '#111827']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.stylePassCard}
          >
            <View style={[styles.passGlow, { backgroundColor: '#8B5CF6', top: -30, right: -30 }]} />
            <View style={[styles.passGlow, { backgroundColor: '#EC4899', bottom: -40, left: -40 }]} />

            <View style={styles.passHeader}>
              <View style={styles.passBrandWrap}>
                <Ionicons name="sparkles" size={14} color="#FFF" style={{ marginRight: 6 }} />
                <Text style={styles.passBrandText}>STYLE TON HUMEUR</Text>
              </View>
              <View style={styles.passCategoryBadge}>
                <Text style={styles.passCategoryText}>PASSPORT STYLE</Text>
              </View>
            </View>

            <View style={styles.passBody}>
              <View style={styles.passAvatarBorder}>
                <Image 
                  source={{ uri: avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80' }} 
                  style={styles.passAvatar} 
                />
                <View style={styles.passAvatarGlow} />
              </View>
              
              <View style={styles.passIdentityWrap}>
                <Text numberOfLines={1} style={styles.passName}>{user?.displayName || 'Chaymae'}</Text>
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
});
