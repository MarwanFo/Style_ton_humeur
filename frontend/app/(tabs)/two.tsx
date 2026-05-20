import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable, 
  Image, 
  Alert, 
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { API_URL } from '@/constants/Api';

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [user, setUser] = useState<any>(null);
  const [streak, setStreak] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
        
        {/* PROFILE HEADER CARD */}
        <View style={styles.profileHeaderCardShadow}>
          <BlurView intensity={70} tint="light" style={styles.profileHeaderCard}>
            <View style={[styles.avatarBorder, { borderColor: '#7F00FF' }]}>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80' }} 
                style={styles.avatar} 
              />
            </View>
            <Text style={styles.displayName}>{user?.displayName || 'Chaymae'}</Text>
            <Text style={styles.emailText}>{user?.email || 'chaymae@email.com'}</Text>
            
            <View style={styles.tagRow}>
              <View style={styles.profileTag}>
                <Text style={styles.profileTagText}>
                  {user?.gender === 'femme' ? '👩 Femme' : '👨 Homme'}
                </Text>
              </View>
              <View style={styles.profileTag}>
                <Text style={styles.profileTagText}>🎂 {user?.age || 22} ans</Text>
              </View>
            </View>
          </BlurView>
        </View>

        {/* METRICS SHOWCASE */}
        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <MaterialCommunityIcons name="fire" size={24} color="#FF8E53" />
            <Text style={styles.metricValue}>{streak?.currentStreak || 12} jours</Text>
            <Text style={styles.metricLabel}>Série Active</Text>
          </View>
          <View style={styles.metricCard}>
            <MaterialCommunityIcons name="trophy" size={24} color="#FFD700" />
            <Text style={styles.metricValue}>{streak?.maxStreak || 15} jours</Text>
            <Text style={styles.metricLabel}>Record Historique</Text>
          </View>
        </View>

        {/* BADGES COLLECTION */}
        <Text style={styles.sectionTitle}>Mes Badges Collection</Text>
        <View style={styles.glassWrapper}>
          <BlurView intensity={50} tint="light" style={styles.glassCard}>
            <View style={styles.badgeGrid}>
              
              <View style={styles.badgeItem}>
                <View style={styles.badgeIconFrame}>
                  <Text style={styles.badgeEmoji}>🌱</Text>
                </View>
                <Text style={styles.badgeName}>Premier Pas</Text>
                <Text style={styles.badgeStatus}>Obtenu</Text>
              </View>

              <View style={styles.badgeItem}>
                <View style={styles.badgeIconFrame}>
                  <Text style={styles.badgeEmoji}>🔥</Text>
                </View>
                <Text style={styles.badgeName}>Sérieux (Streak 3)</Text>
                <Text style={styles.badgeStatus}>Obtenu</Text>
              </View>

              <View style={styles.badgeItem}>
                <View style={[styles.badgeIconFrame, styles.badgeIconFrameLocked]}>
                  <Text style={styles.badgeEmojiLocked}>👑</Text>
                </View>
                <Text style={styles.badgeNameLocked}>Styliste Élite</Text>
                <Text style={styles.badgeStatusLocked}>Verrouillé</Text>
              </View>

            </View>
          </BlurView>
        </View>

        {/* SETTINGS ACTIONS */}
        <Text style={styles.sectionTitle}>Paramètres du Compte</Text>
        <View style={styles.actionGroupShadow}>
          <View style={styles.actionGroup}>
            
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
  profileHeaderCardShadow: {
    shadowColor: '#7F00FF',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 4,
    marginBottom: 24,
  },
  profileHeaderCard: {
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
    padding: 24,
    alignItems: 'center',
  },
  avatarBorder: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#FFF',
    padding: 3,
    borderWidth: 2.5,
    marginBottom: 16,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
  },
  displayName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1E1E2C',
    marginBottom: 4,
  },
  emailText: {
    fontSize: 13,
    color: '#8A8A9E',
    fontWeight: '500',
    marginBottom: 16,
  },
  tagRow: {
    flexDirection: 'row',
    gap: 8,
  },
  profileTag: {
    backgroundColor: 'rgba(127, 0, 255, 0.06)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(127, 0, 255, 0.1)',
  },
  profileTagText: {
    color: '#7F00FF',
    fontSize: 12,
    fontWeight: '700',
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
});
