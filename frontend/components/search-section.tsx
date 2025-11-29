"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useSearchProvidersByProfessionAndCityQuery } from "@/lib/api/services/profession.service";
import { SearchResults } from "./search-results";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Search, MapPin, Sparkles } from "lucide-react";
import type { KeyboardEvent } from "react";

export function SearchSection() {
  const [profession, setProfession] = useState("");
  const [city, setCity] = useState("");
  const [searchParams, setSearchParams] = useState<{
    city: string;
    profession: string;
  } | null>(null);
  const { toast } = useToast();

  const {
    data: queryData,
    isLoading,
    error,
  } = useSearchProvidersByProfessionAndCityQuery(
    searchParams || { city: "", profession: "" },
    {
      skip: !searchParams, // Only run the query when we have search params
    }
  );

  const [showResults, setShowResults] = useState(false);

  const handleSearch = () => {
    if (!profession.trim()) {
      toast({
        title: "Error",
        description: "Please enter a profession to search for",
        variant: "destructive",
      });
      return;
    }

    // Set search parameters to trigger the query
    setSearchParams({
      profession: profession.trim(),
      city: city.trim() || "Your City",
    });
    setShowResults(true);
  };

  const handleReset = () => {
    setProfession("");
    setCity("");
    setSearchParams(null);
    setShowResults(false);
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Handle query errors
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to search providers. Please try again.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  // Handle search results - only show "no results" when we have complete data
  useEffect(() => {
    // Only process results when:
    // 1. We have queryData (not undefined)
    // 2. We have searchParams (query was triggered)
    // 3. We're not loading (data is complete)
    // 4. The query was actually successful (success: false means no providers found)
    if (queryData && searchParams && !isLoading) {
      if (!queryData.success && queryData.data?.length === 0) {
        toast({
          title: "No Results",
          description:
            "No providers found for your search. Please try different criteria.",
          variant: "destructive",
        });
      }
    }
  }, [queryData, searchParams, isLoading, toast]);

  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      {showResults ? (
        <SearchResults
          providersData={queryData}
          isLoading={isLoading}
          error={error}
          profession={profession}
          city={city}
          onBack={() => {
            setShowResults(false);
            setSearchParams(null);
          }}
        />
      ) : (
        <div className="relative">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/20 text-primary-foreground text-sm font-medium mb-6 border border-primary/30">
                <Sparkles className="w-4 h-4 mr-2" />
                Find Local Professionals
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
                Connect with trusted{" "}
                <span className="text-primary">professionals</span> in your city
              </h1>

              <p className="text-xl text-muted-foreground mb-12 text-pretty max-w-2xl mx-auto">
                Search for skilled service providers in your area. From plumbers
                to electricians, find verified professionals ready to help with
                your needs.
              </p>

              {/* Search Card */}
              <Card className="p-8 max-w-2xl mx-auto shadow-xl border-2 border-slate-200/30 bg-card/90 backdrop-blur-sm">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                      <Input
                        placeholder="What service do you need? (e.g., plumber)"
                        value={profession}
                        onChange={(e) => setProfession(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="pl-10 h-12 text-base border-2 border-slate-200/40 focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                    </div>

                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                      <Input
                        placeholder="Enter your city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="pl-10 h-12 text-base border-2 border-slate-200/40 focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>

                  <div className="border-t border-slate-200/20 pt-6">
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button
                        onClick={handleSearch}
                        size="lg"
                        className="h-12 px-8 text-base font-semibold"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2" />
                            Searching...
                          </div>
                        ) : (
                          <>
                            <Search className="w-5 h-5 mr-2" />
                            Search Professionals
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={handleReset}
                        variant="outline"
                        size="lg"
                        className="h-12 px-8 text-base bg-transparent"
                      >
                        Reset
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Popular searches */}
              <div className="mt-8 text-center">
                <p className="text-sm text-muted-foreground mb-3">
                  Popular searches:
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {[
                    "Plumber",
                    "Electrician",
                    "Carpenter",
                    "Painter",
                    "Cleaner",
                  ].map((term) => (
                    <Button
                      key={term}
                      variant="secondary"
                      size="sm"
                      className="rounded-full"
                      onClick={() => {
                        setProfession(term);
                        setSearchParams({
                          profession: term,
                          city: city.trim() || "Your City",
                        });
                        setShowResults(true);
                      }}
                      disabled={isLoading}
                    >
                      {term}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
