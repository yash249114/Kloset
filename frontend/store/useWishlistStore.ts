import { create } from 'zustand';
import { outfitsAPI } from '@/lib/api';
import type { Outfit } from '@/types';

interface WishlistState {
  wishlist: Outfit[];
  isLoading: boolean;
  
  // Actions
  fetchWishlist: () => Promise<void>;
  addToWishlist: (outfit: Outfit) => Promise<void>;
  removeFromWishlist: (outfitId: string) => Promise<void>;
  toggleWishlist: (outfit: Outfit) => Promise<void>;
  isWishlisted: (outfitId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  wishlist: [],
  isLoading: false,

  fetchWishlist: async () => {
    set({ isLoading: true });
    try {
      const resp = await outfitsAPI.getWishlist();
      set({ wishlist: resp.outfits || [] });
    } catch (err) {
      console.warn('Failed to load wishlist:', err);
    } finally {
      set({ isLoading: false });
    }
  },

  addToWishlist: async (outfit) => {
    try {
      await outfitsAPI.addToWishlist(outfit.id);
      set((state) => ({
        wishlist: [...state.wishlist.filter(item => item.id !== outfit.id), outfit]
      }));
    } catch (err) {
      console.error('Failed to add to wishlist:', err);
    }
  },

  removeFromWishlist: async (outfitId) => {
    try {
      await outfitsAPI.removeFromWishlist(outfitId);
      set((state) => ({
        wishlist: state.wishlist.filter((item) => item.id !== outfitId),
      }));
    } catch (err) {
      console.error('Failed to remove from wishlist:', err);
    }
  },

  toggleWishlist: async (outfit) => {
    const list = get().wishlist;
    const exists = list.some((item) => item.id === outfit.id);
    if (exists) {
      await get().removeFromWishlist(outfit.id);
    } else {
      await get().addToWishlist(outfit);
    }
  },

  isWishlisted: (outfitId) => {
    return get().wishlist.some((item) => item.id === outfitId);
  },
}));
