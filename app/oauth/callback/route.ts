import { SMALL_TRANSFERS_API_BASE_URL } from "@/lib/constants";
import { IRON_SESSION_OPTIONS } from "@/lib/ironSession";
import { getErrorString } from "@/lib/utils";
import { getIronSession, SessionData } from "iron-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// We ensure no caching via this config.
export const dynamic = "force-dynamic";
export const revalidate = 0;

interface CustomerInfo {
    readonly id: string;
    readonly firstName: string;
    readonly lastName: string;
    readonly email: string;
}

interface GetTokensResponseBody {
    readonly accessToken: string;
    readonly tokenType: string;
    readonly scope: string;
    readonly customer: CustomerInfo;
}

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
            throw new Error(`Authorization failed: ${error}`);
        }

        const code = searchParams.get("code");
        if (code === null) {
            throw new Error("Authorization code not found in URL parameters.");
        }

        const publishableKey = process.env.NEXT_PUBLIC_SMALL_TRANSFERS_PUBLISHABLE_KEY;
        if (publishableKey === undefined) {
            throw new Error("Publishable key not specified in environment variables.");
        }

        const secretKey = process.env.SMALL_TRANSFERS_SECRET_KEY;
        if (secretKey === undefined) {
            throw new Error("Secret key not specified in environment variables.");
        }

        // Exchange the authorization code for an access token.
        const url = `${SMALL_TRANSFERS_API_BASE_URL}/oauth/tokens`;
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                grantType: "authorization_code",
                authorizationCode: code,
                publishableKey,
                secretKey,
            }),
        };
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(
                `Failed to exchange authorization code for access token: ${response.statusText} (${response.status})`,
            );
        }
        const data = (await response.json()) as GetTokensResponseBody;

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
