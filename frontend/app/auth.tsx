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

const { width } = Dimensions.get('window');

export default function AuthScreen() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

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

              {/* ACTION CTA (Vibrant Purple/Pink Gradient) */}
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

            </View>
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
});
