"use client";

import { Loader2 } from "lucide-react";
import { JSX, useEffect, useState } from "react";
import { toast } from "sonner";

import SignInButton from "@/components/SignInButton";
import { Button } from "@/components/ui/button";
import { getUser, makePaidRequest } from "@/lib/api";
import { useCurrentUserEmail, useIsSigningOut, useSetCurrentUserEmail } from "@/lib/store/hooks";
import { useIsHydrated } from "@/lib/useIsHydrated";

export default function Content(): JSX.Element {
    const isHydrated = useIsHydrated();
    const currentUserEmail = useCurrentUserEmail();
    const setCurrentUserEmail = useSetCurrentUserEmail();
    const isSigningOut = useIsSigningOut();
    const [isMakingPaidRequest, setIsMakingPaidRequest] = useState(false);

    useEffect(() => {
        async function getCurrentUser(): Promise<void> {
            const result = await getUser();
            if (result.ok) {
                setCurrentUserEmail(result.value);
            } else {
                toast.error(result.error);
            }
        }

        getCurrentUser();
    }, [setCurrentUserEmail]);

    function getPublishableKeyInfo(): JSX.Element | null {
        if (process.env.NEXT_PUBLIC_SMALL_TRANSFERS_PUBLISHABLE_KEY === undefined) {
            return null;
        }
        const mode = process.env.NEXT_PUBLIC_SMALL_TRANSFERS_PUBLISHABLE_KEY.startsWith("pk_live_") ? "live" : "test";
        return (
            <p className="text-muted-foreground max-w-xs text-center text-sm">
                You are using a <b>{mode}</b> publishable key, so the paid request will charge a <b>{mode}</b> customer.
            </p>
        );
    }

    async function handleMakePaidRequest(): Promise<void> {
        setIsMakingPaidRequest(true);
        const result = await makePaidRequest();
        if (result.ok) {
            toast.success(`Successfully charged ${result.value / 1_000_000} USD.`);
        } else {
            toast.error(result.error);
        }
        setIsMakingPaidRequest(false);
    }

    const disabled = !isHydrated || isMakingPaidRequest || isSigningOut;

    if (currentUserEmail === undefined) {
        return (
            <div className="flex items-center gap-2">
                <Loader2 className="animate-spin" />
                <p className="text-2xl">Loading...</p>
            </div>
        );
    }

    if (currentUserEmail === null) {
        return <SignInButton />;
    }

    return (
        <div className="flex w-full max-w-md flex-col items-center gap-6">
            <Button onClick={handleMakePaidRequest} disabled={disabled}>
                {isMakingPaidRequest ? (
                    <>
                        <Loader2 className="animate-spin" />
                        Making a paid request...
                    </>
                ) : (
                    "Make a paid request"
                )}
            </Button>

            {getPublishableKeyInfo()}
        </div>
    );
}
