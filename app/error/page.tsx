import { Metadata } from "next";
import Link from "next/link";
import { JSX } from "react";

import Page from "@/components/Page";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
    title: "Error | NextJS Starter | Small Transfers",
    description: "An error occurred.",
};

interface Props {
    readonly searchParams: Promise<{
        readonly message?: string;
    }>;
}

export default async function ErrorPage(props: Props): Promise<JSX.Element> {
    const { searchParams } = props;
    const { message } = await searchParams;

    return (
        <Page>
            <div className="flex flex-col items-center gap-4">
                <div className="text-2xl font-bold">Error</div>
                <div className="text-sm">{message ?? "An unexpected error occurred."}</div>
                <div>
                    <Button asChild variant="outline" size="sm">
                        <Link href="/">Home</Link>
                    </Button>
                </div>
            </div>
        </Page>
    );
}
