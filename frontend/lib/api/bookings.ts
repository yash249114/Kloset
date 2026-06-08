import client from './client';
import type { Booking, APIResponse, PaginationMeta } from '@/types';

export interface CreateBookingPayload {
  outfit_id: string;
  pickup_date: string;
  return_date: string;
  size_selected: string;
  delivery_type: 'pickup' | 'delivery';
  delivery_address_id?: string;
}

export interface BookingListResponse {
  bookings: Booking[];
  meta: PaginationMeta;
}

export const bookingsAPI = {
  create: async (payload: CreateBookingPayload): Promise<Booking> => {
    const { data } = await client.post<APIResponse<Booking>>('/bookings', payload);
    return data.data!;
  },

  getById: async (id: string): Promise<Booking> => {
    const { data } = await client.get<APIResponse<Booking>>(`/bookings/${id}`);
    return data.data!;
  },

  listMyBookings: async (
    page = 1,
    perPage = 10,
    status?: string
  ): Promise<BookingListResponse> => {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
    });
    if (status) params.set('status', status);

    const { data } = await client.get<APIResponse<Booking[]>>(`/bookings/mine?${params}`);
    return {
      bookings: data.data || [],
      meta: data.meta || { page, per_page: perPage, total: 0, total_pages: 0 },
    };
  },

  listSellerBookings: async (
    page = 1,
    perPage = 10,
    status?: string
  ): Promise<BookingListResponse> => {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
    });
    if (status) params.set('status', status);

    const { data } = await client.get<APIResponse<Booking[]>>(`/bookings/seller?${params}`);
    return {
      bookings: data.data || [],
      meta: data.meta || { page, per_page: perPage, total: 0, total_pages: 0 },
    };
  },

  updateStatus: async (id: string, status: string): Promise<Booking> => {
    const { data } = await client.patch<APIResponse<Booking>>(`/bookings/${id}/status`, { status });
    return data.data!;
  },

  cancel: async (id: string, reason?: string): Promise<void> => {
    await client.post(`/bookings/${id}/cancel`, { reason });
  },
};
