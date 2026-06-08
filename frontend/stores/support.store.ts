import { create } from 'zustand';
import { supportAPI } from '@/lib/api/support';

export interface SupportTicket {
  id: string;
  renterName: string;
  renterEmail: string;
  subject: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in-progress' | 'waiting' | 'resolved' | 'closed';
  createdAt: string;
  chatHistory: Array<{ sender: 'user' | 'bot' | 'agent'; text: string; timestamp: string }>;
}

interface SupportStore {
  tickets: SupportTicket[];
  fetchTickets: (isAdmin?: boolean) => Promise<void>;
  addTicket: (ticket: Omit<SupportTicket, 'id' | 'createdAt' | 'status' | 'chatHistory'> & { chatHistory?: SupportTicket['chatHistory'] }) => Promise<void>;
  updateTicketStatus: (id: string, status: SupportTicket['status']) => Promise<void>;
  addAgentReply: (id: string, text: string) => Promise<void>;
}

const parseTicket = (t: any): SupportTicket => {
  let chatHistoryArray = [];
  if (t.chatHistory) {
    try {
      chatHistoryArray = typeof t.chatHistory === 'string' ? JSON.parse(t.chatHistory) : t.chatHistory;
    } catch (e) {
      console.warn('Failed to parse chatHistory JSON:', e);
    }
  }
  return {
    ...t,
    chatHistory: chatHistoryArray,
  };
};

export const useSupportStore = create<SupportStore>((set) => ({
  tickets: [],

  fetchTickets: async (isAdmin = false) => {
    try {
      const tickets = isAdmin
        ? await supportAPI.getAllTickets()
        : await supportAPI.getMyTickets();
      set({ tickets: (tickets || []).map(parseTicket) });
    } catch (err) {
      console.warn('Failed to fetch support tickets:', err);
    }
  },

  addTicket: async (newTicket) => {
    try {
      const { chatHistory, ...payload } = newTicket;
      const ticket = await supportAPI.createTicket(payload);
      set((state) => ({
        tickets: [parseTicket(ticket), ...state.tickets],
      }));
    } catch (err) {
      console.error('Failed to raise ticket:', err);
    }
  },

  updateTicketStatus: async (id, status) => {
    try {
      const updatedTicket = await supportAPI.updateStatus(id, status);
      set((state) => ({
        tickets: state.tickets.map((t) =>
          t.id === id ? { ...t, status: updatedTicket.status } : t
        ),
      }));
    } catch (err) {
      console.error('Failed to update ticket status:', err);
    }
  },

  addAgentReply: async (id, text) => {
    try {
      const updatedTicket = await supportAPI.addAgentReply(id, text);
      set((state) => ({
        tickets: state.tickets.map((t) =>
          t.id === id ? parseTicket(updatedTicket) : t
        ),
      }));
    } catch (err) {
      console.error('Failed to add agent reply:', err);
    }
  },
}));
