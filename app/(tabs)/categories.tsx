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

      const responseJson = await res.json();
      if (res.ok) {
        setName('');
        setColor('#FF5733');
        fetchCategories();
        Alert.alert('Succès', 'Catégorie ajoutée');
      } else {
        Alert.alert('Erreur', responseJson.message || 'Erreur serveur');
      }
    } catch (err) {
      Alert.alert('Erreur', 'Impossible de se connecter au serveur');
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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Nouvelle catégorie</Text>

      <TextInput
        placeholder="Nom de la catégorie"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Couleur (#hex)"
        value={color}
        onChangeText={setColor}
        style={styles.input}
      />

      <Text style={styles.label}>Couleurs prédéfinies :</Text>
      <View style={styles.palette}>
        {predefinedColors.map((c) => (
          <TouchableOpacity
            key={c}
            style={[
              styles.colorPreview,
              {
                backgroundColor: c,
                borderWidth: c === color ? 3 : 1,
                borderColor: c === color ? '#000' : '#ccc',
              },
            ]}
            onPress={() => setColor(c)}
          />
        ))}
      </View>

      <View style={styles.colorRow}>
        <Text style={styles.label}>Aperçu :</Text>
        <View style={[styles.colorDot, { backgroundColor: color }]} />
      </View>

      <View style={styles.button}>
        <Button title="Ajouter la catégorie" onPress={addCategory} color="#2196F3" />
      </View>

      <Text style={styles.title}>Catégories existantes</Text>

      {categories.map((item) => (
        <View key={item.id} style={styles.item}>
          <View style={[styles.colorDot, { backgroundColor: item.color || '#eee' }]} />
          <Text style={styles.catName}>{item.name}</Text>
          <Button title="Supprimer" color="crimson" onPress={() => deleteCategory(item.id)} />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 60,
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  label: {
    alignSelf: 'flex-start',
    fontWeight: '500',
    marginBottom: 8,
  },
  palette: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
    justifyContent: 'center',
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
    borderWidth: 1,
    borderColor: '#999',
  },
  colorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  button: {
    width: '100%',
    maxWidth: 400,
    marginBottom: 24,
  },
  item: {
    width: '100%',
    maxWidth: 400,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
  },
  catName: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
  },
});
