import { useStore } from "@/lib/store/Store";

export function useCurrentUserEmail(): string | null | undefined {
    return useStore((state) => state.currentUserEmail);
}

export function useSetCurrentUserEmail(): (currentUserEmail: null | string) => void {
    return useStore((state) => state.setCurrentUserEmail);
}