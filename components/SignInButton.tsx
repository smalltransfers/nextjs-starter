"use client";

import Image from "next/image";
import { JSX, useState } from "react";
import { toast } from "react-toastify";

import { useBaseUrl } from "@/components/BaseUrlProvider";
import { Button } from "@/components/ui/button";
import { SMALL_TRANSFERS_BASE_URL } from "@/lib/constants";
import { useIsHydrated } from "@/lib/useIsHydrated";
import smallTransfersIcon from "@/public/smalltransfers.svg";

export default function SignInButton(): JSX.Element {
    const baseUrl = useBaseUrl();
    const isHydrated = useIsHydrated();
    const [isSigningIn, setIsSigningIn] = useState(false);

    function signIn(): void {
        setIsSigningIn(true);
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

    const disabled = !isHydrated || isSigningIn;

    return (
        <Button onClick={signIn} disabled={disabled}>
            <Image
                src={smallTransfersIcon}
                alt="Small Transfers logo"
                width={20}
                height={20}
                className={isSigningIn ? "animate-spin" : undefined}
            />
            Sign in with Small Transfers
        </Button>
    );
}
