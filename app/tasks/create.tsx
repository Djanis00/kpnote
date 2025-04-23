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

export default function CreateTask() {
  const { token } = useAuth();
  const router = useRouter();

  const [description, setDescription] = useState('');
  const [subtasks, setSubtasks] = useState(['']);
  const [notes, setNotes] = useState([]);
  const [noteId, setNoteId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

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
    if (!description.trim()) {
      return Alert.alert('Erreur', 'Description requise');
    }

    try {
      setLoading(true);
      const res = await fetch('https://keep.kevindupas.com/api/tasks', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description,
          note_id: noteId,
          subtasks: subtasks.filter((s) => s.trim() !== ''),
        }),
      });

      if (res.ok) {
        Alert.alert('Succès', 'Tâche créée');
        router.replace('/tasks');
      } else {
        const err = await res.json();
        Alert.alert('Erreur', err.message || 'Création échouée');
      }
    } catch (err) {
      Alert.alert('Erreur', 'Connexion impossible');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backText}>⬅️ Retour</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Nouvelle tâche</Text>

      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />

      <Text style={styles.label}>Sous-tâches</Text>
      {subtasks.map((text, index) => (
        <TextInput
          key={index}
          value={text}
          onChangeText={(txt) => handleSubtaskChange(txt, index)}
          placeholder={`Sous-tâche ${index + 1}`}
          style={styles.input}
        />
      ))}

      <Button title="Ajouter une sous-tâche" onPress={handleAddSubtask} />

      <Text style={[styles.label, { marginTop: 20 }]}>Associer une note (optionnel)</Text>
      {notes.map((note) => (
        <TouchableOpacity
          key={note.id}
          style={[
            styles.noteButton,
            {
              backgroundColor: noteId === note.id ? '#cce5ff' : '#eee',
            },
          ]}
          onPress={() => setNoteId(note.id === noteId ? null : note.id)}
        >
          <Text>{note.title}</Text>
        </TouchableOpacity>
      ))}

      <View style={styles.submit}>
        <Button title="Créer la tâche" onPress={handleSubmit} disabled={loading} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
    backgroundColor: '#f4f5f7',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  backText: {
    fontSize: 16,
    color: '#2196F3',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginVertical: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  noteButton: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  submit: {
    marginTop: 20,
  },
});
