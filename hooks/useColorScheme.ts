import { Appearance } from 'react-native';

export function useColorScheme(): 'light' | 'dark' {
  return Appearance.getColorScheme() || 'light';
}
