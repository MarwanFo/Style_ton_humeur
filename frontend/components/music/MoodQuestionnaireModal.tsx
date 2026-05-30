import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { BlurView } from 'expo-blur';

type Props = {
  visible: boolean;
  onSubmit: (payload: {
    humeur_detectee: 'joyeux' | 'calme' | 'confiant' | 'stressé' | 'nostalgique';
    niveau_energie: 'faible' | 'moyen' | 'élevé';
    contexte?: 'travail' | 'sortie' | 'sport' | 'maison';
  }) => void;
};

const moods = ['joyeux', 'calme', 'confiant', 'stressé', 'nostalgique'] as const;
const energies = ['faible', 'moyen', 'élevé'] as const;
const contexts = ['travail', 'sortie', 'sport', 'maison'] as const;

export function MoodQuestionnaireModal({ visible, onSubmit }: Props) {
  const [mood, setMood] = useState<(typeof moods)[number]>('calme');
  const [energy, setEnergy] = useState<(typeof energies)[number]>('moyen');
  const [context, setContext] = useState<(typeof contexts)[number]>('travail');

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <BlurView intensity={90} tint="light" style={styles.card}>
          <Text style={styles.title}>Petit check mood</Text>
          <Text style={styles.subtitle}>Ce questionnaire s'affiche seulement si les autres modules ne sont pas disponibles.</Text>

          <Text style={styles.label}>Comment te sens-tu aujourd'hui ?</Text>
          <View style={styles.row}>
            {moods.map((value) => (
              <Pressable key={value} style={[styles.pill, mood === value && styles.pillActive]} onPress={() => setMood(value)}>
                <Text style={[styles.pillText, mood === value && styles.pillTextActive]}>{value}</Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.label}>Niveau d'energie</Text>
          <View style={styles.row}>
            {energies.map((value) => (
              <Pressable key={value} style={[styles.pill, energy === value && styles.pillActive]} onPress={() => setEnergy(value)}>
                <Text style={[styles.pillText, energy === value && styles.pillTextActive]}>{value}</Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.label}>Contexte</Text>
          <View style={styles.row}>
            {contexts.map((value) => (
              <Pressable key={value} style={[styles.pill, context === value && styles.pillActive]} onPress={() => setContext(value)}>
                <Text style={[styles.pillText, context === value && styles.pillTextActive]}>{value}</Text>
              </Pressable>
            ))}
          </View>

          <Pressable
            style={styles.submit}
            onPress={() =>
              onSubmit({
                humeur_detectee: mood,
                niveau_energie: energy,
                contexte: context,
              })
            }
          >
            <Text style={styles.submitText}>Generer ma musique</Text>
          </Pressable>
        </BlurView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: 'rgba(17,24,39,0.4)' },
  card: { borderRadius: 22, padding: 18, overflow: 'hidden' },
  title: { fontSize: 20, fontWeight: '800', color: '#111827' },
  subtitle: { marginTop: 6, marginBottom: 14, color: '#4B5563', fontSize: 12 },
  label: { marginTop: 8, marginBottom: 8, color: '#374151', fontWeight: '700', fontSize: 12 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pill: { paddingHorizontal: 10, paddingVertical: 8, borderRadius: 999, backgroundColor: '#F3F4F6' },
  pillActive: { backgroundColor: '#8B5CF6' },
  pillText: { color: '#4B5563', fontSize: 12, fontWeight: '700' },
  pillTextActive: { color: '#FFFFFF' },
  submit: { marginTop: 18, backgroundColor: '#111827', borderRadius: 12, height: 44, justifyContent: 'center', alignItems: 'center' },
  submitText: { color: '#FFFFFF', fontWeight: '700' },
});
