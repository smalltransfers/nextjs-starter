import { SessionOptions } from "iron-session";

import { Email } from "@/lib/types";

const IRON_SESSION_PASSWORD = process.env.IRON_SESSION_PASSWORD;
if (IRON_SESSION_PASSWORD === undefined || IRON_SESSION_PASSWORD === "") {
    throw new Error("IRON_SESSION_PASSWORD is not set.");
}

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
    readonly email: Email;
    readonly accessToken: string;
}

declare module "iron-session" {
    interface SessionData {
        user?: UserSessionData;
    }
}
