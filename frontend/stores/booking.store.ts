import { create } from 'zustand';

interface BookingState {
  // Checkout state
  outfitId: string | null;
  outfitTitle: string | null;
  outfitImage: string | null;
  selectedSize: string;
  selectedDuration: 1 | 3 | 7;
  pickupDate: string | null;
  returnDate: string | null;
  deliveryType: 'pickup' | 'delivery';
  addressId: string | null;

  // Pricing
  rentalAmount: number;
  securityDeposit: number;
  deliveryFee: number;
  platformFee: number;

  // Payment
  paymentStatus: 'idle' | 'processing' | 'success' | 'failed';
  orderId: string | null;

  // Actions
  setOutfit: (id: string, title: string, image: string) => void;
  setSize: (size: string) => void;
  setDuration: (days: 1 | 3 | 7) => void;
  setDates: (pickup: string, returnDate: string) => void;
  setDeliveryType: (type: 'pickup' | 'delivery') => void;
  setAddress: (id: string) => void;
  setPricing: (rental: number, deposit: number, deliveryFee: number) => void;
  setPaymentStatus: (status: 'idle' | 'processing' | 'success' | 'failed') => void;
  setOrderId: (id: string) => void;
  getTotalAmount: () => number;
  reset: () => void;
}

const initialState = {
  outfitId: null,
  outfitTitle: null,
  outfitImage: null,
  selectedSize: 'M',
  selectedDuration: 1 as const,
  pickupDate: null,
  returnDate: null,
  deliveryType: 'pickup' as const,
  addressId: null,
  rentalAmount: 0,
  securityDeposit: 0,
  deliveryFee: 0,
  platformFee: 0,
  paymentStatus: 'idle' as const,
  orderId: null,
};

export const useBookingStore = create<BookingState>()((set, get) => ({
  ...initialState,

  setOutfit: (id, title, image) =>
    set({ outfitId: id, outfitTitle: title, outfitImage: image }),

  setSize: (size) => set({ selectedSize: size }),

  setDuration: (days) => set({ selectedDuration: days }),

  setDates: (pickup, returnDate) =>
    set({ pickupDate: pickup, returnDate }),

  setDeliveryType: (type) =>
    set({
      deliveryType: type,
      deliveryFee: type === 'delivery' ? get().deliveryFee : 0,
    }),

  setAddress: (id) => set({ addressId: id }),

  setPricing: (rental, deposit, deliveryFee) => {
    const platformFee = Math.round(rental * 0.05); // 5% platform fee
    set({ rentalAmount: rental, securityDeposit: deposit, deliveryFee, platformFee });
  },

  setPaymentStatus: (status) => set({ paymentStatus: status }),

  setOrderId: (id) => set({ orderId: id }),

  getTotalAmount: () => {
    const state = get();
    return (
      state.rentalAmount +
      state.securityDeposit +
      (state.deliveryType === 'delivery' ? state.deliveryFee : 0) +
      state.platformFee
    );
  },

  reset: () => set(initialState),
}));
