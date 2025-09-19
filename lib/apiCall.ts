import Logger from "@/lib/logger";
import { promiseError, promiseSuccess, Result } from "@/lib/result";
import { ApiResponse } from "@/lib/types";
import { getErrorString } from "@/lib/utils";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
const METHODS_WITH_BODY: Set<HttpMethod> = new Set(["POST", "PUT", "PATCH"]);

async function handleResponse<ResponsePayload>(response: Response): Promise<Result<ResponsePayload>> {
    try {
        const data = (await response.json()) as ApiResponse<ResponsePayload>;
        if (typeof data === "object" && data !== null && "error" in data) {
            // In rare cases, the platform itself might return an error (e.g. due to a route timeout).
            // Due to this, we cannot assume that the error is always a string.
            return promiseError(getErrorString(data.error));
        }
        if (!response.ok) {
            return promiseError(`${response.status}: ${response.statusText}`);
        }
        return promiseSuccess(data);
    } catch (error: unknown) {
        // Handle case where response is not valid JSON (e.g., HTML error page).
        Logger.error("Unexpected error while handling response.", error);
        if (!response.ok) {
            return promiseError(`${response.status}: ${response.statusText}`);
        }
        return promiseError(`Invalid response format: ${response.status} ${response.statusText}`);
    }
}

interface CallOptions {
    readonly request?: object;
    readonly formData?: FormData;
    readonly method?: HttpMethod;
    readonly timeoutSeconds?: number;
}

export async function call<ResponsePayload>(path: string, options: CallOptions = {}): Promise<Result<ResponsePayload>> {
    const { request = {}, formData = undefined, method = "POST", timeoutSeconds = 30 } = options;
    const hasRequestBody = Object.keys(request).length > 0;
    const methodAllowsRequestBody = METHODS_WITH_BODY.has(method);
    const hasFormData = formData !== undefined;
    if (hasRequestBody && !methodAllowsRequestBody) {
        throw new Error(`Request body cannot be used with ${method} method.`);
    }
    if (hasFormData) {
        if (method !== "POST") {
            throw new Error("Form data can only be used with POST method and empty request.");
        }
        if (hasRequestBody) {
            throw new Error("Form data cannot be used with request body.");
        }
    }
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutSeconds * 1000);
    try {
        const body = hasFormData ? formData : methodAllowsRequestBody ? JSON.stringify(request) : undefined;
        const headers: HeadersInit = {
            Accept: "application/json",
        };
        if (hasRequestBody) {
            headers["Content-Type"] = "application/json";
        }
        const response = await fetch(path, {
            method,
            headers,
            body,
            cache: "no-store",
            signal: controller.signal,
        });
        clearTimeout(timeoutId);
        return handleResponse(response);
    } catch (error: unknown) {
        clearTimeout(timeoutId);
        if (error instanceof DOMException && error.message === "The user aborted a request.") {
            return promiseError("Request aborted, since it took too long.");
        } else {
            return promiseError(getErrorString(error));
        }
    }
}
