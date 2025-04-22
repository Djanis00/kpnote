import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export default function EditTask() {
  const { id } = useLocalSearchParams();
  const { token } = useAuth();
  const router = useRouter();

  const [task, setTask] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTask = async () => {
    const res = await fetch(`https://keep.kevindupas.com/api/tasks/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setTask(data);
  };

  const fetchNotes = async () => {
    const res = await fetch('https://keep.kevindupas.com/api/notes', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setNotes(data);
  };

  useEffect(() => {
    Promise.all([fetchTask(), fetchNotes()]).then(() => setLoading(false));
  }, []);

  const handleSubtaskChange = (text, index) => {
    const updated = [...task.subtasks];
    updated[index].description = text;
    setTask({ ...task, subtasks: updated });
  };

  const handleToggleSubtask = (index) => {
    const updated = [...task.subtasks];
    updated[index].completed = !updated[index].completed;
    setTask({ ...task, subtasks: updated });
  };

  const handleAddSubtask = () => {
    setTask({
      ...task,
      subtasks: [...task.subtasks, { description: '', completed: false }],
    });
  };

  const handleSave = async () => {
    const res = await fetch(`https://keep.kevindupas.com/api/tasks/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        description: task.description,
        completed: task.completed,
        note_id: task.note_id,
        subtasks: task.subtasks,
      }),
    });

    if (res.ok) {
      Alert.alert('Tâche mise à jour');
      router.replace('/tasks');
    } else {
      Alert.alert('Erreur', 'Échec de la mise à jour');
    }
  };

  const handleDelete = async () => {
    Alert.alert('Supprimer ?', 'Cette action est irréversible', [
      { text: 'Annuler' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          await fetch(`https://keep.kevindupas.com/api/tasks/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
          });
          router.replace('/tasks');
        },
      },
    ]);
  };

  if (loading || !task) return <Text style={{ padding: 20 }}>Chargement...</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 16 }}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <Text style={styles.label}>Tâche principale</Text>
      <TextInput
        value={task.description}
        onChangeText={(text) => setTask({ ...task, description: text })}
        style={styles.input}
      />

      <View style={styles.switchRow}>
        <Text>Tâche complétée :</Text>
        <Switch
          value={task.completed}
          onValueChange={(value) => setTask({ ...task, completed: value })}
        />
      </View>

      <Text style={styles.label}>Sous-tâches</Text>
      {task.subtasks.map((sub, i) => (
        <View key={i} style={styles.subtaskRow}>
          <Switch
            value={sub.completed}
            onValueChange={() => handleToggleSubtask(i)}
          />
          <TextInput
            value={sub.description}
            onChangeText={(text) => handleSubtaskChange(text, i)}
            style={styles.subtaskInput}
          />
        </View>
      ))}
      <Button title="Ajouter une sous-tâche" onPress={handleAddSubtask} />

      <Text style={styles.label}>Associer à une note (optionnel)</Text>
      <ScrollView horizontal>
        {notes.map((n) => (
          <TouchableOpacity
            key={n.id}
            style={[
              styles.noteButton,
              task.note_id === n.id && { backgroundColor: '#ccc' },
            ]}
            onPress={() =>
              setTask({ ...task, note_id: task.note_id === n.id ? null : n.id })
            }
          >
            <Text>{n.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Button title="Enregistrer" onPress={handleSave} />
      <Button title="Supprimer" onPress={handleDelete} color="red" />
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
    marginVertical: 12,
  },
  noteButton: {
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 6,
    marginRight: 8,
  },
  subtaskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  subtaskInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    flex: 1,
    marginLeft: 8,
    padding: 8,
    borderRadius: 6,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
});
