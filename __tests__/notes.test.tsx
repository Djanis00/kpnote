import React from 'react';
import { render } from '@testing-library/react-native';
import NoteList from '../components/notes/NoteList';

describe('NoteList', () => {
  const mockNotes = [
    { id: 1, title: 'Note 1', content: 'Contenu 1' },
    { id: 2, title: 'Note 2', content: 'Contenu 2' },
  ];

  test('affiche la liste des notes', () => {
    const { getByText } = render(
      <NoteList notes={mockNotes} onSelect={() => {}} />
    );

    expect(getByText('Note 1')).toBeTruthy();
    expect(getByText('Note 2')).toBeTruthy();
  });
});