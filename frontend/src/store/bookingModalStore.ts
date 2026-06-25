import { create } from "zustand";

type BookingType = "taxi" | "airport" | "tour";

type State = {
  open: boolean;
  type: BookingType | null;
  prefill: {
    rideMode?: "oneway" | "round" | "local";
    vehicleId?: string;
    pickup?: string;
    drop?: string;
    airport?: string; // ← ADDED: was missing, causing it to be silently dropped
    routeId?: string;
    price?: number;
    locked?: boolean; // ← ADDED: true when pickup/drop come from a fixed Route card and must not be editable
  };

  openModal: (type: any, prefill?: any) => void;
  closeModal: () => void;
};

export const useBookingModal = create<State>((set) => ({
  open: false,
  type: null,
  prefill: {},

  openModal: (type, prefill = {}) => set({ open: true, type, prefill }),

  closeModal: () => set({ open: false, type: null, prefill: {} }),
}));