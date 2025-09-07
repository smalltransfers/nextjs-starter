import styles from "@/app/page.module.css";
import { getBaseUrl } from "@/lib/basePath";
import Content from "@/app/Content";
import Footer from "@/app/Footer";
import { JSX } from "react";

export default async function Home(): Promise<JSX.Element> {
    const baseUrl = await getBaseUrl();

    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <Content baseUrl={baseUrl} />
            </main>
            <Footer />
        </div>
    );
}
