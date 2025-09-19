import { getIronSession, SessionData } from "iron-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import StatusCode from "status-code-enum";

import { IRON_SESSION_OPTIONS } from "@/lib/ironSession";
import { SmallTransfersClient } from "@/lib/smalltransfers";
import { ApiError } from "@/lib/types";
import { getErrorString } from "@/lib/utils";

// We ensure no caching via this config.
export const dynamic = "force-dynamic";
export const revalidate = 0;

// This is a route and not a page, because it needs to execute some simple logic and then redirect.
// It cannot be implemented as a server component, because it needs to modify the session (cookies).
// If it was implemented as a client-side API call, we introduce the double-call due to React's double-render in dev.
export async function GET(request: Request): Promise<Response> {
    const { searchParams } = new URL(request.url);

    const error = searchParams.get("error");
    if (error === "access_denied") {
        redirect("/");
    }

    try {
        if (error !== null) {
            throw new ApiError(`Authorization failed: ${error}`, StatusCode.ClientErrorUnauthorized);
        }

        const code = searchParams.get("code");
        if (code === null) {
            throw new ApiError("Authorization code not found in URL parameters.", StatusCode.ClientErrorBadRequest);
        }

        const smallTransfers = new SmallTransfersClient();
        const data = await smallTransfers.getAccessToken(code);

        // Store the access token in the session.
        const session = await getIronSession<SessionData>(await cookies(), IRON_SESSION_OPTIONS);
        session.user = {
            email: data.customer.email,
            accessToken: data.accessToken,
        };
        await session.save();
    } catch (error: unknown) {
        redirect(`/error?message=${getErrorString(error)}`);
    }

    redirect("/");
}
