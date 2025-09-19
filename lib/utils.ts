import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs));
}

export function getErrorString(error: unknown): string {
    if (typeof error === "string") {
        return error;
    }
    if (error instanceof Error) {
        return error.message;
    }
    if (typeof error === "object") {
        return JSON.stringify(error);
    }
    return `Unknown message: ${error}`;
}

export async function getResponseErrorString(response: Response): Promise<string> {
    try {
        const data = await response.json();
        if (data !== null && typeof data === "object" && "error" in data) {
            return getErrorString(data.error);
        }
        return `${response.statusText} (${response.status})`;
    } catch {
        return `${response.statusText} (${response.status})`;
    }
}
