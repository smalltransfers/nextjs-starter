import { SessionOptions } from "iron-session";

// TODO: Set the IRON_SESSION_PASSWORD environment variable.
const IRON_SESSION_PASSWORD = process.env.IRON_SESSION_PASSWORD || "PLACEHOLDER_IRON_SESSION_PASSWORD";

export const IRON_SESSION_OPTIONS: SessionOptions = {
    cookieName: "smalltransfers-nextjs-starter.session",
    password: IRON_SESSION_PASSWORD,
    cookieOptions: {
        httpOnly: true,
        maxAge: 290 * 24 * 60 * 60, // 290 days
        sameSite: "strict",
        secure: true,
    },
};

interface UserSessionData {
    readonly email: string;
    readonly accessToken: string;
}

declare module "iron-session" {
    interface SessionData {
        user?: UserSessionData;
    }
}
