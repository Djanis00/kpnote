import { Slot, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { View, Text } from 'react-native';
import { AuthProvider, useAuth } from '../contexts/AuthContext';

function ProtectedLayout() {
  const { token, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !token) {
      console.log('🔒 Redirection vers /auth/login');
      router.replace('/auth/login');
    }
  }, [loading, token]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  return <Slot />;
}

export default function Layout() {
  return (
    <AuthProvider>
      <ProtectedLayout />
    </AuthProvider>
  );
}
