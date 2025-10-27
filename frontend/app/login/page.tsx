"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Building2,
  Phone,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/header";
import { useLoginMutation } from "@/lib/hooks";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function LoginPage() {
  const router = useRouter();
  const [userType, setUserType] = useState<"user" | "provider">("user");
  const [loginMethod, setLoginMethod] = useState<"username" | "mobile">("username");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    mobile: "",
    password: "",
  });

  // RTK Query hook
  const [login, { isLoading, error }] = useLoginMutation();

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const credentials = {
        [loginMethod === "username" ? "username" : "mobile"]:
          formData[loginMethod === "username" ? "username" : "mobile"],
        password: formData.password,
      };
      await login(credentials).unwrap();
      router.push("/");
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const handleGoogleLogin = () => {
    console.log("Google login for:", userType);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h1>
            <p className="text-slate-600">Sign in to your account to continue</p>
          </div>

          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="space-y-4">
              {/* User Type Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-slate-700">I am a:</Label>
                <Tabs
                  value={userType}
                  onValueChange={(value) => setUserType(value as "user" | "provider")}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2 bg-slate-100">
                    <TabsTrigger value="user" className="flex items-center gap-2">
                      <User className="w-4 h-4" /> User
                    </TabsTrigger>
                    <TabsTrigger value="provider" className="flex items-center gap-2">
                      <Building2 className="w-4 h-4" /> Provider
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Error Display */}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {"data" in error
                      ? (error.data as any)?.message ||
                        "Login failed. Please check your credentials."
                      : "Login failed. Please try again."}
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                {/* Username/Mobile Field */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="login-field"
                      className="text-sm font-medium text-slate-700"
                    >
                      {loginMethod === "username" ? "Username" : "Mobile Number"}
                    </Label>
                    <div className="flex items-center bg-slate-100 rounded-lg p-1 border border-slate-200">
                      <button
                        type="button"
                        onClick={() => setLoginMethod("username")}
                        disabled={isLoading}
                        className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-all duration-200 ${
                          loginMethod === "username"
                            ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        <Mail className="w-3 h-3" /> Username
                      </button>
                      <button
                        type="button"
                        onClick={() => setLoginMethod("mobile")}
                        disabled={isLoading}
                        className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-all duration-200 ${
                          loginMethod === "mobile"
                            ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        <Phone className="w-3 h-3" /> Mobile
                      </button>
                    </div>
                  </div>

                  <div className="relative">
                    <Input
                      id="login-field"
                      type={loginMethod === "username" ? "text" : "tel"}
                      placeholder={
                        loginMethod === "username"
                          ? "Enter your username"
                          : "Enter your mobile number"
                      }
                      value={
                        loginMethod === "username"
                          ? formData.username
                          : formData.mobile
                      }
                      onChange={(e) =>
                        handleInputChange(loginMethod, e.target.value)
                      }
                      disabled={isLoading}
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

                {/* Password Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium text-slate-700"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      disabled={isLoading}
                      className="pl-10 pr-10 h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Forgot Password */}
                <div className="text-right">
                  <Link
                    href="/forgot-password"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Login Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Signing In...
                    </div>
                  ) : (
                    `Sign In as ${userType === "user" ? "User" : "Provider"}`
                  )}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative">
                <Separator className="bg-slate-200" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="bg-white px-3 text-sm text-slate-500">or</span>
                </div>
              </div>

              {/* Google Login */}
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleLogin}
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

              {/* Sign Up Link */}
              <div className="text-center pt-4">
                <p className="text-sm text-slate-600">
                  Don't have an account?{" "}
                  <Link
                    href="/register"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Sign up here
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
