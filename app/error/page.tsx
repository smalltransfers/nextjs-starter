import { Metadata } from "next";
import styles from "../page.module.css";

export const metadata: Metadata = {
  title: "Error | Small Transfers",
  description: "An error occurred.",
};

interface Props {
  readonly searchParams: Promise<{
    readonly message?: string;
  }>;
}

export default async function ErrorPage(props: Props) {
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
        <a className={styles.secondary} href="/">
          Home
        </a>
      </div>
    </div>
  );
}
