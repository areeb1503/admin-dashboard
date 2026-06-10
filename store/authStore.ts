/**
 * authStore - Zustand store for authentication state
 *
 * Why Zustand over Redux?
 * - Minimal boilerplate: no actions/reducers/dispatchers needed
 * - Built-in async support: just use async functions directly in store actions
 * - Small bundle size (~1KB vs Redux ~10KB+)
 * - Works seamlessly alongside NextAuth: we mirror the session token here
 *   so any component/store can read it without calling useSession everywhere
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      setAccessToken: (token) => set({ accessToken: token }),
      clearAuth: () => set({ accessToken: null }),
    }),
    {
      name: 'auth-storage', // localStorage key
    }
  )
);
