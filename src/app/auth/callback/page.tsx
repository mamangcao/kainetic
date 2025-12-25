"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { exchangeCodeForToken } from "@/lib/stravaApi";

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const hasCalledExchange = useRef(false);

  useEffect(() => {
    if (error) {
      console.error("Strava Auth Error:", error);
      router.push("/");
      return;
    }

    if (code && !hasCalledExchange.current) {
      hasCalledExchange.current = true;
      exchangeCodeForToken(code)
        .then(() => {
          router.push("/dashboard");
        })
        .catch((err) => {
          console.error("Token Exchange Error:", err);
          router.push("/?error=auth_failed");
        });
    } else if (!code && !hasCalledExchange.current) {
       router.push("/");
    }
  }, [code, error, router]);

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#101418] text-white">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#fc4c02] mb-4"></div>
      <p className="text-lg font-medium text-slate-400">
        Connecting to Strava...
      </p>
    </div>
  );
}
