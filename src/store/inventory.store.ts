import { create } from "zustand";

export interface InventoryType {
    value: any;
    is_valid: boolean;
}

interface InventoryState {
    assets_type: InventoryType | null;
    assets_details: InventoryType | null;
    credentials: InventoryType | null;
    owners: InventoryType | null;

    // actions
    setAssetsType: (data: InventoryType) => void;
    setAssetsDetails: (data: InventoryType) => void;
    setCredentials: (data: InventoryType) => void;
    setOwners: (data: InventoryType) => void;

    resetInventory: () => void;
}

export const useInventoryStore = create<InventoryState>((set) => ({
    assets_type: null,
    assets_details: null,
    credentials: null,
    owners: null,

    setAssetsType: (data) =>
        set({ assets_type: data }),

    setAssetsDetails: (data) =>
        set({ assets_details: data }),

    setCredentials: (data) =>
        set({ credentials: data }),

    setOwners: (data) =>
        set({ owners: data }),

    resetInventory: () =>
        set({
            assets_type: null,
            assets_details: null,
            credentials: null,
            owners: null,
        }),
}));
