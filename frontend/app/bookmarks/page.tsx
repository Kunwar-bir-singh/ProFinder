"use client";

import { useState } from "react";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { ProviderCard } from "@/components/provider-card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Bookmark, Users } from "lucide-react";
import { useGetBookmarksQuery } from "@/lib/api/services/user/user.service";
import { useAuth } from "@/lib/hooks/useAuth";
import { transformProviderData } from "@/lib/api/services/profession.service";

export default function BookmarksPage() {
  const { isAuthenticated } = useAuth();
  const { data: bookmarksData, isLoading, error } = useGetBookmarksQuery();

  const bookmarks = bookmarksData?.data || [];

  // Transform bookmarks to provider format using the same transformation as profession service
  const bookmarkedProviders = transformProviderData(bookmarks, "Professional");

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <Bookmark className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Please Login to View Bookmarks
            </h1>
            <p className="text-muted-foreground mb-6">
              You need to be logged in to access your bookmarked providers.
            </p>
            <div className="space-x-4">
              <Link href="/login">
                <Button>Login</Button>
              </Link>
              <Link href="/register">
                <Button variant="outline">Register</Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        {/* Back button and breadcrumb */}
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>

          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <span>My Bookmarks</span>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">
            Failed to load bookmarks. Please try again.
          </div>
        ) : bookmarks.length === 0 ? (
          <div className="text-center py-16">
            <Bookmark className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">
              No Bookmarks Yet
            </h1>
            <p className="text-muted-foreground mb-6">
              Start exploring providers and bookmark your favorites to see them here.
            </p>
            <Link href="/search">
              <Button>Find Providers</Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Results header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                <span className="text-primary">
                  {bookmarks.length}
                </span>{" "}
                Bookmarked Providers
              </h1>
              <p className="text-muted-foreground flex items-center gap-2">
                <Users className="w-4 h-4" />
                Your saved professional contacts
              </p>
            </div>

            {/* Provider grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookmarkedProviders.map((provider) => (
                <ProviderCard
                  key={provider.id}
                  provider={provider}
                  bookmarksData={bookmarks}
                />
              ))}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}