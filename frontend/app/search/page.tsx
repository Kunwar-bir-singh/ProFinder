"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Footer } from "@/components/footer";
import { ProviderCard } from "@/components/provider-card";
import { SearchFilters } from "@/components/search-filters";
import { SearchEmptyState } from "@/components/search-empty-state";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Users } from "lucide-react";
import Link from "next/link";
import { useSearchProvidersByProfessionAndCityQuery } from "@/lib/api/services";
import { useGetBookmarksQuery } from "@/lib/api/services/user/user.service";
import { SearchErrorState } from "@/components/search-error-state";

export default function SearchResultsPage() {
  const searchParams = useSearchParams();
  const profession = searchParams.get("profession") || "";
  const city = searchParams.get("city") || "";

  const {
    data: providersData,
    isLoading,
    error,
  } = useSearchProvidersByProfessionAndCityQuery(
    { profession, city },
    { skip: !profession || !city }
  );

  const { data: bookmarksData } = useGetBookmarksQuery();

  const [sortBy, setSortBy] = useState("rating");
  const [filterVerified, setFilterVerified] = useState(false);

  const isSuccess = providersData?.success === true;
  const providers = isSuccess ? providersData.data || [] : [];

  // Filter and sort providers
  const filteredProviders = providers
    .filter((provider) => !filterVerified || provider.verified)
    .sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return (b.rating || 0) - (a.rating || 0); ;
        case "reviews":
          return b.reviewCount - a.reviewCount;
        case "experience":
          return (b.yearsExperience || 0) - (a.yearsExperience || 0 );
        default:
          return 0;
      }
    });

  // Show loading state if we have search params but no data yet
  const shouldShowLoading = isLoading || (!error && providersData === undefined && profession && city);

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        {/* Back button and breadcrumb */}
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Search
            </Button>
          </Link>

          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <span>Search Results</span>
            <span>•</span>
            <span className="capitalize">{profession}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {city}
            </span>
          </div>
        </div>

        {!profession || !city ? (
          <div className="text-center py-8">
            <h2 className="text-xl font-semibold mb-2">Start Your Search</h2>
            <p className="text-muted-foreground">
              Enter a profession and city to find providers
            </p>
          </div>
        ) : shouldShowLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <SearchErrorState
            error={error}
            searchTerm={profession}
            city={city}
          />
        ) : !isSuccess ? (
          <div className="text-center text-red-500 py-8">
            Failed to fetch providers. Please try again.
          </div>
        ) : filteredProviders.length === 0 ? (
          <SearchEmptyState searchTerm={profession} city={city} />
        ) : (
          <>
            {/* Results header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  <span className="text-primary">
                    {filteredProviders.length}
                  </span>{" "}
                  Providers Found!
                </h1>
                <p className="text-muted-foreground flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Professional {profession}s in {city}
                </p>
              </div>

              <SearchFilters
                sortBy={sortBy}
                setSortBy={setSortBy}
                filterVerified={filterVerified}
                setFilterVerified={setFilterVerified}
              />
            </div>

            {/* Provider grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProviders.map((provider) => (
                <ProviderCard key={provider.provider_id} provider={provider} bookmarksData={bookmarksData?.data || []} />
              ))}
            </div>

            {/* Load more button */}
            <div className="text-center mt-12">
              <Button variant="outline" size="lg">
                Load More Providers
              </Button>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
