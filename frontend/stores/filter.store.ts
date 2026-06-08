import { create } from 'zustand';
import type { OutfitFilters } from '@/types';

interface FilterState {
  filters: OutfitFilters;
  isFilterOpen: boolean;

  setFilter: (key: keyof OutfitFilters, value: string | number | undefined) => void;
  setFilters: (filters: Partial<OutfitFilters>) => void;
  resetFilters: () => void;
  toggleFilterPanel: () => void;
}

const defaultFilters: OutfitFilters = {
  q: '',
  city: '',
  category: undefined,
  size: '',
  min_price: undefined,
  max_price: undefined,
  occasion: '',
  sort: 'newest',
  page: 1,
  per_page: 20,
};

export const useFilterStore = create<FilterState>()((set) => ({
  filters: { ...defaultFilters },
  isFilterOpen: true,

  setFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value, page: 1 },
    })),

  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters, page: 1 },
    })),

  resetFilters: () => set({ filters: { ...defaultFilters } }),

  toggleFilterPanel: () =>
    set((state) => ({ isFilterOpen: !state.isFilterOpen })),
}));
