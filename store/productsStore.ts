/**
 * productsStore - Zustand store for products list and single product
 *
 * Caching Strategy:
 * - Cache key: "{category}-{query}-{skip}-{limit}"
 * - Avoids re-fetching when user navigates back to the same page/filter combo
 * - Categories list also cached (fetched once per session)
 * - In-memory only: fresh data on page reload, no stale cache issues
 */

import { create } from 'zustand';
import { Product } from '@/types';
import {
  fetchProducts,
  searchProducts,
  fetchProductsByCategory,
  fetchProductById,
  fetchCategories,
} from '@/lib/api';

interface ProductsCache {
  [key: string]: { products: Product[]; total: number };
}

interface ProductsState {
  products: Product[];
  total: number;
  currentProduct: Product | null;
  categories: string[];
  loading: boolean;
  error: string | null;
  cache: ProductsCache;

  // Actions
  loadProducts: (limit: number, skip: number, query?: string, category?: string) => Promise<void>;
  loadProductById: (id: number) => Promise<void>;
  loadCategories: () => Promise<void>;
  clearCurrentProduct: () => void;
  clearCache: () => void;
}

export const useProductsStore = create<ProductsState>((set, get) => ({
  products: [],
  total: 0,
  currentProduct: null,
  categories: [],
  loading: false,
  error: null,
  cache: {},

  loadProducts: async (limit, skip, query = '', category = '') => {
    const cacheKey = `${category}-${query}-${skip}-${limit}`;

    // Cache hit: return stored results without API call
    const cached = get().cache[cacheKey];
    if (cached) {
      set({ products: cached.products, total: cached.total });
      return;
    }

    set({ loading: true, error: null });
    try {
      let data: any;
      if (query) {
        data = await searchProducts(query, limit, skip);
      } else if (category) {
        data = await fetchProductsByCategory(category, limit, skip);
      } else {
        data = await fetchProducts(limit, skip);
      }

      const result = { products: data.products, total: data.total };

      set((state) => ({
        ...result,
        loading: false,
        cache: { ...state.cache, [cacheKey]: result },
      }));
    } catch (err: any) {
      set({ loading: false, error: err.message || 'Failed to load products' });
    }
  },

  loadProductById: async (id) => {
    set({ loading: true, error: null, currentProduct: null });
    try {
      const product = await fetchProductById(id) as Product;
      set({ currentProduct: product, loading: false });
    } catch (err: any) {
      set({ loading: false, error: err.message || 'Failed to load product' });
    }
  },

  loadCategories: async () => {
    // Categories are static - fetch once and cache forever in state
    if (get().categories.length > 0) return;
    try {
      const cats = await fetchCategories();
      set({ categories: cats });
    } catch {
      // Non-critical failure; filter just won't show categories
    }
  },

  clearCurrentProduct: () => set({ currentProduct: null }),
  clearCache: () => set({ cache: {} }),
}));
