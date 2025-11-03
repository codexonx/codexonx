import { MMKV } from 'react-native-mmkv';

// MMKV depolama örneği oluşturma
export const mmkvStorage = new MMKV({
  id: 'codexonx-storage',
  encryptionKey: 'codexonx-secure-key',
});

// Kimlik doğrulama token'ını al
export const getAuthToken = async (): Promise<string | null> => {
  return mmkvStorage.getString('auth_token');
};

// Dil tercihini al
export const getLanguagePreference = (): string | null => {
  return mmkvStorage.getString('language');
};

// Dil tercihini kaydet
export const saveLanguagePreference = (language: string): void => {
  mmkvStorage.set('language', language);
};
