import { getIronSession, SessionData } from "iron-session";
import { cookies } from "next/headers";
import StatusCode from "status-code-enum";

import { IRON_SESSION_OPTIONS } from "@/lib/ironSession";
import { SmallTransfersClient } from "@/lib/smalltransfers";
import { ApiError, Micros } from "@/lib/types";
import { handleApiError } from "@/lib/utils";

export async function POST(): Promise<Response> {
    try {
        const session = await getIronSession<SessionData>(await cookies(), IRON_SESSION_OPTIONS);
        if (session.user === undefined) {
            throw new ApiError("You are not signed in.", StatusCode.ClientErrorUnauthorized);
        }
        const accessToken = session.user.accessToken;

        const client = new SmallTransfersClient();

        const amountMicros = 20_000 as Micros; // 0.02 USD
        const chargeId = await client.authorizeCharge(accessToken, amountMicros);

        // TODO: Perform business logic.

        const capturedMicros = 10_000 as Micros; // 0.01 USD
        await client.captureCharge(accessToken, chargeId, capturedMicros);

        return Response.json(capturedMicros);
    } catch (error: unknown) {
        return handleApiError(error);
    }
}
