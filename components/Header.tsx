"use client";

import { Loader2Icon, LogOut } from "lucide-react";
import { JSX, useState } from "react";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { SMALL_TRANSFERS_BASE_URL } from "@/lib/constants";
import { useCurrentUserEmail, useSetCurrentUserEmail } from "@/lib/store/hooks";
import { getResponseErrorString } from "@/lib/utils";

export default function Header(): JSX.Element | false {
    const currentUserEmail = useCurrentUserEmail();
    const setCurrentUserEmail = useSetCurrentUserEmail();
    const [isSigningOut, setIsSigningOut] = useState(false);

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

    const disabled = isSigningOut;

    if (currentUserEmail === undefined || currentUserEmail === null) {
        return false;
    }

    return (
        <header className="flex justify-center bg-black text-white">
            {currentUserEmail !== undefined && (
                <div className="flex items-center">
                    <p className="text-sm">
                        Signed in as{" "}
                        <a
                            href={`${SMALL_TRANSFERS_BASE_URL}/customer/sign-in/${currentUserEmail}`}
                            target="_blank"
                            rel="noopener"
                        >
                            {currentUserEmail}
                        </a>
                        .
                    </p>

                    <Button
                        type="submit"
                        onClick={signOut}
                        disabled={disabled}
                        variant="link"
                        size="icon"
                        className="text-muted size-8"
                    >
                        {isSigningOut ? <Loader2Icon className="animate-spin" /> : <LogOut />}
                    </Button>
                </div>
            )}
        </header>
    );
}
