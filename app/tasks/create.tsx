import { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export default function CreateTask() {
  const { token } = useAuth();
  const router = useRouter();
  const [description, setDescription] = useState('');
  const [subtasks, setSubtasks] = useState(['']);
  const [notes, setNotes] = useState([]);
  const [noteId, setNoteId] = useState<number | null>(null);

  useEffect(() => {
    fetch('https://keep.kevindupas.com/api/notes', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setNotes)
      .catch(() => Alert.alert('Erreur', 'Impossible de charger les notes'));
  }, []);

  const handleAddSubtask = () => setSubtasks([...subtasks, '']);
  const handleSubtaskChange = (text, index) => {
    const updated = [...subtasks];
    updated[index] = text;
    setSubtasks(updated);
  };

  const handleSubmit = async () => {
    if (!description.trim()) return Alert.alert('Erreur', 'Description requise');

    try {
      const res = await fetch('https://keep.kevindupas.com/api/tasks', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description,
          note_id: noteId,
          subtasks: subtasks.filter((s) => s.trim() !== '').map((s) => ({ description: s })),
        }),
      });

      if (res.ok) {
        Alert.alert('Tâche créée');
        router.replace('/tasks');
      } else {
        Alert.alert('Erreur', 'Échec de la création');
      }
    } catch {
      Alert.alert('Erreur', 'Connexion impossible');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 16 }}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <TextInput
        placeholder="Description principale"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />

      <Text style={styles.label}>Sous-tâches</Text>
      {subtasks.map((s, i) => (
        <TextInput
          key={i}
          value={s}
          onChangeText={(text) => handleSubtaskChange(text, i)}
          placeholder={`Sous-tâche ${i + 1}`}
          style={styles.input}
        />
      ))}
      <Button title="Ajouter une sous-tâche" onPress={handleAddSubtask} />

      <Text style={styles.label}>Associer à une note (optionnel)</Text>
      <ScrollView horizontal style={{ marginBottom: 16 }}>
        {notes.map((n) => (
          <TouchableOpacity
            key={n.id}
            style={[
              styles.noteButton,
              noteId === n.id && { backgroundColor: '#ccc' },
            ]}
            onPress={() => setNoteId(noteId === n.id ? null : n.id)}
          >
            <Text>{n.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Button title="Créer la tâche" onPress={handleSubmit} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 4,
  },
  noteButton: {
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 6,
    marginRight: 8,
  },
});
