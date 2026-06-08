import client from './client';
import type { APIResponse } from '@/types';

export interface RaiseDisputePayload {
  booking_id: string;
  reason: string;
  description: string;
  evidence_photos?: string;
}

export interface DisputeResponse {
  id: string;
  booking_id: string;
  raised_by: string;
  against: string;
  reason: string;
  description: string;
  status: string;
  created_at: string;
}

export const disputesAPI = {
  raise: async (payload: RaiseDisputePayload): Promise<DisputeResponse> => {
    const { data } = await client.post<APIResponse<DisputeResponse>>('/disputes', payload);
    return data.data!;
  },
};
