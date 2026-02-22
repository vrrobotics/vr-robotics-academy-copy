import { create } from 'zustand';

export type UserRole = 'student' | 'teacher' | 'admin';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  batchId?: string;
  phoneNumber?: string;
  profilePicture?: string;
}

interface AuthStore {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  updateProfilePicture: (profilePicture: string) => void;
  updateUserProfile: (updates: Partial<AuthUser>) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  login: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
  setLoading: (isLoading) => set({ isLoading }),
  updateProfilePicture: (profilePicture) => set((state) => ({
    user: state.user ? { ...state.user, profilePicture } : null,
  })),
  updateUserProfile: (updates) => set((state) => ({
    user: state.user ? { ...state.user, ...updates } : null,
  })),
}));
