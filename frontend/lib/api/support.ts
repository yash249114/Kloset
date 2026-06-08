import api from './client';

export interface TicketPayload {
  renterName: string;
  renterEmail: string;
  subject: string;
  description: string;
  priority: string;
}

export const supportAPI = {
  createTicket: async (payload: TicketPayload) => {
    const res = await api.post('/support/tickets', payload);
    return res.data.data;
  },
  getMyTickets: async () => {
    const res = await api.get('/support/tickets');
    return res.data.data;
  },
  getAllTickets: async () => {
    const res = await api.get('/admin/support/tickets');
    return res.data.data;
  },
  updateStatus: async (id: string, status: string) => {
    const res = await api.put(`/admin/support/tickets/${id}/status`, { status });
    return res.data.data;
  },
  addAgentReply: async (id: string, text: string) => {
    const res = await api.post(`/admin/support/tickets/${id}/reply`, { text });
    return res.data.data;
  },
};
