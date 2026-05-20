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
  Alert 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons, Feather } from '@expo/vector-icons';
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
  const [gender, setGender] = useState('femme'); // Default in French
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
        // LOGIN CALL
        const response = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, pass: password }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Identifiants incorrects.');
        }

        // Save token and user details to storage
        await AsyncStorage.setItem('token', data.access_token);
        await AsyncStorage.setItem('user', JSON.stringify(data.user));

        // Go to dashboard
        router.replace('/(tabs)');
      } else {
        // REGISTER CALL
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

        Alert.alert('Succès 🎉', 'Votre compte a été créé avec succès ! Connectez-vous maintenant.');
        setIsLogin(true);
      }
    } catch (err: any) {
      Alert.alert('Erreur d\'authentification', err.message || 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      {/* Background soft layout matching home */}
      <LinearGradient
        colors={['#FFF5F5', '#F3F4FB', '#E0E7FF']}
        style={StyleSheet.absoluteFillObject}
      />

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* LOGO & HEADING */}
        <View style={styles.logoSection}>
          <View style={styles.logoIconBg}>
            <Ionicons name="sparkles" size={32} color="#7F00FF" />
          </View>
          <Text style={styles.brandTitle}>V I B E S</Text>
          <Text style={styles.brandSubtitle}>Révélez votre style à travers votre humeur</Text>
        </View>

        {/* GLASS CARD FORM CONTAINER */}
        <View style={styles.glassWrapper}>
          <BlurView intensity={70} tint="light" style={styles.glassCard}>
            
            {/* SEGMENT SELECTOR [LOGIN / REGISTER] */}
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
                    <Feather name="user" size={18} color="#8A8A9E" style={styles.inputIcon} />
                    <TextInput 
                      placeholder="Ex: Chaymae" 
                      placeholderTextColor="#A0A0B0"
                      value={displayName}
                      onChangeText={setDisplayName}
                      style={styles.input}
                    />
                  </View>
                </View>
              )}

              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Email</Text>
                <View style={styles.inputContainer}>
                  <Feather name="mail" size={18} color="#8A8A9E" style={styles.inputIcon} />
                  <TextInput 
                    placeholder="votre.email@exemple.com" 
                    placeholderTextColor="#A0A0B0"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                    style={styles.input}
                  />
                </View>
              </View>

              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Mot de passe</Text>
                <View style={styles.inputContainer}>
                  <Feather name="lock" size={18} color="#8A8A9E" style={styles.inputIcon} />
                  <TextInput 
                    placeholder="••••••••" 
                    placeholderTextColor="#A0A0B0"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    style={styles.input}
                  />
                </View>
              </View>

              {!isLogin && (
                <>
                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>Âge</Text>
                    <View style={styles.inputContainer}>
                      <Feather name="calendar" size={18} color="#8A8A9E" style={styles.inputIcon} />
                      <TextInput 
                        placeholder="Ex: 22" 
                        placeholderTextColor="#A0A0B0"
                        keyboardType="numeric"
                        value={age}
                        onChangeText={setAge}
                        style={styles.input}
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
                        <Ionicons name="woman" size={16} color={gender === 'femme' ? '#FFF' : '#7F00FF'} />
                        <Text style={[styles.genderBtnText, gender === 'femme' && styles.genderBtnTextActive]}>Femme</Text>
                      </Pressable>
                      <Pressable 
                        onPress={() => setGender('homme')}
                        style={[styles.genderBtn, gender === 'homme' && styles.genderBtnActive]}
                      >
                        <Ionicons name="man" size={16} color={gender === 'homme' ? '#FFF' : '#7F00FF'} />
                        <Text style={[styles.genderBtnText, gender === 'homme' && styles.genderBtnTextActive]}>Homme</Text>
                      </Pressable>
                    </View>
                  </View>
                </>
              )}

              {/* ACTION CTA */}
              <Pressable style={styles.actionBtn} onPress={handleAuth} disabled={loading}>
                <LinearGradient
                  colors={['#7F00FF', '#E100FF']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.actionGradient}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color="#FFF" />
                  ) : (
                    <Text style={styles.actionText}>{isLogin ? 'Se connecter' : 'Créer mon compte'}</Text>
                  )}
                </LinearGradient>
              </Pressable>

            </View>

          </BlurView>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9FF',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoIconBg: {
    width: 68,
    height: 68,
    borderRadius: 22,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#7F00FF',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 5,
    marginBottom: 16,
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#1E1E2C',
    letterSpacing: 8,
    marginBottom: 8,
  },
  brandSubtitle: {
    fontSize: 14,
    color: '#8A8A9E',
    fontWeight: '500',
    textAlign: 'center',
  },
  glassWrapper: {
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
    shadowColor: '#7F00FF',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.1,
    shadowRadius: 25,
    elevation: 8,
  },
  glassCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    padding: 24,
  },
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.04)',
    borderRadius: 14,
    padding: 4,
    marginBottom: 28,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
  segmentBtnActive: {
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8A8A9E',
  },
  segmentTextActive: {
    color: '#1E1E2C',
    fontWeight: '700',
  },
  formContainer: {
    gap: 20,
  },
  inputWrapper: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E1E2C',
    paddingLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#1E1E2C',
    fontWeight: '500',
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
    backgroundColor: 'rgba(127, 0, 255, 0.05)',
    borderRadius: 16,
    height: 50,
    borderWidth: 1,
    borderColor: 'rgba(127, 0, 255, 0.1)',
  },
  genderBtnActive: {
    backgroundColor: '#7F00FF',
    borderColor: '#7F00FF',
  },
  genderBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#7F00FF',
  },
  genderBtnTextActive: {
    color: '#FFF',
  },
  actionBtn: {
    marginTop: 10,
    shadowColor: '#7F00FF',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 8,
  },
  actionGradient: {
    borderRadius: 16,
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
