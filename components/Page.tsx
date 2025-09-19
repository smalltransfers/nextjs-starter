import { JSX, ReactNode } from "react";

import Footer from "@/components/Footer";
import Header from "@/components/Header";

interface Props {
    readonly children: ReactNode;
}

export default function Page(props: Props): JSX.Element {
    const { children } = props;

    return (
        <div className="flex h-screen flex-col">
            <Header />
            <div className="flex min-h-0 w-full flex-1 flex-col items-center justify-center px-2">{children}</div>
            <Footer />
        </div>
    );
}
