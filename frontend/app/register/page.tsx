"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { User, Building2, Phone, Mail, Eye, EyeOff, MapPin } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/header"

export default function RegisterPage() {
  const [userType, setUserType] = useState<"user" | "provider">("user")
  const [loginMethod, setLoginMethod] = useState<"username" | "mobile">("username")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    mobile: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
    profession: "",
    bio: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!")
      return
    }
    console.log("Register attempt:", { userType, loginMethod, formData })
    // Add your registration logic here
  }

  const handleGoogleRegister = () => {
    console.log("Google register for:", userType)
    // Add Google OAuth logic here
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Create Account</h1>
            <p className="text-slate-600">Join our platform to get started</p>
          </div>

          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="space-y-4">
              {/* User Type Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-slate-700">I want to join as:</Label>
                <Tabs
                  value={userType}
                  onValueChange={(value) => setUserType(value as "user" | "provider")}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2 bg-slate-100">
                    <TabsTrigger value="user" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      User
                    </TabsTrigger>
                    <TabsTrigger value="provider" className="flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      Provider
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Login Method Toggle */}
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-600" />
                  <span className="text-sm font-medium text-slate-700">Username</span>
                </div>
                <Switch
                  checked={loginMethod === "mobile"}
                  onCheckedChange={(checked) => setLoginMethod(checked ? "mobile" : "username")}
                />
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-600" />
                  <span className="text-sm font-medium text-slate-700">Mobile</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleRegister} className="space-y-4">
                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-sm font-medium text-slate-700">
                    Full Name
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    className="h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Username/Mobile Field */}
                <div className="space-y-2">
                  <Label htmlFor="login-field" className="text-sm font-medium text-slate-700">
                    {loginMethod === "username" ? "Username" : "Mobile Number"}
                  </Label>
                  <div className="relative">
                    <Input
                      id="login-field"
                      type={loginMethod === "username" ? "text" : "tel"}
                      placeholder={loginMethod === "username" ? "Choose a username" : "Enter your mobile number"}
                      value={loginMethod === "username" ? formData.username : formData.mobile}
                      onChange={(e) => handleInputChange(loginMethod, e.target.value)}
                      className="pl-10 h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                      {loginMethod === "username" ? (
                        <Mail className="w-4 h-4 text-slate-400" />
                      ) : (
                        <Phone className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Provider-specific fields */}
                {userType === "provider" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="profession" className="text-sm font-medium text-slate-700">
                        Profession
                      </Label>
                      <Input
                        id="profession"
                        type="text"
                        placeholder="e.g., Plumber, Electrician, etc."
                        value={formData.profession}
                        onChange={(e) => handleInputChange("profession", e.target.value)}
                        className="h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-sm font-medium text-slate-700">
                        Service Area
                      </Label>
                      <div className="relative">
                        <Input
                          id="address"
                          type="text"
                          placeholder="Enter your service area/city"
                          value={formData.address}
                          onChange={(e) => handleInputChange("address", e.target.value)}
                          className="pl-10 h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                          required
                        />
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio" className="text-sm font-medium text-slate-700">
                        Bio (Optional)
                      </Label>
                      <Textarea
                        id="bio"
                        placeholder="Tell us about your experience and services..."
                        value={formData.bio}
                        onChange={(e) => handleInputChange("bio", e.target.value)}
                        className="border-slate-200 focus:border-blue-500 focus:ring-blue-500 resize-none"
                        rows={3}
                      />
                    </div>
                  </>
                )}

                {/* Password Fields */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className="pl-10 pr-10 h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      className="pl-10 pr-10 h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Register Button */}
                <Button type="submit" className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium">
                  Create {userType === "user" ? "User" : "Provider"} Account
                </Button>
              </form>

              {/* Divider */}
              <div className="relative">
                <Separator className="bg-slate-200" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="bg-white px-3 text-sm text-slate-500">or</span>
                </div>
              </div>

              {/* Google Register */}
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleRegister}
                className="w-full h-12 border-slate-200 hover:bg-slate-50 font-medium bg-transparent"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </Button>

              {/* Sign In Link */}
              <div className="text-center pt-4">
                <p className="text-sm text-slate-600">
                  Already have an account?{" "}
                  <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                    Sign in here
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
