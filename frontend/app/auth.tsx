import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  Pressable, 
  Dimensions, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView, 
  ActivityIndicator,
  Alert,
  StatusBar
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons, Feather } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@/constants/Api';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';

const { width } = Dimensions.get('window');

WebBrowser.maybeCompleteAuthSession();

export default function AuthScreen() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showTwoFactorInput, setShowTwoFactorInput] = useState(false);
  const [twoFactorUserId, setTwoFactorUserId] = useState<number | null>(null);
  const [twoFactorCode, setTwoFactorCode] = useState('');

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [gender, setGender] = useState('femme');
  const [age, setAge] = useState('');

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires.');
      return;
    }

    if (!isLogin && (!displayName || !age)) {
      Alert.alert('Erreur', 'Veuillez renseigner votre pseudo et votre âge.');
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        const response = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, pass: password }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Identifiants incorrects.');
        }

        if (data.isTwoFactorRequired) {
          setTwoFactorUserId(data.userId);
          setShowTwoFactorInput(true);
          setLoading(false);
          return;
        }

        await AsyncStorage.setItem('token', data.access_token);
        await AsyncStorage.setItem('user', JSON.stringify(data.user));

        router.replace('/(tabs)');
      } else {
        const response = await fetch(`${API_URL}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            pass: password,
            displayName,
            gender,
            age: parseInt(age, 10),
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Impossible de créer le compte.");
        }

        Alert.alert('Bienvenue', 'Votre compte a été créé avec succès.');
        setIsLogin(true);
      }
    } catch (err: any) {
      Alert.alert('Erreur', err.message || 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      const scheme = 'aura-studio';
      const redirectUri = Linking.createURL('auth-callback', { scheme });
      
      const supabaseUrl = 'https://lymcnpasltqfwcjhsqvy.supabase.co';
      const authUrl = `${supabaseUrl}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(redirectUri)}`;

      console.log('DEBUG: Starting Google Auth via Supabase proxy, redirecting to:', redirectUri);
      
      const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);
      
      if (result.type === 'success' && result.url) {
        const url = result.url;
        let accessToken = null;
        
        if (url.includes('#')) {
          const fragment = url.split('#')[1];
          const params = new URLSearchParams(fragment);
          accessToken = params.get('access_token');
        } else if (url.includes('?')) {
          const query = url.split('?')[1];
          const params = new URLSearchParams(query);
          accessToken = params.get('access_token');
        }

        if (accessToken) {
          const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'apiKey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5bWNucGFzbHRxZndjamhzcXZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2NTUwNzAsImV4cCI6MjA5NDIzMTA3MH0.gNQXnlfzq1psCE1qXfgUM7sLta3rMJ1LZ0HfIp6atvo'
            }
          });
          
          if (!userResponse.ok) {
            throw new Error('Impossible de récupérer le profil utilisateur de Supabase');
          }
          
          const supabaseUser = await userResponse.json();
          const email = supabaseUser.email;
          const displayName = supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || 'Utilisateur Google';

          const response = await fetch(`${API_URL}/auth/google`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, displayName }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || 'Impossible de se connecter avec Google.');
          }

          await AsyncStorage.setItem('token', data.access_token);
          await AsyncStorage.setItem('user', JSON.stringify(data.user));
          
          Alert.alert('Connexion réussie', `Bienvenue ${data.user.displayName} !`);
          router.replace('/(tabs)');
        } else {
          Alert.alert('Erreur', 'Impossible de récupérer le jeton de connexion Google.');
        }
      }
    } catch (err: any) {
      console.log('Google Auth Error:', err);
      Alert.alert('Erreur Google', err.message || 'La connexion a été annulée ou a échoué.');
    } finally {
      setLoading(false);
    }
  };

  const handleTwoFactorVerify = async () => {
    if (!twoFactorCode || twoFactorCode.length !== 6) {
      Alert.alert('Erreur', 'Veuillez saisir le code à 6 chiffres.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/2fa/login-verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: twoFactorUserId, code: twoFactorCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Code incorrect.');
      }

      await AsyncStorage.setItem('token', data.access_token);
      await AsyncStorage.setItem('user', JSON.stringify(data.user));

      router.replace('/(tabs)');
    } catch (err: any) {
      Alert.alert('Erreur', err.message || 'Validation échouée.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" />
      
      {/* High-end ambient colorful background */}
      <View style={StyleSheet.absoluteFill}>
        <LinearGradient 
          colors={['#F5F3FF', '#FCE7F3', '#FFE4E6']} 
          style={StyleSheet.absoluteFillObject}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <View style={styles.orbTopRight} />
        <View style={styles.orbBottomLeft} />
        <BlurView intensity={60} tint="light" style={StyleSheet.absoluteFill} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* LOGO & HEADING */}
        <Animated.View entering={FadeInUp.duration(800).springify()} style={styles.logoSection}>
          <View style={styles.logoIconBg}>
            <Ionicons name="sparkles" size={28} color="#8B5CF6" />
          </View>
          <Text style={styles.brandTitle}>AURA STUDIO</Text>
          <Text style={styles.brandSubtitle}>Révélez votre esthétique & votre humeur</Text>
        </Animated.View>

        {/* GLASS CARD FORM CONTAINER */}
        <Animated.View entering={FadeInDown.delay(200).duration(800).springify()} style={styles.glassWrapper}>
          <BlurView intensity={90} tint="light" style={styles.glassCard}>
            
            {showTwoFactorInput ? (
              <View style={styles.formContainer}>
                <Text style={styles.twoFactorTitle}>🔑 Validation en deux étapes</Text>
                <Text style={styles.twoFactorDesc}>
                  Saisissez le code de validation à 6 chiffres généré par votre application d'authentification (Google Authenticator, Authy, etc.).
                </Text>

                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>Code de validation</Text>
                  <View style={styles.inputContainer}>
                    <Feather name="shield" size={18} color="#8B5CF6" style={styles.inputIcon} />
                    <TextInput 
                      placeholder="000000" 
                      placeholderTextColor="#9CA3AF"
                      keyboardType="numeric"
                      maxLength={6}
                      value={twoFactorCode}
                      onChangeText={setTwoFactorCode}
                      style={styles.input}
                      selectionColor="#8B5CF6"
                    />
                  </View>
                </View>

                <Pressable style={styles.actionBtn} onPress={handleTwoFactorVerify} disabled={loading}>
                  <LinearGradient 
                    colors={['#8B5CF6', '#EC4899']} 
                    start={{ x: 0, y: 0 }} 
                    end={{ x: 1, y: 1 }} 
                    style={styles.actionGradient}
                  >
                    {loading ? (
                      <ActivityIndicator size="small" color="#FFF" />
                    ) : (
                      <Text style={styles.actionText}>Valider</Text>
                    )}
                  </LinearGradient>
                </Pressable>

                <Pressable 
                  onPress={() => {
                    setShowTwoFactorInput(false);
                    setTwoFactorCode('');
                  }}
                  style={styles.backBtn}
                >
                  <Text style={styles.backBtnText}>Retour à la connexion</Text>
                </Pressable>
              </View>
            ) : (
              <>
                {/* SEGMENT SELECTOR */}
                <View style={styles.segmentContainer}>
                  <Pressable 
                    onPress={() => setIsLogin(true)}
                    style={[styles.segmentBtn, isLogin && styles.segmentBtnActive]}
                  >
                    <Text style={[styles.segmentText, isLogin && styles.segmentTextActive]}>Connexion</Text>
                  </Pressable>
                  <Pressable 
                    onPress={() => setIsLogin(false)}
                    style={[styles.segmentBtn, !isLogin && styles.segmentBtnActive]}
                  >
                    <Text style={[styles.segmentText, !isLogin && styles.segmentTextActive]}>Inscription</Text>
                  </Pressable>
                </View>

                {/* FORM FIELDS */}
                <View style={styles.formContainer}>
                  
                  {!isLogin && (
                    <View style={styles.inputWrapper}>
                      <Text style={styles.inputLabel}>Pseudo</Text>
                      <View style={styles.inputContainer}>
                        <Feather name="user" size={18} color="#8B5CF6" style={styles.inputIcon} />
                        <TextInput 
                          placeholder="Ex: Marwan" 
                          placeholderTextColor="#9CA3AF"
                          value={displayName}
                          onChangeText={setDisplayName}
                          style={styles.input}
                          selectionColor="#8B5CF6"
                        />
                      </View>
                    </View>
                  )}

                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>Email</Text>
                    <View style={styles.inputContainer}>
                      <Feather name="mail" size={18} color="#8B5CF6" style={styles.inputIcon} />
                      <TextInput 
                        placeholder="votre@email.com" 
                        placeholderTextColor="#9CA3AF"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={setEmail}
                        style={styles.input}
                        selectionColor="#8B5CF6"
                      />
                    </View>
                  </View>

                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>Mot de passe</Text>
                    <View style={styles.inputContainer}>
                      <Feather name="lock" size={18} color="#8B5CF6" style={styles.inputIcon} />
                      <TextInput 
                        placeholder="••••••••" 
                        placeholderTextColor="#9CA3AF"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                        style={styles.input}
                        selectionColor="#8B5CF6"
                      />
                    </View>
                  </View>

                  {!isLogin && (
                    <>
                      <View style={styles.inputWrapper}>
                        <Text style={styles.inputLabel}>Âge</Text>
                        <View style={styles.inputContainer}>
                          <Feather name="calendar" size={18} color="#8B5CF6" style={styles.inputIcon} />
                          <TextInput 
                            placeholder="Ex: 25" 
                            placeholderTextColor="#9CA3AF"
                            keyboardType="numeric"
                            value={age}
                            onChangeText={setAge}
                            style={styles.input}
                            selectionColor="#8B5CF6"
                          />
                        </View>
                      </View>

                      <View style={styles.inputWrapper}>
                        <Text style={styles.inputLabel}>Genre</Text>
                        <View style={styles.genderRow}>
                          <Pressable 
                            onPress={() => setGender('femme')}
                            style={[styles.genderBtn, gender === 'femme' && styles.genderBtnActive]}
                          >
                            <Ionicons name="woman" size={16} color={gender === 'femme' ? '#FFF' : '#8B5CF6'} />
                            <Text style={[styles.genderBtnText, gender === 'femme' && styles.genderBtnTextActive]}>Femme</Text>
                          </Pressable>
                          <Pressable 
                            onPress={() => setGender('homme')}
                            style={[styles.genderBtn, gender === 'homme' && styles.genderBtnActive]}
                          >
                            <Ionicons name="man" size={16} color={gender === 'homme' ? '#FFF' : '#8B5CF6'} />
                            <Text style={[styles.genderBtnText, gender === 'homme' && styles.genderBtnTextActive]}>Homme</Text>
                          </Pressable>
                        </View>
                      </View>
                    </>
                  )}

                  <Pressable style={styles.actionBtn} onPress={handleAuth} disabled={loading}>
                    <LinearGradient 
                      colors={['#8B5CF6', '#EC4899']} 
                      start={{ x: 0, y: 0 }} 
                      end={{ x: 1, y: 1 }} 
                      style={styles.actionGradient}
                    >
                      {loading ? (
                        <ActivityIndicator size="small" color="#FFF" />
                      ) : (
                        <Text style={styles.actionText}>{isLogin ? 'Accéder' : 'Rejoindre'}</Text>
                      )}
                    </LinearGradient>
                  </Pressable>

                  <View style={styles.divider}>
                    <View style={styles.line} />
                    <Text style={styles.dividerText}>OU</Text>
                    <View style={styles.line} />
                  </View>

                  <Pressable style={styles.googleButton} onPress={handleGoogleAuth} disabled={loading}>
                    <Ionicons name="logo-google" size={18} color="#111827" style={styles.googleIcon} />
                    <Text style={styles.googleButtonText}>Continuer avec Google</Text>
                  </Pressable>

                </View>
              </>
            )}
          </BlurView>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
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
    backgroundColor: '#C7D2FE', // Light blue-purple
    top: -80,
    right: -80,
    opacity: 0.6,
  },
  orbBottomLeft: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 999,
    backgroundColor: '#FBCFE8', // Light pink-red
    bottom: -60,
    left: -80,
    opacity: 0.6,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoIconBg: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 3,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#EDE9FE',
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: 6,
    marginBottom: 8,
  },
  brandSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
    textAlign: 'center',
  },
  glassWrapper: {
    borderRadius: 32,
    overflow: 'hidden',
    backgroundColor: '#FFF',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.08,
    shadowRadius: 40,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  glassCard: {
    padding: 32,
  },
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    padding: 6,
    marginBottom: 32,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 12,
  },
  segmentBtnActive: {
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  segmentTextActive: {
    color: '#111827',
    fontWeight: '700',
  },
  formContainer: {
    gap: 20,
  },
  inputWrapper: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    paddingHorizontal: 18,
    height: 56,
    borderWidth: 1,
    borderColor: '#EDE9FE',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
    fontWeight: '600',
  },
  genderRow: {
    flexDirection: 'row',
    gap: 12,
  },
  genderBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    height: 56,
    borderWidth: 1,
    borderColor: '#EDE9FE',
  },
  genderBtnActive: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  genderBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#8B5CF6',
  },
  genderBtnTextActive: {
    color: '#FFF',
  },
  actionBtn: {
    marginTop: 12,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 6,
  },
  actionGradient: {
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  twoFactorTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 4,
  },
  twoFactorDesc: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  backBtn: {
    alignItems: 'center',
    marginTop: 8,
    paddingVertical: 10,
  },
  backBtnText: {
    fontSize: 14,
    color: '#8B5CF6',
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#EDE9FE',
  },
  dividerText: {
    color: '#9CA3AF',
    marginHorizontal: 12,
    fontSize: 12,
    fontWeight: '700',
  },
  googleButton: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EDE9FE',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
  },
  googleIcon: {
    marginRight: 10,
  },
  googleButtonText: {
    color: '#111827',
    fontSize: 15,
    fontWeight: '700',
  },
});
