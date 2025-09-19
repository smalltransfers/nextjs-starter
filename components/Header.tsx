"use client";

import { Loader2Icon, LogOut } from "lucide-react";
import { JSX } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/api";
import { SMALL_TRANSFERS_BASE_URL } from "@/lib/constants";
import { useCurrentUserEmail, useIsSigningOut, useSetCurrentUserEmail, useSetIsSigningOut } from "@/lib/store/hooks";
import { useIsHydrated } from "@/lib/useIsHydrated";

export default function Header(): JSX.Element | false {
    const isHydrated = useIsHydrated();
    const currentUserEmail = useCurrentUserEmail();
    const setCurrentUserEmail = useSetCurrentUserEmail();
    const setIsSigningOut = useSetIsSigningOut();
    const isSigningOut = useIsSigningOut();

    async function handleSignOut(): Promise<void> {
        setIsSigningOut(true);
        const result = await signOut();
        if (result.ok) {
            setCurrentUserEmail(null);
        } else {
            toast.error(result.error);
        }
        setIsSigningOut(false);
    }

    const disabled = !isHydrated || isSigningOut;

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
                        onClick={handleSignOut}
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
