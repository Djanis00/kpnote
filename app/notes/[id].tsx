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
  ScrollView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';

export default function EditNote() {
  const { id } = useLocalSearchParams();
  const { token } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [allCategories, setAllCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNote = async () => {
    try {
      const res = await fetch(`https://keep.kevindupas.com/api/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTitle(data.title);
      setContent(data.content);
      setSelectedCategories(data.categories?.map((c) => c.id) || []);
    } catch (err) {
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

  const toggleCategory = (catId: number) => {
    setSelectedCategories((prev) =>
      prev.includes(catId)
        ? prev.filter((id) => id !== catId)
        : [...prev, catId]
    );
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
          title,
          content,
          category_ids: selectedCategories,
        }),
      });

      if (res.ok) {
        Alert.alert('Succès', 'Note mise à jour');
        router.replace('/');
      } else {
        const err = await res.json();
        Alert.alert('Erreur', err.message || 'Échec de la mise à jour');
      }
    } catch {
      Alert.alert('Erreur', 'Impossible de mettre à jour');
    }
  };

  const handleDelete = async () => {
    Alert.alert('Confirmation', 'Supprimer cette note ?', [
      {
        text: 'Annuler',
        style: 'cancel',
      },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          try {
            const res = await fetch(`https://keep.kevindupas.com/api/notes/${id}`, {
              method: 'DELETE',
              headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
              router.replace('/');
            } else {
              Alert.alert('Erreur', 'Suppression échouée');
            }
          } catch {
            Alert.alert('Erreur', 'Erreur réseau');
          }
        },
      },
    ]);
  };

  useEffect(() => {
    fetchNote();
    fetchCategories().finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backText}>⬅️ Retour</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Modifier la note</Text>

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
        multiline
        style={[styles.input, styles.contentInput]}
      />

      <Text style={styles.sectionTitle}>Catégories</Text>
      <View style={styles.tags}>
        {allCategories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            onPress={() => toggleCategory(cat.id)}
            style={[
              styles.tag,
              {
                backgroundColor: selectedCategories.includes(cat.id)
                  ? cat.color
                  : '#eee',
              },
            ]}
          >
            <Text>{cat.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Button title="Mettre à jour" onPress={handleSave} color="#4CAF50" />
      <View style={{ height: 10 }} />
      <Button title="Supprimer" onPress={handleDelete} color="crimson" />
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
});
