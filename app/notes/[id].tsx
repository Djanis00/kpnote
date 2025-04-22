import { useEffect, useState } from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export default function EditNote() {
  const { id } = useLocalSearchParams();
  const { token } = useAuth();
  const router = useRouter();

  const [note, setNote] = useState({ title: '', content: '', categories: [] });
  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNote = async () => {
    try {
      const res = await fetch(`https://keep.kevindupas.com/api/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setNote(data);
    } catch {
      Alert.alert('Erreur', 'Impossible de charger la note');
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('https://keep.kevindupas.com/api/categories', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setAllCategories(data);
    } catch {
      Alert.alert('Erreur', 'Impossible de charger les catégories');
    }
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`https://keep.kevindupas.com/api/notes/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: note.title,
          content: note.content,
          category_ids: note.categories.map((c) => c.id),
        }),
      });

      if (res.ok) {
        Alert.alert('Note mise à jour');
        router.replace('/');
      } else {
        Alert.alert('Erreur', 'Échec de la mise à jour');
      }
    } catch {
      Alert.alert('Erreur', 'Connexion impossible');
    }
  };

  const handleDelete = async () => {
    Alert.alert('Supprimer ?', 'Cette action est irréversible', [
      { text: 'Annuler' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          await fetch(`https://keep.kevindupas.com/api/notes/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
          });
          router.replace('/');
        },
      },
    ]);
  };

  const toggleCategory = (cat) => {
    const exists = note.categories.some((c) => c.id === cat.id);
    const updated = exists
      ? note.categories.filter((c) => c.id !== cat.id)
      : [...note.categories, cat];
    setNote({ ...note, categories: updated });
  };

  useEffect(() => {
    Promise.all([fetchNote(), fetchCategories()]).then(() =>
      setLoading(false)
    );
  }, []);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 16 }}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <TextInput
        value={note.title}
        onChangeText={(text) => setNote({ ...note, title: text })}
        placeholder="Titre"
        style={styles.input}
      />
      <TextInput
        value={note.content}
        onChangeText={(text) => setNote({ ...note, content: text })}
        placeholder="Contenu"
        style={[styles.input, { height: 120 }]}
        multiline
      />

      <Text style={styles.sectionTitle}>Catégories</Text>
      <View style={styles.tags}>
        {allCategories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            onPress={() => toggleCategory(cat)}
            style={[
              styles.tag,
              {
                backgroundColor: note.categories.some((c) => c.id === cat.id)
                  ? cat.color
                  : '#eee',
              },
            ]}
          >
            <Text>{cat.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Button title="Enregistrer les modifications" onPress={handleSave} />
      <Button title="Supprimer la note" onPress={handleDelete} color="red" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 12,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  tag: {
    padding: 8,
    borderRadius: 6,
    marginRight: 8,
    marginBottom: 8,
  },
});
