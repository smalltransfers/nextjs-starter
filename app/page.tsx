import { JSX } from "react";

import Content from "@/app/Content";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { getBaseUrl } from "@/lib/basePath";

export default async function Home(): Promise<JSX.Element> {
    const baseUrl = await getBaseUrl();

    return (
        <div className="flex h-screen flex-col">
            <Header />
            <div className="flex min-h-0 w-full flex-1 flex-col items-center justify-center px-2">
                <Content baseUrl={baseUrl} />
            </div>
            <Footer />
        </div>
    );
}
