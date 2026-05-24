import { Platform } from 'react-native';

// La variable d'environnement prend le dessus si elle existe (via .env)
export const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.137.1:3000/api';

export default {
  API_URL,
};
