import { View, Text, Button, StyleSheet, Alert, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { useColorScheme } from '../../hooks/useColorScheme';
import { useState } from 'react';

export default function SettingsScreen() {
  const { logout } = useAuth();
  const router = useRouter();
  const colorScheme = useColorScheme(); 
  const [isDark, setIsDark] = useState(colorScheme === 'dark');

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/auth/login');
    } catch (err) {
      Alert.alert('Erreur', 'Impossible de se déconnecter');
    }
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
    // Ici tu peux connecter à un ThemeContext si tu veux gérer un vrai thème app-wide
    Alert.alert('Thème', `Mode ${!isDark ? 'sombre' : 'clair'} activé`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Paramètres</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Mode {isDark ? 'sombre' : 'clair'}</Text>
        <Switch value={isDark} onValueChange={toggleTheme} />
      </View>

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
    marginBottom: 40,
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 40,
  },
  label: {
    fontSize: 16,
  },
  button: {
    width: '100%',
    maxWidth: 300,
  },
});
