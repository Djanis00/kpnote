import { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Button,
  Alert,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../contexts/AuthContext';
import NoteList from '../../components/notes/NoteList';
import { Link, useRouter } from 'expo-router';

export default function NotesScreen() {
  const { token } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://keep.kevindupas.com/api/notes', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setNotes(data);
      await AsyncStorage.setItem('notes', JSON.stringify(data));
    } catch (e) {
      const cached = await AsyncStorage.getItem('notes');
      if (cached) {
        setNotes(JSON.parse(cached));
        Alert.alert('Mode hors ligne', 'Affichage en cache.');
      } else {
        Alert.alert('Erreur', 'Impossible de charger les notes.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Mes Notes</Text>

      <View style={styles.buttons}>
        <Button title="Rafraîchir" onPress={fetchNotes} color="#607D8B" />
        <Link href="/notes/create" asChild>
          <Button title="Nouvelle Note" color="#2196F3" />
        </Link>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#2196F3" style={{ marginTop: 40 }} />
      ) : notes.length === 0 ? (
        <Text style={styles.empty}>Aucune note disponible</Text>
      ) : (
        <NoteList
          notes={notes}
          onSelect={(note) => router.push(`/notes/${note.id}`)}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f3f4f6',
    flexGrow: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: 24,
    width: '100%',
    maxWidth: 400,
  },
  empty: {
    marginTop: 40,
    fontSize: 16,
    color: '#666',
  },
});
