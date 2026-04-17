import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import * as SecureStore from 'expo-secure-store'

// Custom storage for SecureStore
const secureStorage = {
  getItem: async (name) => {
    const value = await SecureStore.getItemAsync(name);
    return value ? JSON.parse(value) : null;
  },
  setItem: async (name, value) => {
    await SecureStore.setItemAsync(name, JSON.stringify(value));
  },
  removeItem: async (name) => {
    await SecureStore.deleteItemAsync(name);
  },
};

export const useSettingsStore = create(
  persist(
    (set) => ({
      currency: 'USD',
      notifications: true,
      darkMode: false,
      smartReminders: true,
      language: 'English',

      setCurrency: (currency) => set({ currency }),
      setNotifications: (notifications) => set({ notifications }),
      setDarkMode: (darkMode) => set({ darkMode }),
      setSmartReminders: (smartReminders) => set({ smartReminders }),
      setLanguage: (language) => set({ language }),
    }),
    {
      name: 'trackit-settings',
      storage: createJSONStorage(() => secureStorage),
    }
  )
)
