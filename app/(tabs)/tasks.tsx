import { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter, Link } from 'expo-router';

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

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.task}
      onPress={() => router.push(`/tasks/${item.id}`)}
    >
      <Text style={[styles.title, item.completed && { textDecorationLine: 'line-through' }]}>
        {item.description}
      </Text>
      <Text style={{ fontSize: 12 }}>
        {item.completed ? 'Terminée' : 'En cours'}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>Mes Tâches</Text>
        <Link href="/tasks/create" asChild>
          <Button title="Ajouter" />
        </Link>
      </View>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : tasks.length === 0 ? (
        <Text>Aucune tâche pour le moment.</Text>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  heading: { fontSize: 20, fontWeight: 'bold' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    alignItems: 'center',
  },
  task: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginVertical: 6,
  },
  title: { fontSize: 16 },
});
