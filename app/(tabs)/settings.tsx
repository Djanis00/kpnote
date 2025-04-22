import { View, Text, Button } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';

export default function SettingsScreen() {
  const { logout } = useAuth();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Paramètres</Text>
      <Button title="Se déconnecter" onPress={logout} />
    </View>
  );
}
