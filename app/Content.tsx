"use client";

import Image from "next/image";
import { JSX, useEffect, useState } from "react";
import { toast } from "react-toastify";

import styles from "@/app/page.module.css";
import { SMALL_TRANSFERS_BASE_URL } from "@/lib/constants";
import { getResponseErrorString } from "@/lib/utils";

interface Props {
    readonly baseUrl: string;
}

export default function Content(props: Props): JSX.Element {
    const { baseUrl } = props;
    const [currentUserEmail, setCurrentUserEmail] = useState<undefined | null | string>(undefined);
    const [isMakingPaidRequest, setIsMakingPaidRequest] = useState(false);
    const [isSigningOut, setIsSigningOut] = useState(false);

    useEffect(() => {
        async function getCurrentUser() {
            const response = await fetch("/api/users/me");
            const userEmail = await response.json();
            setCurrentUserEmail(userEmail);
        }

        getCurrentUser();
    }, []);

    function signIn(): void {
        const publishableKey = process.env.NEXT_PUBLIC_SMALL_TRANSFERS_PUBLISHABLE_KEY;
        if (publishableKey === undefined) {
            toast.error("Publishable key not specified in environment variables.");
            return;
        }
        const params = new URLSearchParams({
            publishable_key: publishableKey,
            redirect_uri: `${baseUrl}/oauth/callback`,
            response_type: "code",
            scope: "add-charge",
        });
        const url = `${SMALL_TRANSFERS_BASE_URL}/customer/authorize?${params}`;
        window.location.href = url;
    }

    function getPublishableKeyInfo(): JSX.Element | null {
        if (process.env.NEXT_PUBLIC_SMALL_TRANSFERS_PUBLISHABLE_KEY === undefined) {
            return null;
        }
        const mode = process.env.NEXT_PUBLIC_SMALL_TRANSFERS_PUBLISHABLE_KEY.startsWith("pk_live_") ? "live" : "test";
        return (
            <>
                You are using a <b>{mode}</b> publishable key, so the paid request will charge a <b>{mode}</b> customer.
            </>
        );
    }

    async function makePaidRequest(): Promise<void> {
        setIsMakingPaidRequest(true);
        const response = await fetch("/api/paid-requests", {
            method: "POST",
        });
        if (response.ok) {
            const { capturedMicros } = await response.json();
            toast.success(`Successfully charged ${capturedMicros / 1_000_000} USD.`);
        } else {
            const error = await getResponseErrorString(response);
            toast.error(`Failed to make a paid request: ${error}`);
        }
        setIsMakingPaidRequest(false);
    }

    async function signOut(): Promise<void> {
        setIsSigningOut(true);
        const response = await fetch("/api/users/me", {
            method: "DELETE",
        });
        if (response.ok) {
            setCurrentUserEmail(null);
        } else {
            const error = await getResponseErrorString(response);
            toast.error(`Failed to sign out: ${error}`);
        }
        setIsSigningOut(false);
    }

    const disabled = isMakingPaidRequest || isSigningOut;

    if (currentUserEmail === undefined) {
        return <div>Loading...</div>;
    }

    if (currentUserEmail === null) {
        return (
            <div className={styles.ctas}>
                <button onClick={signIn} className={styles.primary}>
                    <Image
                        className={styles["logo-invert-on-dark-theme"]}
                        src="/smalltransfers.svg"
                        alt="Small Transfers logo"
                        width={20}
                        height={20}
                    />
                    Sign in with Small Transfers
                </button>
            </div>
        );
    }

    return (
        <>
            <div style={{ textAlign: "center" }}>
                Signed in as{" "}
                <a
                    href={`${SMALL_TRANSFERS_BASE_URL}/customer/sign-in/${currentUserEmail}`}
                    target="_blank"
                    rel="noopener"
                    className={styles.email}
                >
                    {currentUserEmail}
                </a>
                .
            </div>
            <div className={styles.ctas}>
                <button onClick={makePaidRequest} disabled={disabled} className={styles.primary}>
                    {isMakingPaidRequest ? "Making a paid request..." : "Make a paid request"}
                </button>
                <button onClick={signOut} disabled={disabled} className={styles.secondary}>
                    {isSigningOut ? "Signing out..." : "Sign out"}
                </button>
            </div>
            <div
                style={{
                    textAlign: "center",
                    maxWidth: "330px",
                    margin: "0 auto",
                }}
            >
                {getPublishableKeyInfo()}
            </div>
        </>
    );
}
