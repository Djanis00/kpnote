import { useEffect, useState } from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function CreateNote() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState<number[]>([]);
  const { token } = useAuth();
  const router = useRouter();

  const fetchCategories = async () => {
    try {
      const res = await fetch('https://keep.kevindupas.com/api/categories', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCategories(data);
    } catch {
      Alert.alert('Erreur', 'Impossible de charger les catégories');
    }
  };

  const toggleCategory = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Erreur', 'Titre et contenu requis');
      return;
    }

    try {
      const res = await fetch('https://keep.kevindupas.com/api/notes', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content, category_ids: selected }),
      });

      if (res.ok) {
        Alert.alert('Note créée');
        router.replace('/');
      } else {
        const err = await res.json();
        Alert.alert('Erreur', err.message || 'Erreur API');
      }
    } catch (err) {
      Alert.alert('Erreur', 'Connexion impossible');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <TextInput
        placeholder="Titre"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <TextInput
        placeholder="Contenu"
        value={content}
        onChangeText={setContent}
        style={[styles.input, { height: 120 }]}
        multiline
      />

      <Text style={styles.sectionTitle}>Catégories</Text>
      <View style={styles.tags}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            onPress={() => toggleCategory(cat.id)}
            style={[
              styles.tag,
              {
                backgroundColor: selected.includes(cat.id)
                  ? cat.color
                  : '#eee',
              },
            ]}
          >
            <Text>{cat.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Button title="Enregistrer la note" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  backButton: { marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
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
