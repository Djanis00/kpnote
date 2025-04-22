import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';

export default function SettingsScreen() {
  const { logout } = useAuth(); // ou signOut selon ton AuthContext
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout(); // Appelle la fonction du contexte
      router.replace('/auth/login'); // Redirige vers la page login
    } catch (err) {
      Alert.alert('Erreur', 'Impossible de se déconnecter');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Paramètres</Text>

      <View style={styles.button}>
        <Button title="Se déconnecter" onPress={handleLogout} color="crimson" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f9f9f9',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 32,
  },
  button: {
    width: '100%',
    maxWidth: 300,
  },
});
