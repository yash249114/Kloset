import client from './client';
import type { APIResponse } from '@/types';

export interface AdminStats {
  total_users: number;
  total_outfits: number;
  total_bookings: number;
  active_bookings: number;
  total_revenue: number;
  open_disputes: number;
  kyc_queue_count: number;
  pending_approval_count: number;
  timestamp: string;
}

export interface AdminKYCUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  kyc_status: 'pending' | 'submitted' | 'verified' | 'rejected';
  created_at: string;
}

export interface AdminPendingOutfit {
  id: string;
  title: string;
  category: string;
  price_1day: number;
  price_3day: number;
  price_7day: number;
  security_deposit: number;
  seller_id: string;
  seller_name: string;
  seller_email: string;
  status: string;
  created_at: string;
  images: any; // We can parse or display
}

export interface AdminDispute {
  id: string;
  booking_id: string;
  raised_by: string;
  against: string;
  reason: string;
  description: string;
  status: 'open' | 'in_review' | 'resolved' | 'closed';
  resolution: string | null;
  resolution_note: string | null;
  refund_amount: number;
  renter_name: string;
  outfit_title: string;
  deposit_amount: number;
  created_at: string;
}

export const adminAPI = {
  getStats: async (): Promise<AdminStats> => {
    const { data } = await client.get<APIResponse<AdminStats>>('/admin/stats');
    return data.data!;
  },

  getAIOps: async (): Promise<any> => {
    const { data } = await client.get<APIResponse<any>>('/admin/aiops');
    return data.data!;
  },

  getKYCQueue: async (): Promise<AdminKYCUser[]> => {
    const { data } = await client.get<APIResponse<AdminKYCUser[]>>('/admin/kyc');
    return data.data || [];
  },

  approveKYC: async (userId: string): Promise<void> => {
    await client.put(`/admin/kyc/${userId}/approve`);
  },

  rejectKYC: async (userId: string, reason: string): Promise<void> => {
    await client.put(`/admin/kyc/${userId}/reject`, { reason });
  },

  getPendingOutfits: async (): Promise<AdminPendingOutfit[]> => {
    const { data } = await client.get<APIResponse<AdminPendingOutfit[]>>('/admin/outfits');
    return data.data || [];
  },

  approveOutfit: async (id: string): Promise<void> => {
    await client.put(`/admin/outfits/${id}/approve`);
  },

  rejectOutfit: async (id: string, reason: string): Promise<void> => {
    await client.put(`/admin/outfits/${id}/reject`, { reason });
  },

  getDisputes: async (): Promise<AdminDispute[]> => {
    const { data } = await client.get<APIResponse<AdminDispute[]>>('/admin/disputes');
    return data.data || [];
  },

  resolveDispute: async (
    id: string,
    payload: { resolution: string; note: string; refund_amount: number }
  ): Promise<void> => {
    await client.put(`/admin/disputes/${id}/resolve`, payload);
  },

  getLogs: async (): Promise<any[]> => {
    const { data } = await client.get<APIResponse<any[]>>('/admin/logs');
    return data.data || [];
  },
};
