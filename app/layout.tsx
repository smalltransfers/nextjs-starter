import "@/app/globals.css";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { JSX, ReactNode } from "react";
import { Toaster } from "sonner";

import BaseUrlProvider from "@/components/BaseUrlProvider";
import { getBaseUrl } from "@/lib/baseUrl";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "NextJS Starter | Small Transfers",
    description: "The NextJS Starter project for Small Transfers.",
};

interface Props {
    readonly children: ReactNode;
}

export default async function RootLayout(props: Props): Promise<JSX.Element> {
    const { children } = props;

    const baseUrl = await getBaseUrl();

    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <BaseUrlProvider baseUrl={baseUrl}>{children}</BaseUrlProvider>
                <Toaster richColors position="bottom-left" />
            </body>
        </html>
    );
}
