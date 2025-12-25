"use client";

import { useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { exchangeCodeForToken } from "@/lib/stravaApi";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const hasCalledExchange = useRef(false);

  useEffect(() => {
    // Handle authorization denial
    if (error) {
      console.error("Strava Auth Error:", error);
      router.push("/?error=auth_denied");
      return;
    }

    // Handle successful authorization code
    if (code && !hasCalledExchange.current) {
      hasCalledExchange.current = true;
      
      exchangeCodeForToken(code)
        .then(() => {
          // Successfully exchanged code for token
          router.push("/dashboard");
        })
        .catch((err) => {
          console.error("Token Exchange Error:", err);
          // Provide more specific error info if available
          const errorMessage = err?.message || "auth_failed";
          router.push(`/?error=${errorMessage}`);
        });
    } else if (!code && !error) {
      // No code and no error - shouldn't happen, redirect home
      console.warn("Auth callback called without code or error");
      router.push("/");
    }
  }, [code, error, router]);

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#101418] text-white">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#fc4c02] mb-4"></div>
      <p className="text-lg font-medium text-slate-400">
        {error ? "Authorization failed..." : "Connecting to Strava..."}
      </p>
      {error && (
        <p className="text-sm text-slate-500 mt-2">
          Redirecting you back...
        </p>
      )}
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense
      fallback={
        <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#101418] text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#fc4c02] mb-4"></div>
          <p className="text-lg font-medium text-slate-400">Loading...</p>
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}