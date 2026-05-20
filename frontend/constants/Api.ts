import { Platform } from 'react-native';

// Standard local IP or localhost depending on whether running in simulator or physical phone.
// TIP: If using a physical phone with Expo Go, change the IP address to your computer's local network IP (e.g. 192.168.1.50)
export const API_URL = Platform.OS === 'android'
  ? 'http://10.0.2.2:3000/api'
  : 'http://localhost:3000/api';

export default {
  API_URL,
};
