"use client";

import { createContext, JSX, ReactNode, useContext } from "react";

import { Url } from "@/lib/types";

const BaseUrlContext = createContext<Url | undefined>(undefined);

export function useBaseUrl(): Url {
    const baseUrl = useContext(BaseUrlContext);
    if (baseUrl === undefined) {
        throw new Error("useBaseUrl must be used within a <BaseUrlProvider>.");
    }
    return baseUrl;
}

interface Props {
    readonly baseUrl: Url;
    readonly children: ReactNode;
}

export default function BaseUrlProvider(props: Props): JSX.Element {
    const { baseUrl, children } = props;

    return <BaseUrlContext value={baseUrl}>{children}</BaseUrlContext>;
}
