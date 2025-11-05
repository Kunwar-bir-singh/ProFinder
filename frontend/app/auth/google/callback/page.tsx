"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { useRefreshTokenMutation } from "@/lib/hooks/hooks";
import { setAccessToken } from "@/lib/slices/authSlice";
import { toast } from "sonner";

export default function GoogleCallback() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [refreshToken] = useRefreshTokenMutation();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    const handleCallback = async () => {
      // Check for error in URL params
      const urlParams = new URLSearchParams(window.location.search);
      const error = urlParams.get("error");

      if (error) {
        console.error("Google login failed:", error);
        toast.error("Google login failed. Please try again.");
        setStatus("error");
        setTimeout(() => router.push("/login"), 2000);
        return;
      }

      try {
        // Attempt to refresh token (backend should have set httpOnly cookie)
        const result = await refreshToken().unwrap();
        if (result.data?.accessToken) {
          dispatch(setAccessToken(result.data.accessToken));
          toast.success("Successfully logged in with Google!");
          setStatus("success");
          setTimeout(() => router.push("/"), 1000);
        } else {
          toast.error("Login failed. Please try again.");
          setStatus("error");
          setTimeout(() => router.push("/login"), 2000);
        }
      } catch (err) {
        console.error("Google login callback failed:", err);
        toast.error("Login failed. Please try again.");
        setStatus("error");
        setTimeout(() => router.push("/login"), 2000);
      }
    };

    handleCallback();
  }, [refreshToken, dispatch, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        {status === "loading" && (
          <>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Completing Google login...</p>
          </>
        )}
        {status === "success" && (
          <>
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-slate-600">Login successful! Redirecting...</p>
          </>
        )}
        {status === "error" && (
          <>
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-slate-600">Login failed. Redirecting to login page...</p>
          </>
        )}
      </div>
    </div>
  );
}