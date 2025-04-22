import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CreateNote from '../app/notes/create';

jest.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({ token: 'test-token' }),
}));

// Mock Alert pour intercepter les alertes
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  return {
    ...RN,
    Alert: { alert: jest.fn() },
  };
});

describe('CreateNote screen', () => {
  test('affiche une alerte si le titre est vide', () => {
    const { getByPlaceholderText, getByText } = render(<CreateNote />);
    const contenuInput = getByPlaceholderText('Contenu');
    const enregistrerBtn = getByText('Enregistrer la note');

    fireEvent.changeText(contenuInput, 'Contenu de test');
    fireEvent.press(enregistrerBtn);

    // On vérifie qu'une alerte est déclenchée
    expect(require('react-native').Alert.alert).toHaveBeenCalledWith(
      'Erreur',
      'Titre et contenu requis'
    );
  });
});
