import Image from "next/image";
import { StaticImageData } from "next/image";
import { JSX } from "react";

import githubIcon from "@/public/github.svg";
import smallTransfersIcon from "@/public/smalltransfers.svg";
import vercelIcon from "@/public/vercel.svg";

export default function Footer(): JSX.Element {
    return (
        <footer className="flex items-center justify-center gap-6 bg-black py-2 text-sm text-white">
            <FooterLink
                href="https://smalltransfers.com"
                caption="Small Transfers"
                src={smallTransfersIcon}
                alt="Small Transfers logo"
            />
            <FooterLink
                href="https://github.com/smalltransfers/nextjs-starter"
                caption="GitHub"
                src={githubIcon}
                alt="GitHub logo"
            />
            <FooterLink
                href="https://vercel.com/new"
                rel="noopener noreferrer nofollow"
                caption="Deploy now"
                src={vercelIcon}
                alt="Vercel logomark"
            />
        </footer>
    );
}

interface FooterLinkProps {
    readonly href: string;
    readonly rel?: string;
    readonly caption: string;
    readonly src: StaticImageData;
    readonly alt: string;
}

function FooterLink(props: FooterLinkProps): JSX.Element {
    const { href, rel = "noopener", caption, src, alt } = props;

    return (
        <a href={href} target="_blank" rel={rel} className="flex items-center gap-2">
            <Image src={src} alt={alt} height={18} />
            <span className="hidden sm:inline">{caption}</span>
        </a>
    );
}
