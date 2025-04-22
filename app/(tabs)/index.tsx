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
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  console.log('🟢 Composant NotesScreen chargé');

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
        const data = JSON.parse(cached);
        setNotes(data);
        Alert.alert('Mode hors ligne', 'Affichage des notes en cache.');
      } else {
        Alert.alert('Erreur', 'Impossible de charger les notes.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('https://keep.kevindupas.com/api/categories', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCategories(data);
    } catch {
      console.log('Erreur de chargement des catégories');
    }
  };

  const applyFilter = () => {
    if (!selectedCategoryId) {
      setFilteredNotes(notes);
    } else {
      const filtered = notes.filter((note) =>
        note.categories?.some((cat) => cat.id === selectedCategoryId)
      );
      setFilteredNotes(filtered);
    }
  };

  useEffect(() => {
    fetchNotes();
    fetchCategories();
  }, []);

  useEffect(() => {
    applyFilter();
  }, [notes, selectedCategoryId]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📝 Bienvenue sur l’écran des notes</Text>

      <View style={styles.buttons}>
        <Button title="Rafraîchir" onPress={fetchNotes} />
        <Link href="/notes/create" asChild>
          <Button title="Créer une note" />
        </Link>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filters}>
        <TouchableOpacity
          onPress={() => setSelectedCategoryId(null)}
          style={[
            styles.filterButton,
            selectedCategoryId === null && styles.filterSelected,
          ]}
        >
          <Text>Toutes</Text>
        </TouchableOpacity>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            onPress={() => setSelectedCategoryId(cat.id)}
            style={[
              styles.filterButton,
              selectedCategoryId === cat.id && styles.filterSelected,
              { backgroundColor: cat.color || '#eee' },
            ]}
          >
            <Text>{cat.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : filteredNotes.length === 0 ? (
        <Text style={{ marginTop: 16 }}>⚠️ Aucune note à afficher.</Text>
      ) : (
        <NoteList notes={filteredNotes} onSelect={(note) => router.push(`/notes/${note.id}`)} />
      )}

      <View style={{ marginTop: 20 }}>
        <Text>🛠 Debug</Text>
        <Text>Token: {token ? '✅' : '⛔'}</Text>
        <Text>Notes chargées: {notes.length}</Text>
        <Text>Notes filtrées: {filteredNotes.length}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  filters: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  filterButton: {
    padding: 8,
    borderRadius: 6,
    marginRight: 8,
    backgroundColor: '#ddd',
  },
  filterSelected: {
    borderWidth: 2,
    borderColor: '#000',
  },
});
