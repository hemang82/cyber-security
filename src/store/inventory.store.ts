import { TAB_KEY } from "@/common/commonVariable";
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
    finel_validate_data: InventoryType | null;
    active_tab: string | TAB_KEY.ASSETS_TYPE | TAB_KEY.ASSETS_DETAILS | TAB_KEY.CREDENTIALS | TAB_KEY.OWNERS | TAB_KEY.PREVIEW;
    // actions
    setAssetsType: (data: InventoryType) => void;
    setAssetsDetails: (data: InventoryType) => void;
    setCredentials: (data: InventoryType) => void;
    setOwners: (data: InventoryType) => void;
    setFinelValidateData: (data: InventoryType) => void;
    setActiveTab: (data: string) => void;

    resetInventory: () => void;
}

export const useInventoryStore = create<InventoryState>((set) => ({

    assets_type: null,
    assets_details: null,
    credentials: null,
    owners: null,
    finel_validate_data: null,
    active_tab: TAB_KEY.ASSETS_TYPE,

    setAssetsType: (data) =>
        set({ assets_type: data }),

    setAssetsDetails: (data) =>
        set({ assets_details: data }),

    setCredentials: (data) =>
        set({ credentials: data }),

    setOwners: (data) =>
        set({ owners: data }),

    setFinelValidateData: (data) =>
        set({ finel_validate_data: data }),

    setActiveTab: (data) =>
        set({ active_tab: data }),

    resetInventory: () =>
        set({
            assets_type: null,
            assets_details: null,
            credentials: null,
            owners: null,
            finel_validate_data: null,
        }),
}));
