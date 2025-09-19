import { Metadata } from "next";
import Link from "next/link";
import { JSX } from "react";

import styles from "@/app/page.module.css";

export const metadata: Metadata = {
    title: "Error | Small Transfers",
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
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                gap: "24px",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <div>{message ?? "An error occurred."}</div>
            <div className={styles.ctas}>
                <Link className={styles.secondary} href="/">
                    Home
                </Link>
            </div>
        </div>
    );
}
