import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { UserProfile } from '@/types';

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  sessionExpired: boolean;
  login: (user: UserProfile, token: string) => void;
  logout: () => void;
  setSessionExpired: (expired: boolean) => void;
  updateUserPreferences: (preferences: Partial<UserProfile>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: {
        id: 'usr_prod_001',
        name: 'Alex Rivera',
        email: 'alex.rivera@mobility.org',
        phone: '+1 (555) 234-5678',
        role: 'USER',
        defaultVehicle: 'FOUR_WHEELER',
        preferredObjective: 'BALANCED',
        units: 'METRIC',
        language: 'en',
      },
      token: 'jwt_mock_prod_session_token_valid',
      isAuthenticated: true,
      sessionExpired: false,

      login: (user, token) =>
        set({
          user,
          token,
          isAuthenticated: true,
          sessionExpired: false,
        }),

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
      storage: createJSONStorage(() => sessionStorage), // Use sessionStorage to prevent cross-session token persistence leaks
    }
  )
);
