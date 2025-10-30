"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProviderCard } from "@/components/provider-card"
import { SearchFilters } from "@/components/search-filters"
import { SearchEmptyState } from "@/components/search-empty-state"
import { Button } from "@/components/ui/button"
import { ArrowLeft, MapPin, Users } from "lucide-react"
import Link from "next/link"

// Mock provider data - replace with actual API call
const mockProviders = [
  {
    id: 1,
    username: "Victor.Romaguera23",
    fullname: "Elsie Ruecker",
    profession: "plumber",
    phone: "9999999999",
    address: "934 Abshire Greens",
    rating: 4.8,
    reviewCount: 127,
    verified: true,
    yearsExperience: 8,
    profileImage: "/professional-plumber-headshot.jpg",
  },
  {
    id: 2,
    username: "Heaven30",
    fullname: "Estelle Howell",
    profession: "plumber",
    phone: "9999999998",
    address: "061 Jean Estates",
    rating: 4.9,
    reviewCount: 203,
    verified: true,
    yearsExperience: 12,
    profileImage: "/professional-plumber-woman-headshot.jpg",
  },
  {
    id: 3,
    username: "Marquis51",
    fullname: "Jimmy Jerde",
    profession: "plumber",
    phone: "9999999997",
    address: "80498 Kory Manor",
    rating: 4.7,
    reviewCount: 89,
    verified: true,
    yearsExperience: 6,
    profileImage: "/professional-plumber-man-headshot.jpg",
  },
  {
    id: 4,
    username: "Dominic35",
    fullname: "Chelsea O'Kon",
    profession: "plumber",
    phone: "9999999994",
    address: "187 Pollich Stravenue",
    rating: 4.6,
    reviewCount: 156,
    verified: false,
    yearsExperience: 4,
    profileImage: "/professional-plumber-woman-headshot.jpg",
  },
  {
    id: 5,
    username: "Domenico.Nicolas57",
    fullname: "Bennie Hahn",
    profession: "plumber",
    phone: "9999999995",
    address: "58307 Spencer Inlet",
    rating: 4.5,
    reviewCount: 74,
    verified: true,
    yearsExperience: 10,
    profileImage: "/professional-plumber-man-headshot.jpg",
  },
  {
    id: 6,
    username: "Erica98",
    fullname: "Bernice Kohler",
    profession: "plumber",
    phone: "9999999996",
    address: "871 Johnston Crest",
    rating: 4.8,
    reviewCount: 192,
    verified: true,
    yearsExperience: 15,
    profileImage: "/professional-plumber-woman-headshot.jpg",
  },
  {
    id: 7,
    username: "Alfonzo.Herzog",
    fullname: "Jamie Jaskolski",
    profession: "plumber",
    phone: "9999999993",
    address: "123 Main Street",
    rating: 4.4,
    reviewCount: 45,
    verified: true,
    yearsExperience: 3,
    profileImage: "/professional-plumber-man-headshot.jpg",
  },
  {
    id: 8,
    username: "Kunwarbir.Singh",
    fullname: "Kunwarbir Singh",
    profession: "musician",
    phone: "9444496177",
    address: "456 Oak Avenue",
    rating: 4.9,
    reviewCount: 312,
    verified: true,
    yearsExperience: 20,
    profileImage: "/professional-musician-headshot.jpg",
  },
]

export default function SearchResultsPage() {
  const searchParams = useSearchParams()
  const profession = searchParams.get("profession") || "plumber"
  const city = searchParams.get("city") || "Your City"

  const [providers, setProviders] = useState(mockProviders)
  const [sortBy, setSortBy] = useState("rating")
  const [filterVerified, setFilterVerified] = useState(false)

  // Filter and sort providers
  const filteredProviders = providers
    .filter((provider) => !filterVerified || provider.verified)
    .sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating
        case "reviews":
          return b.reviewCount - a.reviewCount
        case "experience":
          return b.yearsExperience - a.yearsExperience
        default:
          return 0
      }
    })

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

        {filteredProviders.length === 0 ? (
          <SearchEmptyState profession={profession} city={city} />
        ) : (
          <>
            {/* Results header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  <span className="text-primary">{filteredProviders.length}</span> Providers Found!
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
                <ProviderCard key={provider.id} provider={provider} />
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
  )
}
