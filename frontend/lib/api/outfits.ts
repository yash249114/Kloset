import client from './client';
import type { Outfit, OutfitFilters, CreateOutfitPayload, APIResponse, PaginationMeta } from '@/types';

export const outfitsAPI = {
  browse: async (filters?: OutfitFilters): Promise<{ outfits: Outfit[]; meta: PaginationMeta }> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '' && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    const { data } = await client.get<APIResponse<Outfit[]>>(`/outfits?${params.toString()}`);
    return { outfits: data.data || [], meta: data.meta! };
  },

  getById: async (id: string): Promise<Outfit> => {
    const { data } = await client.get<APIResponse<Outfit>>(`/outfits/${id}`);
    return data.data!;
  },

  getTrending: async (limit = 12): Promise<Outfit[]> => {
    const { data } = await client.get<APIResponse<Outfit[]>>(`/outfits/trending?limit=${limit}`);
    return data.data || [];
  },

  create: async (payload: CreateOutfitPayload): Promise<Outfit> => {
    const { data } = await client.post<APIResponse<Outfit>>('/outfits', payload);
    return data.data!;
  },

  update: async (id: string, payload: Partial<CreateOutfitPayload>): Promise<void> => {
    await client.put(`/outfits/${id}`, payload);
  },

  delete: async (id: string): Promise<void> => {
    await client.delete(`/outfits/${id}`);
  },

  submitForApproval: async (id: string): Promise<void> => {
    await client.put(`/outfits/${id}/submit`);
  },

  trackView: async (id: string): Promise<void> => {
    await client.post(`/outfits/${id}/view`);
  },

  // Wishlist
  getWishlist: async (page = 1): Promise<{ outfits: Outfit[]; meta: PaginationMeta }> => {
    const { data } = await client.get<APIResponse<Outfit[]>>(`/wishlist?page=${page}`);
    return { outfits: data.data || [], meta: data.meta! };
  },

  addToWishlist: async (outfitId: string): Promise<void> => {
    await client.post(`/wishlist/${outfitId}`);
  },

  removeFromWishlist: async (outfitId: string): Promise<void> => {
    await client.delete(`/wishlist/${outfitId}`);
  },

  // Seller
  getSellerOutfits: async (page = 1): Promise<{ outfits: Outfit[]; meta: PaginationMeta }> => {
    const { data } = await client.get<APIResponse<Outfit[]>>(`/seller/outfits?page=${page}`);
    return { outfits: data.data || [], meta: data.meta! };
  },
};
