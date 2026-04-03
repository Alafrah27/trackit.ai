import axios from 'axios';

// The URL should be configured in your .env, defaulting to localhost for Android Emulators/iOS Simulators if not present.
// Tip: Use your local IP (e.g. http://192.168.x.x:5000) for physical devices on the same Wi-Fi.
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
