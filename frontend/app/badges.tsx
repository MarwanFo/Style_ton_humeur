import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, FlatList, Pressable, Modal, 
  TextInput, Alert, ActivityIndicator, KeyboardAvoidingView, Platform 
} from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@/constants/Api';

interface Badge {
  id: number;
  code: string;
  name: string;
  description: string;
  icon: string;
  criteria: {
    thresholdDays: number;
  };
}

export default function BadgesScreen() {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalOpen] = useState(false);
  const [editingBadge, setEditingBadge] = useState<Badge | null>(null);
  
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    icon: '',
    thresholdDays: '1',
  });

  const fetchBadges = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/badges`);
      if (!response.ok) throw new Error('Erreur de chargement');
      const data = await response.json();
      setBadges(data);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de récupérer les badges');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBadges();
  }, []);

  const handleOpenModal = (badge: Badge | null = null) => {
    if (badge) {
      setEditingBadge(badge);
      setFormData({
        code: badge.code,
        name: badge.name,
        description: badge.description,
        icon: badge.icon,
        thresholdDays: String(badge.criteria.thresholdDays),
      });
    } else {
      setEditingBadge(null);
      setFormData({
        code: '',
        name: '',
        description: '',
        icon: '',
        thresholdDays: '1',
      });
    }
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.code || !formData.name || !formData.description || !formData.icon) {
      Alert.alert('Champs requis', 'Veuillez remplir tous les champs');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      const url = editingBadge 
        ? `${API_URL}/badges/${editingBadge.id}` 
        : `${API_URL}/badges`;
      
      const response = await fetch(url, {
        method: editingBadge ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          thresholdDays: parseInt(formData.thresholdDays),
        }),
      });

      if (response.ok) {
        setModalOpen(false);
        fetchBadges();
        Alert.alert('Succès', editingBadge ? 'Badge modifié' : 'Badge créé');
      } else {
        throw new Error();
      }
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue lors de l\'enregistrement');
    }
  };

  const handleDelete = (id: number) => {
    Alert.alert(
      'Confirmer la suppression',
      'Voulez-vous vraiment supprimer ce badge ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Supprimer', 
          style: 'destructive',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('token');
              const response = await fetch(`${API_URL}/badges/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
              });
              if (response.ok) fetchBadges();
            } catch (error) {
              Alert.alert('Erreur', 'Impossible de supprimer le badge');
            }
          }
        }
      ]
    );
  };

  const renderBadgeItem = ({ item }: { item: Badge }) => (
    <View style={styles.badgeCard}>
      <BlurView intensity={20} tint="light" style={StyleSheet.absoluteFillObject} />
      <View style={styles.badgeHeader}>
        <Text style={styles.badgeIcon}>{item.icon}</Text>
        <View style={styles.badgeActionButtons}>
          <Pressable onPress={() => handleOpenModal(item)} style={styles.actionBtn}>
            <Ionicons name="pencil" size={18} color="#8B5CF6" />
          </Pressable>
          <Pressable onPress={() => handleDelete(item.id)} style={styles.actionBtn}>
            <Ionicons name="trash" size={18} color="#EF4444" />
          </Pressable>
        </View>
      </View>
      <Text style={styles.badgeName}>{item.name}</Text>
      <Text style={styles.badgeDesc} numberOfLines={2}>{item.description}</Text>
      <View style={styles.badgeFooter}>
        <Ionicons name="time-outline" size={14} color="#6B7280" />
        <Text style={styles.badgeThreshold}>Palier : {item.criteria.thresholdDays} jours</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Gestion des Badges', headerTransparent: true, headerTintColor: '#000' }} />
      
      <LinearGradient colors={['#F5F3FF', '#FFF']} style={StyleSheet.absoluteFillObject} />

      <View style={styles.header}>
        <Text style={styles.title}>Catalogue Badges</Text>
        <Pressable onPress={() => handleOpenModal()} style={styles.addBtn}>
          <Ionicons name="plus" size={20} color="#FFF" />
          <Text style={styles.addBtnText}>Nouveau</Text>
        </Pressable>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#8B5CF6" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={badges}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderBadgeItem}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Aucun badge créé pour le moment</Text>
          }
        />
      )}

      <Modal visible={modalVisible} animationType="slide" transparent>
        <BlurView intensity={80} tint="dark" style={styles.modalOverlay}>
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalContent}
          >
            <View style={styles.modalInner}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{editingBadge ? 'Modifier Badge' : 'Nouveau Badge'}</Text>
                <Pressable onPress={() => setModalOpen(false)}>
                  <Ionicons name="close" size={24} color="#6B7280" />
                </Pressable>
              </View>

              <ScrollView>
                <Text style={styles.label}>Code Unique</Text>
                <TextInput 
                  style={styles.input} 
                  value={formData.code} 
                  onChangeText={(t) => setFormData({...formData, code: t})}
                  placeholder="ex: gold_7d"
                />

                <Text style={styles.label}>Nom</Text>
                <TextInput 
                  style={styles.input} 
                  value={formData.name} 
                  onChangeText={(t) => setFormData({...formData, name: t})}
                  placeholder="ex: Médaille d'Or"
                />

                <Text style={styles.label}>Description</Text>
                <TextInput 
                  style={[styles.input, styles.textArea]} 
                  value={formData.description} 
                  onChangeText={(t) => setFormData({...formData, description: t})}
                  multiline
                  numberOfLines={3}
                  placeholder="Description du badge..."
                />

                <View style={styles.formRow}>
                  <View style={{ flex: 1, marginRight: 10 }}>
                    <Text style={styles.label}>Icône (Emoji)</Text>
                    <TextInput 
                      style={styles.input} 
                      value={formData.icon} 
                      onChangeText={(t) => setFormData({...formData, icon: t})}
                      placeholder="🏆"
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.label}>Palier (Jours)</Text>
                    <TextInput 
                      style={styles.input} 
                      value={formData.thresholdDays} 
                      onChangeText={(t) => setFormData({...formData, thresholdDays: t})}
                      keyboardType="numeric"
                    />
                  </View>
                </View>

                <Pressable style={styles.submitBtn} onPress={handleSubmit}>
                  <Text style={styles.submitBtnText}>Enregistrer</Text>
                </Pressable>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </BlurView>
      </Modal>
    </View>
  );
}

