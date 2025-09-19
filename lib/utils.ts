import { type ClassValue, clsx } from "clsx";
import StatusCode from "status-code-enum";
import { twMerge } from "tailwind-merge";

import Logger from "@/lib/logger";
import { ApiError, ErrorResponse } from "@/lib/types";

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

async function apiError(error: string, statusCode: StatusCode): Promise<Response> {
    const data: ErrorResponse = { error };
    Logger.trace(`API error: ${error}`);
    return Response.json(data, { status: statusCode });
}

export async function handleApiError(error: unknown): Promise<Response> {
    if (error instanceof ApiError) {
        return apiError(error.message, error.statusCode);
    }
    const message = getErrorString(error);
    return apiError(message, StatusCode.ServerErrorInternal);
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
