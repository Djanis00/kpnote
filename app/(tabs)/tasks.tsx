import { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Button,
  Alert,
  ScrollView,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter, Link } from 'expo-router';
import TaskList from '../../components/tasks/TaskList';

export default function TasksScreen() {
  const { token } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://keep.kevindupas.com/api/tasks', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTasks(data);
    } catch (e) {
      Alert.alert('Erreur', 'Impossible de charger les tâches');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Mes Tâches</Text>

      <View style={styles.actions}>
        <Button title="🔄 Rafraîchir" onPress={fetchTasks} />
        <Link href="/tasks/create" asChild>
          <Button title="➕ Ajouter une tâche" />
        </Link>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#2196F3" />
      ) : tasks.length === 0 ? (
        <Text style={styles.empty}>Aucune tâche disponible.</Text>
      ) : (
        <TaskList tasks={tasks} onSelect={(task) => router.push(`/tasks/${task.id}`)} />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
    backgroundColor: '#f4f5f7',
  },
  heading: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 12,
  },
  empty: {
    fontSize: 16,
    color: '#777',
    marginTop: 40,
    textAlign: 'center',
  },
});
