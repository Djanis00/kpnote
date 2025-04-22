import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
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
    if (!name.trim()) return;
    try {
      await fetch('https://keep.kevindupas.com/api/categories', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, color }),
      });
      setName('');
      setColor('#FF5733');
      fetchCategories();
    } catch {
      Alert.alert('Erreur', 'Impossible d’ajouter la catégorie');
    }
  };

  const deleteCategory = async (id: number) => {
    try {
      await fetch(`https://keep.kevindupas.com/api/categories/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCategories();
    } catch {
      Alert.alert('Erreur', 'Impossible de supprimer la catégorie');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ajouter une catégorie</Text>
      <TextInput
        placeholder="Nom"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Couleur personnalisée (#hex)"
        value={color}
        onChangeText={setColor}
        style={styles.input}
      />
      <Text style={{ marginTop: 8 }}>Ou choisir une couleur :</Text>
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

      <View style={styles.colorPreviewContainer}>
        <Text>Aperçu :</Text>
        <View style={[styles.colorDot, { backgroundColor: color || '#ccc' }]} />
      </View>

      <Button title="Ajouter" onPress={addCategory} />

      <Text style={styles.title}>Catégories existantes</Text>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View
              style={[styles.colorDot, { backgroundColor: item.color || '#eee' }]}
            />
            <Text style={styles.catName}>{item.name}</Text>
            <Button
              title="Supprimer"
              color="red"
              onPress={() => deleteCategory(item.id)}
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, flex: 1 },
  title: { fontSize: 18, fontWeight: 'bold', marginTop: 24 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginVertical: 8,
  },
  colorPreviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  colorDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#999',
    marginLeft: 6,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginVertical: 6,
    gap: 8,
  },
  catName: {
    flex: 1,
    fontSize: 16,
  },
  palette: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginVertical: 10,
  },
  colorPreview: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
});
