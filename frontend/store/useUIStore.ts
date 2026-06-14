import { create } from 'zustand';

interface UIState {
  cartOpen: boolean;
  aiStylistOpen: boolean;
  activeModal: string | null;

  // Actions
  setCartOpen: (open: boolean) => void;
  setAIStylistOpen: (open: boolean) => void;
  setActiveModal: (modalId: string | null) => void;
  closeAll: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  cartOpen: false,
  aiStylistOpen: false,
  activeModal: null,

  setCartOpen: (open) => set({ cartOpen: open }),
  setAIStylistOpen: (open) => set({ aiStylistOpen: open }),
  setActiveModal: (modalId) => set({ activeModal: modalId }),
  closeAll: () => set({ cartOpen: false, aiStylistOpen: false, activeModal: null }),
}));
