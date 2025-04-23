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

  const addSubtask = () => {
    const updated = [...task.subtasks, { description: '', completed: false }];
    setTask({ ...task, subtasks: updated });
  };

  const removeSubtask = (index) => {
    const updated = task.subtasks.filter((_, i) => i !== index);
    setTask({ ...task, subtasks: updated });
  };

  const saveTask = async () => {
    try {
      const res = await fetch(`https://keep.kevindupas.com/api/tasks/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: task.description,
          note_id: task.note?.id || null,
          subtasks: task.subtasks,
        }),
      });

      if (res.ok) {
        Alert.alert('Succès', 'Tâche mise à jour');
        router.replace('/tasks');
      } else {
        Alert.alert('Erreur', 'Échec de la mise à jour');
      }
    } catch {
      Alert.alert('Erreur', 'Connexion impossible');
    }
  };

  const deleteTask = () => {
    Alert.alert('Supprimer ?', 'Confirmer la suppression ?', [
      { text: 'Annuler', style: 'cancel' },
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

  if (loading || !task) {
    return (
      <View style={styles.centered}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backText}>⬅️ Retour</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Modifier tâche</Text>

      <TextInput
        style={styles.input}
        value={task.description}
        onChangeText={(text) => setTask({ ...task, description: text })}
        placeholder="Description"
      />

      <Text style={styles.section}>Sous-tâches</Text>
      {task.subtasks.map((sub, index) => (
        <View key={index} style={styles.subtaskRow}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            value={sub.description}
            onChangeText={(txt) => handleSubtaskChange(txt, index)}
            placeholder={`Sous-tâche ${index + 1}`}
          />
          <Switch
            value={sub.completed}
            onValueChange={() => handleToggleSubtask(index)}
          />
          <TouchableOpacity onPress={() => removeSubtask(index)}>
            <Text style={{ color: 'red', marginLeft: 8 }}>🗑️</Text>
          </TouchableOpacity>
        </View>
      ))}
      <Button title="Ajouter une sous-tâche" onPress={addSubtask} />

      <Text style={styles.section}>Associer une note</Text>
      {notes.map((note) => (
        <TouchableOpacity
          key={note.id}
          onPress={() =>
            setTask({
              ...task,
              note: task.note?.id === note.id ? null : note,
            })
          }
          style={[
            styles.note,
            {
              backgroundColor: task.note?.id === note.id ? '#cce5ff' : '#eee',
            },
          ]}
        >
          <Text>{note.title}</Text>
        </TouchableOpacity>
      ))}

      <View style={styles.actions}>
        <Button title="Sauvegarder" onPress={saveTask} color="#4CAF50" />
        <View style={{ height: 10 }} />
        <Button title="Supprimer" onPress={deleteTask} color="crimson" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f4f5f7',
    flexGrow: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  section: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 12,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  subtaskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  note: {
    padding: 12,
    borderRadius: 6,
    marginVertical: 4,
  },
  actions: {
    marginTop: 20,
  },
});
