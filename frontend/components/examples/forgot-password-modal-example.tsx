"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel, FieldDescription, FieldGroup } from "@/components/ui/field"
import { Loader2, ArrowLeft, CheckCircle2, Eye, EyeOff } from "lucide-react"

type ForgotPasswordStep = "email" | "verify" | "reset" | "success"

interface ForgotPasswordModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ForgotPasswordModal({ open, onOpenChange }: ForgotPasswordModalProps) {
  const [step, setStep] = useState<ForgotPasswordStep>("email")
  const [email, setEmail] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setStep("email")
      setEmail("")
      setVerificationCode("")
      setNewPassword("")
      setConfirmPassword("")
      setError("")
      setShowPassword(false)
      setShowConfirmPassword(false)
    }
    onOpenChange(newOpen)
  }

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      if (!email) {
        setError("Please enter your email address")
        return
      }

      setStep("verify")
    } catch (err) {
      setError("Failed to send verification code. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      if (!verificationCode) {
        setError("Please enter the verification code")
        return
      }

      if (verificationCode.length !== 6) {
        setError("Verification code must be 6 digits")
        return
      }

      setStep("reset")
    } catch (err) {
      setError("Invalid verification code. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // Validate password
      if (!newPassword || !confirmPassword) {
        setError("Please enter and confirm your new password")
        return
      }

      if (newPassword.length < 8) {
        setError("Password must be at least 8 characters long")
        return
      }

      if (newPassword !== confirmPassword) {
        setError("Passwords do not match")
        return
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setStep("success")
    } catch (err) {
      setError("Failed to reset password. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackClick = () => {
    if (step === "verify") {
      setStep("email")
      setError("")
    } else if (step === "reset") {
      setStep("verify")
      setError("")
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="relative">
          {step !== "email" && (
            <button
              onClick={handleBackClick}
              className="absolute -left-2 top-0 p-2 hover:bg-muted rounded-md transition-colors"
              aria-label="Go back"
              disabled={isLoading}
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <DialogTitle className="text-center">
            {step === "email" && "Reset Your Password"}
            {step === "verify" && "Verify Your Email"}
            {step === "reset" && "Create New Password"}
            {step === "success" && "Password Reset Successful"}
          </DialogTitle>
          <DialogDescription className="text-center pt-2">
            {step === "email" && "Enter your email address and we'll send you a verification code"}
            {step === "verify" && `Enter the 6-digit code we sent to ${email}`}
            {step === "reset" && "Enter your new password to complete the reset"}
            {step === "success" && "Your password has been successfully reset"}
          </DialogDescription>
        </DialogHeader>

        {/* Email Step */}
        {step === "email" && (
          <form onSubmit={handleSendCode} className="space-y-4 pt-4">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email Address</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setError("")
                  }}
                  disabled={isLoading}
                  required
                />
              </Field>
            </FieldGroup>

            {error && (
              <div className="text-destructive text-sm font-medium px-3 py-2 bg-destructive/10 rounded-md">{error}</div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Sending...
                </>
              ) : (
                "Send Verification Code"
              )}
            </Button>
          </form>
        )}

        {/* Verification Step */}
        {step === "verify" && (
          <form onSubmit={handleVerifyCode} className="space-y-4 pt-4">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="code">Verification Code</FieldLabel>
                <Input
                  id="code"
                  type="text"
                  placeholder="000000"
                  value={verificationCode}
                  onChange={(e) => {
                    setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                    setError("")
                  }}
                  disabled={isLoading}
                  maxLength={6}
                  required
                  className="text-center text-2xl tracking-widest font-mono"
                />
                <FieldDescription>Check your email for the 6-digit code</FieldDescription>
              </Field>
            </FieldGroup>

            {error && (
              <div className="text-destructive text-sm font-medium px-3 py-2 bg-destructive/10 rounded-md">{error}</div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading || verificationCode.length !== 6}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Verifying...
                </>
              ) : (
                "Verify Code"
              )}
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="w-full text-muted-foreground hover:text-foreground"
              onClick={() => setStep("email")}
              disabled={isLoading}
            >
              Didn't receive a code? Send again
            </Button>
          </form>
        )}

        {step === "reset" && (
          <form onSubmit={handleResetPassword} className="space-y-4 pt-4">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="new-password">New Password</FieldLabel>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value)
                      setError("")
                    }}
                    disabled={isLoading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    disabled={isLoading}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <FieldDescription>At least 8 characters</FieldDescription>
              </Field>
            </FieldGroup>

            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value)
                      setError("")
                    }}
                    disabled={isLoading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    disabled={isLoading}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </Field>
            </FieldGroup>

            {error && (
              <div className="text-destructive text-sm font-medium px-3 py-2 bg-destructive/10 rounded-md">{error}</div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Resetting...
                </>
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>
        )}

        {/* Success Step */}
        {step === "success" && (
          <div className="space-y-4 pt-6 text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="w-12 h-12 text-primary" />
            </div>
            <div className="space-y-2">
              <p className="font-medium">Password Reset Successful</p>
              <p className="text-muted-foreground text-sm">
                Your password has been changed successfully. You can now sign in with your new password.
              </p>
            </div>

            <Button type="button" className="w-full" onClick={() => handleOpenChange(false)}>
              Back to Sign In
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
