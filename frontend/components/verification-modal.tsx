"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, Shield, CheckCircle, ArrowLeft } from "lucide-react"

interface VerificationModalProps {
  isOpen: boolean
  onClose: () => void
  onVerificationSuccess: () => void
  userEmail: string
}

export function VerificationModal({ isOpen, onClose, onVerificationSuccess, userEmail }: VerificationModalProps) {
  const [step, setStep] = useState<"email" | "otp">("email")
  const [email, setEmail] = useState(userEmail)
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSendOTP = async () => {
    if (!email) {
      setError("Please enter your email address")
      return
    }

    setIsLoading(true)
    setError("")

    // Simulate API call to send OTP
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setStep("otp")
    } catch (err) {
      setError("Failed to send OTP. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP")
      return
    }

    setIsLoading(true)
    setError("")

    // Simulate API call to verify OTP
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      onVerificationSuccess()
      handleClose()
    } catch (err) {
      setError("Invalid OTP. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setStep("email")
    setOtp("")
    setError("")
    onClose()
  }

  const handleBackToEmail = () => {
    setStep("email")
    setOtp("")
    setError("")
  }

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
          {step === "email" ? (
            <>
              <div className="text-center">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Verify Your Email</h3>
                <p className="text-slate-600 text-sm">
                  We'll send a verification code to your email address to confirm your identity.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="verification-email">Email Address</Label>
                  <Input
                    id="verification-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full"
                  />
                </div>

                {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>}

                <div className="flex gap-3">
                  <Button variant="outline" onClick={handleClose} className="flex-1 bg-transparent">
                    Cancel
                  </Button>
                  <Button onClick={handleSendOTP} disabled={isLoading} className="flex-1">
                    {isLoading ? "Sending..." : "Send OTP"}
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="text-center">
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Enter Verification Code</h3>
                <p className="text-slate-600 text-sm">
                  We've sent a 6-digit code to <span className="font-medium">{email}</span>
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">Verification Code</Label>
                  <Input
                    id="otp"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="Enter 6-digit code"
                    className="w-full text-center text-lg tracking-widest"
                    maxLength={6}
                  />
                </div>

                {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>}

                <div className="text-center">
                  <button onClick={handleSendOTP} className="text-sm text-primary hover:underline" disabled={isLoading}>
                    Didn't receive the code? Resend
                  </button>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={handleBackToEmail} className="flex-1 bg-transparent">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                  <Button onClick={handleVerifyOTP} disabled={isLoading || otp.length !== 6} className="flex-1">
                    {isLoading ? "Verifying..." : "Verify"}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
