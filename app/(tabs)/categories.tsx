import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';

export default function CategoriesScreen() {
  const { token } = useAuth();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [color, setColor] = useState('#FF5733');

  const predefinedColors = ['#FF5733', '#33B5E5', '#2ECC71', '#F1C40F', '#9B59B6', '#34495E'];

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

  const addCategory = async () => {
    if (!name.trim()) {
      Alert.alert('Erreur', 'Le nom est requis');
      return;
    }

    const payload = { name, color };
    try {
      const res = await fetch('https://keep.kevindupas.com/api/categories', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (res.ok) {
        setName('');
        setColor('#FF5733');
        fetchCategories();
      } else {
        Alert.alert('Erreur', json.message || 'Échec de création');
      }
    } catch {
      Alert.alert('Erreur', 'Connexion impossible');
    }
  };

  const deleteCategory = async (id: number) => {
    Alert.alert('Supprimer ?', 'Confirmer la suppression ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          try {
            await fetch(`https://keep.kevindupas.com/api/categories/${id}`, {
              method: 'DELETE',
              headers: { Authorization: `Bearer ${token}` },
            });
            fetchCategories();
          } catch {
            Alert.alert('Erreur', 'Suppression échouée');
          }
        },
      },
    ]);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Nouvelle catégorie</Text>

      <TextInput
        placeholder="Nom"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <Text style={styles.label}>Choisir une couleur :</Text>
      <View style={styles.palette}>
        {predefinedColors.map((c) => (
          <TouchableOpacity
            key={c}
            style={[
              styles.colorPreview,
              {
                backgroundColor: c,
                borderWidth: c === color ? 3 : 1,
                borderColor: c === color ? '#000' : '#999',
              },
            ]}
            onPress={() => setColor(c)}
          />
        ))}
      </View>

      <View style={styles.previewRow}>
        <Text style={styles.label}>Aperçu :</Text>
        <View style={[styles.colorDot, { backgroundColor: color }]} />
      </View>

      <View style={{ marginBottom: 24 }}>
        <Button title="Ajouter la catégorie" onPress={addCategory} />
      </View>

      <Text style={styles.title}>Catégories existantes</Text>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={[styles.colorDot, { backgroundColor: item.color || '#eee' }]} />
            <Text style={styles.catName}>{item.name}</Text>
            <Button title="Supprimer" color="crimson" onPress={() => deleteCategory(item.id)} />
          </View>
        )}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f4f5f7',
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
  },
  label: {
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  palette: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  colorPreview: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  colorDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginLeft: 8,
  },
  previewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginVertical: 6,
    backgroundColor: '#fff',
    gap: 10,
  },
  catName: {
    flex: 1,
    fontSize: 16,
  },
});
