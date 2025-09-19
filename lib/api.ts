import { call } from "@/lib/apiCall";
import { Result } from "@/lib/result";
import { Micros } from "@/lib/smalltransfersTypes";
import { Email } from "@/lib/types";

export async function getUser(): Promise<Result<Email | null>> {
    return call(`/api/users/me`, { method: "GET" });
}

export async function makePaidRequest(): Promise<Result<Micros>> {
    return call(`/api/paid-requests`);
}
