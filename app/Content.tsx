"use client";

import { Loader2Icon } from "lucide-react";
import { JSX, useEffect, useState } from "react";
import { toast } from "react-toastify";

import SignInButton from "@/components/SignInButton";
import { Button } from "@/components/ui/button";
import { getResponseErrorString } from "@/lib/utils";

interface Props {
    readonly baseUrl: string;
}

export default function Content(props: Props): JSX.Element {
    const { baseUrl } = props;
    const [currentUserEmail, setCurrentUserEmail] = useState<undefined | null | string>(undefined);
    const [isMakingPaidRequest, setIsMakingPaidRequest] = useState(false);

    useEffect(() => {
        async function getCurrentUser() {
            const response = await fetch("/api/users/me");
            const userEmail = await response.json();
            setCurrentUserEmail(userEmail);
        }

        getCurrentUser();
    }, []);

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

    if (currentUserEmail === undefined) {
        return (
            <div className="flex flex-col items-center gap-2">
                <p className="text-2xl">Loading...</p>
                <Loader2Icon className="animate-spin" />
            </div>
        );
    }

    if (currentUserEmail === null) {
        return <SignInButton baseUrl={baseUrl} />;
    }

    return (
        <div className="flex w-full max-w-md flex-col items-center gap-6">
            <Button onClick={makePaidRequest} disabled={isMakingPaidRequest}>
                {isMakingPaidRequest ? (
                    <>
                        <Loader2Icon className="animate-spin" />
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
