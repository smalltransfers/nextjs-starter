"use client";

import Image from "next/image";
import { JSX } from "react";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { SMALL_TRANSFERS_BASE_URL } from "@/lib/constants";
import smallTransfersIcon from "@/public/smalltransfers.svg";

interface Props {
    readonly baseUrl: string;
}

export default function SignInButton(props: Props): JSX.Element {
    const { baseUrl } = props;

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

    return (
        <Button onClick={signIn}>
            <Image src={smallTransfersIcon} alt="Small Transfers logo" width={20} height={20} />
            Sign in with Small Transfers
        </Button>
    );
}
