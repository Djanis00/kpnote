import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let icon;
          if (route.name === 'index') icon = 'document-text-outline';
          if (route.name === 'tasks') icon = 'checkbox-outline';
          if (route.name === 'settings') icon = 'settings-outline';
          return <Ionicons name={icon} size={size} color={color} />;
        },
        headerShown: false,
      })}
    >
      <Tabs.Screen name="index" options={{ title: 'Notes' }} />
      <Tabs.Screen name="tasks" options={{ title: 'Tâches' }} />
      <Tabs.Screen name="categories" options={{ title: 'Catégories' }} />
      <Tabs.Screen name="settings" options={{ title: 'Paramètres' }} />
    </Tabs>
    
  );
}
