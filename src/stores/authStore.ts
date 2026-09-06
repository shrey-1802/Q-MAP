import { create } from 'zustand';
import { persist, createJSONStorage, type StateStorage } from 'zustand/middleware';
import type { UserProfile } from '@/types';

// Safe In-Memory & Session Storage fallback
const safeStorage: StateStorage = {
  getItem: (name: string): string | null => {
    try {
      return typeof window !== 'undefined' && window.sessionStorage
        ? window.sessionStorage.getItem(name)
        : null;
    } catch {
      return null;
    }
  },
  setItem: (name: string, value: string): void => {
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        window.sessionStorage.setItem(name, value);
      }
    } catch {
      // Ignore in restricted environments
    }
  },
  removeItem: (name: string): void => {
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        window.sessionStorage.removeItem(name);
      }
    } catch {
      // Ignore in restricted environments
    }
  },
};

export interface RegisteredAccount {
  user: UserProfile;
  passwordHash: string;
}

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  sessionExpired: boolean;
  registeredAccounts: RegisteredAccount[];
  login: (user: UserProfile, token: string) => void;
  registerAccount: (user: UserProfile, password: string) => void;
  logout: () => void;
  setSessionExpired: (expired: boolean) => void;
  updateUserPreferences: (preferences: Partial<UserProfile>) => void;
}

const defaultAdminUser: UserProfile = {
  id: 'usr_prod_001',
  name: 'Alex Rivera',
  email: 'alex.rivera@mobility.org',
  phone: '+1 (555) 234-5678',
  role: 'FLEET_MANAGER',
  defaultVehicle: 'FOUR_WHEELER',
  preferredObjective: 'BALANCED',
  units: 'METRIC',
  language: 'en',
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: defaultAdminUser,
      token: 'jwt_mock_prod_session_token_valid',
      isAuthenticated: true,
      sessionExpired: false,
      registeredAccounts: [
        {
          user: defaultAdminUser,
          passwordHash: 'password123',
        },
      ],

      login: (user, token) =>
        set({
          user,
          token,
          isAuthenticated: true,
          sessionExpired: false,
        }),

      registerAccount: (newUser, password) => {
        const existing = get().registeredAccounts;
        set({
          registeredAccounts: [...existing, { user: newUser, passwordHash: password }],
          user: newUser,
          token: `jwt_session_${Date.now()}`,
          isAuthenticated: true,
          sessionExpired: false,
        });
      },

      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          sessionExpired: false,
        }),

      setSessionExpired: (expired) =>
        set({
          sessionExpired: expired,
          isAuthenticated: expired ? false : true,
          token: expired ? null : undefined,
        }),

      updateUserPreferences: (preferences) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...preferences } : null,
        })),
    }),
    {
      name: 'qmap_auth_storage',
      storage: createJSONStorage(() => safeStorage),
    }
  )
);
