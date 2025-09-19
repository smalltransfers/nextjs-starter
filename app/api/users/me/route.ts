import { getIronSession, SessionData } from "iron-session";
import { cookies } from "next/headers";

import { IRON_SESSION_OPTIONS } from "@/lib/ironSession";
import { handleApiError } from "@/lib/utils";

export async function GET(): Promise<Response> {
    let response: Response;
    try {
        const session = await getIronSession<SessionData>(await cookies(), IRON_SESSION_OPTIONS);
        const user = session.user;
        response = Response.json(user?.email ?? null);
    } catch (error: unknown) {
        response = await handleApiError(error);
    }
    response.headers.set("Cache-Control", "no-store, max-age=0");
    return response;
}

export async function DELETE(): Promise<Response> {
    try {
        const session = await getIronSession<SessionData>(await cookies(), IRON_SESSION_OPTIONS);
        session.user = undefined;
        await session.save();
        return Response.json({});
    } catch (error: unknown) {
        return handleApiError(error);
    }
}
