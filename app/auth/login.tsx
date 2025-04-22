import { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Text,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer un email et un mot de passe.');
      return;
    }

    try {
      console.log('🟢 handleLogin appelé');
      const res = await fetch('https://keep.kevindupas.com/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const result = await res.json();
      console.log('📦 Résultat API :', result);
      console.log('✅ Statut :', res.status);

      if (res.ok && result.access_token) {
        await login(result.access_token);
        console.log('🔐 Token reçu ? ', !!result.access_token);

        setTimeout(() => {
          router.replace('/'); // ✅ redirection vers app/index.tsx
        }, 100);
      } else {
        Alert.alert('Erreur', result.message || 'Connexion échouée');
      }
    } catch (err) {
      console.error('Erreur réseau :', err);
      Alert.alert('Erreur', 'Impossible de se connecter.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connexion</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />
      <TextInput
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button title="Se connecter" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
});
