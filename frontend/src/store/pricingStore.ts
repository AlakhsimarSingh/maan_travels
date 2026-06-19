import { create } from "zustand";

type State = {
  selectedVehicleId: string | null;
  setVehicle: (id: string) => void;

  priceMap: Record<string, number>; 
  setPriceMap: (map: Record<string, number>) => void;

  getPrice: (routeId: string) => number;
};

export const usePricingStore = create<State>((set, get) => ({
  selectedVehicleId: null,

  priceMap: {},

  setVehicle: (id) => set({ selectedVehicleId: id }),

  setPriceMap: (map) => set({ priceMap: map }),

  getPrice: (routeId) => {
    const vehicleId = get().selectedVehicleId;
    if (!vehicleId) return 0;

    return get().priceMap[`${routeId}_${vehicleId}`] || 0;
  },
}));