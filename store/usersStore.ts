/**
 * usersStore - Zustand store for users list and single user
 *
 * Caching Strategy:
 * - Results are stored by a cache key: "page-{skip}-{limit}-{query}"
 * - Before making an API call, we check if that key already exists in the cache
 * - This avoids duplicate requests when navigating back to a previously visited page
 * - Cache is kept in Zustand state (in-memory), cleared on sign-out
 * - Trade-off: cache is session-scoped (not persisted), so fresh data on reload
 */

import { create } from 'zustand';
import { User } from '@/types';
import { fetchUsers, searchUsers, fetchUserById } from '@/lib/api';

interface UsersCache {
  [key: string]: { users: User[]; total: number };
}

interface UsersState {
  users: User[];
  total: number;
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  cache: UsersCache;

  // Actions
  loadUsers: (limit: number, skip: number, query?: string) => Promise<void>;
  loadUserById: (id: number) => Promise<void>;
  clearCurrentUser: () => void;
  clearCache: () => void;
}

export const useUsersStore = create<UsersState>((set, get) => ({
  users: [],
  total: 0,
  currentUser: null,
  loading: false,
  error: null,
  cache: {},

  loadUsers: async (limit, skip, query = '') => {
    const cacheKey = `${query}-${skip}-${limit}`;

    // Cache hit: return stored results without API call
    const cached = get().cache[cacheKey];
    if (cached) {
      set({ users: cached.users, total: cached.total });
      return;
    }

    set({ loading: true, error: null });
    try {
      const fetcher = query ? searchUsers : fetchUsers;
      const data = await (query ? searchUsers(query, limit, skip) : fetchUsers(limit, skip)) as any;

      const result = { users: data.users, total: data.total };

      // Store in cache
      set((state) => ({
        ...result,
        loading: false,
        cache: { ...state.cache, [cacheKey]: result },
      }));
    } catch (err: any) {
      set({ loading: false, error: err.message || 'Failed to load users' });
    }
  },

  loadUserById: async (id) => {
    set({ loading: true, error: null, currentUser: null });
    try {
      const user = await fetchUserById(id) as User;
      set({ currentUser: user, loading: false });
    } catch (err: any) {
      set({ loading: false, error: err.message || 'Failed to load user' });
    }
  },

  clearCurrentUser: () => set({ currentUser: null }),
  clearCache: () => set({ cache: {} }),
}));
