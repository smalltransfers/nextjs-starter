import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface Store {
    currentUserEmail: undefined | null | string;
    setCurrentUserEmail: (currentUserEmail: null | string) => void;
    isSigningOut: boolean;
    setIsSigningOut: (isSigningOut: boolean) => void;
}

export const useStore = create<Store>()(
    immer((set) => ({
        currentUserEmail: undefined,
        setCurrentUserEmail: (currentUserEmail) => set({ currentUserEmail }),
        isSigningOut: false,
        setIsSigningOut: (isSigningOut) => set({ isSigningOut }),
    })),
);
