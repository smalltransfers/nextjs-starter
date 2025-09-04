"use client";

import { toast } from "react-toastify";
import styles from "./page.module.css";
import { JSX, useEffect, useState } from "react";
import { getResponseErrorString } from "@/lib/utils";
import Image from "next/image";
import { SMALL_TRANSFERS_BASE_URL } from "@/lib/constants";

export default function Home() {
  const [currentUserEmail, setCurrentUserEmail] = useState<
    undefined | null | string
  >(undefined);
  const [isMakingPaidRequest, setIsMakingPaidRequest] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    async function getCurrentUser() {
      const response = await fetch("/api/users/me");
      const userEmail = await response.json();
      setCurrentUserEmail(userEmail);
    }

    getCurrentUser();
  }, []);

  function signIn() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const publishableKey =
      process.env.NEXT_PUBLIC_SMALL_TRANSFERS_PUBLISHABLE_KEY;
    if (publishableKey === undefined) {
      toast.error("Publishable key not specified in environment variables.");
      return;
    }
    const params = new URLSearchParams({
      publishable_key: publishableKey,
      redirect_uri: `${baseUrl}/oauth/callback`,
      response_type: "code",
      scope: "add-charge",
    });
    const url = `${SMALL_TRANSFERS_BASE_URL}/customer/authorize?${params}`;
    window.location.href = url;
  }

  function getPublishableKeyInfo(): JSX.Element | null {
    if (process.env.NEXT_PUBLIC_SMALL_TRANSFERS_PUBLISHABLE_KEY === undefined) {
      return null;
    }
    const mode =
      process.env.NEXT_PUBLIC_SMALL_TRANSFERS_PUBLISHABLE_KEY.startsWith(
        "pk_live_"
      )
        ? "live"
        : "test";
    return (
      <>
        You are using a <b>{mode}</b> publishable key, so the paid request will
        charge a <b>{mode}</b> customer.
      </>
    );
  }

  async function makePaidRequest() {
    setIsMakingPaidRequest(true);
    const response = await fetch("/api/paid-requests", {
      method: "POST",
    });
    if (response.ok) {
      toast.success("Paid request made successfully.");
    } else {
      const error = await getResponseErrorString(response);
      toast.error(`Failed to make a paid request: ${error}`);
    }
    setIsMakingPaidRequest(false);
  }

  async function signOut() {
    setIsSigningOut(true);
    const response = await fetch("/api/users/me", {
      method: "DELETE",
    });
    if (response.ok) {
      setCurrentUserEmail(null);
    } else {
      const error = await getResponseErrorString(response);
      toast.error(`Failed to sign out: ${error}`);
    }
    setIsSigningOut(false);
  }

  let disabled = isMakingPaidRequest || isSigningOut;

  let content = null;
  if (currentUserEmail === undefined) {
    content = <div>Loading...</div>;
  } else if (currentUserEmail === null) {
    content = (
      <div className={styles.ctas}>
        <button onClick={signIn} className={styles.primary}>
          <Image
            className={styles["logo-invert-on-dark-theme"]}
            src="/smalltransfers.svg"
            alt="Small Transfers logo"
            width={20}
            height={20}
          />
          Sign in with Small Transfers
        </button>
      </div>
    );
  } else {
    content = (
      <>
        <div style={{ textAlign: "center" }}>
          Signed in as {currentUserEmail}.
        </div>
        <div className={styles.ctas}>
          <button
            onClick={makePaidRequest}
            disabled={disabled}
            className={styles.primary}
          >
            {isMakingPaidRequest
              ? "Making a paid request..."
              : "Make a paid request"}
          </button>
          <button
            onClick={signOut}
            disabled={disabled}
            className={styles.secondary}
          >
            {isSigningOut ? "Signing out..." : "Sign out"}
          </button>
        </div>
        <div
          style={{
            textAlign: "center",
            maxWidth: "330px",
            margin: "0 auto",
          }}
        >
          {getPublishableKeyInfo()}
        </div>
      </>
    );
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>{content}</main>
      <div className={styles.footer}>
        <a href="https://smalltransfers.com" target="_blank" rel="noopener">
          <Image
            src="/smalltransfers.svg"
            alt="Small Transfers logo"
            width={20}
            height={20}
          />
          Small Transfers
        </a>
        <a
          href="https://vercel.com/new"
          target="_blank"
          rel="noopener noreferrer nofollow"
        >
          <Image
            className={styles["logo-invert-on-light-theme"]}
            src="/vercel.svg"
            alt="Vercel logomark"
            width={20}
            height={20}
          />
          Deploy now
        </a>
      </div>
    </div>
  );
}
