"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, CheckCircle, Loader2 } from "lucide-react";
import {
  useRequestVerificationMutation,
  useVerifyProfileMutation,
} from "@/lib/api/services/user/user.service";
import { toast } from "sonner";

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerificationSuccess: () => void;
  userEmail: string;
}

export function VerificationModal({
  isOpen,
  onClose,
  onVerificationSuccess,
  userEmail,
}: VerificationModalProps) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  // RTK Query mutations
  const [requestVerification, { isLoading: isRequestLoading }] =
    useRequestVerificationMutation();
  const [verifyProfile, { isLoading: isVerifyLoading }] =
    useVerifyProfileMutation();

  const isLoading = isRequestLoading || isVerifyLoading;

  // Automatically start verification when modal opens
  useEffect(() => {
    if (isOpen && userEmail) {
      handleSendOTP();
    }
  }, [isOpen, userEmail]);

  const handleSendOTP = async () => {
    setError("");
    setOtp(""); // Clear OTP input field when resending

    try {
      await requestVerification().unwrap();
      toast.success("Verification code sent to your email!");
    } catch (err) {
      console.error("Failed to request verification:", err);
      const errorMessage =
        (err as any)?.data?.message ||
        "Failed to send verification code. Please try again.";
      setError(errorMessage);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setError("");

    try {
      await verifyProfile({ otp, email: userEmail }).unwrap();
      toast.success("Account verified successfully!");
      onVerificationSuccess();
      handleClose();
    } catch (err) {
      console.error("Failed to verify profile:", err);
      const errorMessage =
        (err as any)?.data?.message ||
        "Invalid verification code. Please try again.";
      setError(errorMessage);
    }
  };

  const handleClose = () => {
    setOtp("");
    setError("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Account Verification
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              {isRequestLoading ? (
                <Loader2 className="h-6 w-6 text-green-600 animate-spin" />
              ) : (
                <CheckCircle className="h-6 w-6 text-green-600" />
              )}
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {isRequestLoading ? "Sending Verification Code" : "Enter Verification Code"}
            </h3>
            <p className="text-slate-600 text-sm">
              {isRequestLoading 
                ? "Please wait while we send a verification code to your email..."
                : `We've sent a 6-digit code to ${userEmail}`
              }
            </p>
          </div>

          {!isRequestLoading && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">Verification Code</Label>
                <Input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  placeholder="Enter 6-digit code"
                  className="w-full text-center text-lg tracking-widest"
                  maxLength={6}
                  disabled={isVerifyLoading}
                />
              </div>

              {error && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                  {error}
                </div>
              )}

              <div className="text-center">
                <button
                  onClick={handleSendOTP}
                  className="text-sm text-primary hover:underline"
                  disabled={isLoading}
                >
                  Didn't receive the code? Resend
                </button>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1 bg-transparent"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleVerifyOTP}
                  disabled={isLoading || otp.length !== 6}
                  className="flex-1"
                >
                  {isLoading ? "Verifying..." : "Verify"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
