import { create } from 'zustand';

interface UserProfile {
  id: string;
  clerkUserId: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
}

interface AuthState {
  user: UserProfile | null;
  isSyncing: boolean;
  setUser: (user: UserProfile | null) => void;
  setSyncing: (syncing: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isSyncing: false,
  setUser: (user) => set({ user }),
  setSyncing: (syncing) => set({ isSyncing: syncing }),
  logout: () => set({ user: null, isSyncing: false }),
}));