import { ScrollView } from 'react-native-gesture-handler';

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 100 },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    marginBottom: 20 
  },
  title: { fontSize: 24, fontWeight: '800', color: '#1F2937' },
  addBtn: { 
    flexDirection: 'row', 
    backgroundColor: '#8B5CF6', 
    paddingHorizontal: 12, 
    paddingVertical: 8, 
    borderRadius: 10,
    alignItems: 'center',
    gap: 4
  },
  addBtnText: { color: '#FFF', fontWeight: '700', fontSize: 14 },
  list: { paddingHorizontal: 10, paddingBottom: 40 },
  row: { justifyContent: 'space-between' },
  badgeCard: {
    width: '48%',
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    overflow: 'hidden',
  },
  badgeHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  badgeIcon: { fontSize: 32 },
  badgeActionButtons: { flexDirection: 'row', gap: 8 },
  actionBtn: { 
    width: 32, 
    height: 32, 
    backgroundColor: '#FFF', 
    borderRadius: 8, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  badgeName: { fontSize: 16, fontWeight: '700', color: '#1F2937', marginBottom: 4 },
  badgeDesc: { fontSize: 12, color: '#6B7280', marginBottom: 12, lineHeight: 16 },
  badgeFooter: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  badgeThreshold: { fontSize: 10, fontWeight: '600', color: '#8B5CF6' },
  emptyText: { textAlign: 'center', marginTop: 40, color: '#9CA3AF' },
  
  modalOverlay: { flex: 1, justifyContent: 'flex-end' },
  modalContent: { 
    backgroundColor: '#FFF', 
    borderTopLeftRadius: 30, 
    borderTopRightRadius: 30, 
    height: '80%',
    padding: 24 
  },
  modalInner: { flex: 1 },
  modalHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 24 
  },
  modalTitle: { fontSize: 20, fontWeight: '800', color: '#111827' },
  label: { fontSize: 14, fontWeight: '600', color: '#4B5563', marginBottom: 8, marginTop: 16 },
  input: { 
    backgroundColor: '#F3F4F6', 
    borderRadius: 12, 
    padding: 14, 
    fontSize: 16, 
    color: '#1F2937' 
  },
  textArea: { height: 80, textAlignVertical: 'top' },
  formRow: { flexDirection: 'row' },
  submitBtn: { 
    backgroundColor: '#8B5CF6', 
    padding: 16, 
    borderRadius: 15, 
    alignItems: 'center', 
    marginTop: 30,
    marginBottom: 20
  },
  submitBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' }
});
