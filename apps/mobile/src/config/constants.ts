import { Platform } from 'react-native';
import Config from 'react-native-config';

// API URL ve endpoint'ler
export const API_BASE_URL = Config.API_URL || 'https://api.codexonx.com/v1';
export const API_TIMEOUT = 15000; // 15 saniye

// Platform'a özel değerler
export const IS_IOS = Platform.OS === 'ios';
export const IS_ANDROID = Platform.OS === 'android';

// Uygulamanın diğer sabitleri
export const APP_NAME = 'Codexonx';
export const APP_VERSION = '0.1.0';

// Dil ayarları
export const DEFAULT_LANGUAGE = 'tr';
export const SUPPORTED_LANGUAGES = ['tr', 'en', 'de', 'es', 'fr'];

// Ekran boyutları
export const SCREEN_SIZES = {
  xs: 320,
  sm: 375,
  md: 414,
  lg: 768,
  xl: 1024,
};

// Tema ayarları
export const THEMES = {
  light: 'light',
  dark: 'dark',
  system: 'system',
};

// Cache anahtarları
export const CACHE_KEYS = {
  USER_PROFILE: 'user_profile',
  PROJECTS: 'projects',
  SETTINGS: 'settings',
};

// HTTP kodları
export const HTTP_CODES = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
};

// Animasyon süreleri (ms)
export const ANIMATION_DURATIONS = {
  short: 150,
  medium: 300,
  long: 500,
};

// İzinler
export const PERMISSIONS = {
  CAMERA: 'camera',
  PHOTO_LIBRARY: 'photo_library',
  LOCATION: 'location',
  NOTIFICATIONS: 'notifications',
};

// Statüs tipleri (renk kodları)
export const STATUS_COLORS = {
  active: '#10b981', // yeşil
  pending: '#f59e0b', // turuncu
  completed: '#4f46e5', // mavi
  error: '#ef4444', // kırmızı
};
