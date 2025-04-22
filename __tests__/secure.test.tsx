import * as SecureStore from 'expo-secure-store';

jest.mock('expo-secure-store', () => ({
  setItemAsync: jest.fn(),
  getItemAsync: jest.fn(() => Promise.resolve('fake_token')),
  deleteItemAsync: jest.fn(),
}));

describe('SecureStore', () => {
  test('sauvegarde et lit un token', async () => {
    await SecureStore.setItemAsync('token', '123456');
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith('token', '123456');

    const token = await SecureStore.getItemAsync('token');
    expect(token).toBe('fake_token');
  });

  test('supprime un token', async () => {
    await SecureStore.deleteItemAsync('token');
    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('token');
  });
});