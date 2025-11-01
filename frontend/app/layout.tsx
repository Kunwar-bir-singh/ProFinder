import type React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { ReduxProvider } from "@/components/providers/redux-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import { Header } from "@/components/header";
import RouteGuard from "./routeGuard";

export const metadata: Metadata = {
  title: "Professional Services Directory",
  description: "Find and connect with local service providers",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`antialiased`}>
        <RouteGuard>
        <ReduxProvider>
          <AuthProvider>
            <Header /> 
            {children}
          </AuthProvider>
        </ReduxProvider>
        </RouteGuard>
      </body>
    </html>
  );
}
