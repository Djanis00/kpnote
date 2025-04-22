import React from 'react';
import { render } from '@testing-library/react-native';
import LoginScreen from '../app/auth/login';

jest.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    login: jest.fn(),
    logout: jest.fn(),
    token: null,
    loading: false,
  }),
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({
    replace: jest.fn(),
  }),
}));

describe('LoginScreen', () => {
  test('affiche les champs Email et Mot de passe', () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);
    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Mot de passe')).toBeTruthy();
    expect(getByText('Se connecter')).toBeTruthy();
  });
});