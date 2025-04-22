import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'expo-router';

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
    } catch (err) {
      console.error('Erreur chargement catégories', err);
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

    const payload = { title, content, category_ids: selected };
    try {
      const res = await fetch('https://keep.kevindupas.com/api/notes', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (res.ok) {
        Alert.alert('Succès', 'Note enregistrée');
        router.replace('/');
      } else {
        Alert.alert('Erreur', json.message || 'Erreur lors de la création');
      }
    } catch (err) {
      Alert.alert('Erreur', 'Connexion impossible');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backText}>⬅️ Retour</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Nouvelle note</Text>

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
        style={[styles.input, styles.contentInput]}
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

      <View style={styles.button}>
        <Button title="Enregistrer la note" onPress={handleSave} color="#2196F3" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f4f5f7',
    flexGrow: 1,
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
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    alignSelf: 'flex-start',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  contentInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  button: {
    marginTop: 16,
    width: '100%',
    maxWidth: 400,
  },
});
