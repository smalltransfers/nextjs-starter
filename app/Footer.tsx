import styles from "@/app/page.module.css";
import Image from "next/image";
import { JSX } from "react";

export default function Footer(): JSX.Element {
    return (
        <div className={styles.footer}>
            <FooterLink
                href="https://smalltransfers.com"
                caption="Small Transfers"
                imageSrc="/smalltransfers.svg"
                imageAlt="Small Transfers logo"
            />
            <FooterLink
                href="https://github.com/smalltransfers/nextjs-starter"
                caption="GitHub"
                imageSrc="/github.svg"
                imageAlt="GitHub logo"
            />
            <FooterLink
                href="https://vercel.com/new"
                rel="noopener noreferrer nofollow"
                caption="Deploy now"
                imageSrc="/vercel.svg"
                imageAlt="Vercel logomark"
            />
        </div>
    );
}

interface FooterLinkProps {
    readonly href: string;
    readonly rel?: string;
    readonly caption: string;
    readonly imageSrc: string;
    readonly imageAlt: string;
}

function FooterLink(props: FooterLinkProps): JSX.Element {
    const { href, rel = "noopener", caption, imageSrc, imageAlt } = props;

    return (
        <a href={href} target="_blank" rel={rel}>
            <Image
                src={imageSrc}
                alt={imageAlt}
                className={styles["logo-invert-on-light-theme"]}
                width={20}
                height={20}
            />
            {caption}
        </a>
    );
}
