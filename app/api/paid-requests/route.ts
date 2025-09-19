import { getIronSession, SessionData } from "iron-session";
import { cookies } from "next/headers";

import { SMALL_TRANSFERS_API_BASE_URL } from "@/lib/constants";
import { IRON_SESSION_OPTIONS } from "@/lib/ironSession";
import { getErrorString } from "@/lib/utils";

interface AuthorizeChargeResponse {
    readonly id: string;
}

export async function POST(_request: Request): Promise<Response> {
    try {
        // Get the access token from the signed-in user.
        const session = await getIronSession<SessionData>(await cookies(), IRON_SESSION_OPTIONS);
        if (session.user === undefined) {
            throw new Error("You are not signed in.");
        }
        const accessToken = session.user.accessToken;

        // Get the publishable key from the environment variables.
        const publishableKey = process.env.NEXT_PUBLIC_SMALL_TRANSFERS_PUBLISHABLE_KEY;
        if (publishableKey === undefined) {
            throw new Error("Publishable key not specified in environment variables.");
        }

        // Get the secret key from the environment variables.
        const secretKey = process.env.SMALL_TRANSFERS_SECRET_KEY;
        if (secretKey === undefined) {
            throw new Error("Secret key not specified in environment variables.");
        }

        // Authorize a charge.
        const url = `${SMALL_TRANSFERS_API_BASE_URL}/charges`;
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                publishableKey: publishableKey,
                secretKey: secretKey,
                accessToken: accessToken,
                currency: "usd",
                amountMicros: 20_000, // 0.02 USD
            }),
        };
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`Failed to authorize a charge: ${response.statusText} (${response.status})`);
        }
        const data = (await response.json()) as AuthorizeChargeResponse;
        const chargeId = data.id;

        // TODO: Perform business logic.

        // Capture the charge.
        const capturedMicros = 10_000; // 0.01 USD
        const captureUrl = `${SMALL_TRANSFERS_API_BASE_URL}/charges/${chargeId}/capture`;
        const captureOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                publishableKey: publishableKey,
                secretKey: secretKey,
                accessToken: accessToken,
                amountMicros: capturedMicros,
            }),
        };
        const captureResponse = await fetch(captureUrl, captureOptions);
        if (!captureResponse.ok) {
            throw new Error(`Failed to capture a charge: ${captureResponse.statusText} (${captureResponse.status})`);
        }

        return Response.json({ capturedMicros });
    } catch (error: unknown) {
        return Response.json({ error: getErrorString(error) }, { status: 500 });
    }
}
