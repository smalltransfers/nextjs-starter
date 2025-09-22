import { headers } from "next/headers";

export async function getBaseUrl(): Promise<string> {
    const headersList = await headers();
    const protocol = headersList.get("x-forwarded-proto");
    const host = headersList.get("x-forwarded-host");
    if (protocol === null || host === null) {
        throw new Error("Unable to determine the base URL.");
    }
    return `${protocol}://${host}`;
}
