"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Search, MapPin, Sparkles } from "lucide-react"

export function SearchSection() {
  const [profession, setProfession] = useState("")
  const [city, setCity] = useState("")
  const router = useRouter()

  const handleSearch = () => {
    if (profession.trim()) {
      const searchParams = new URLSearchParams({
        profession: profession.trim(),
        city: city.trim() || "Your City",
      })
      router.push(`/search?${searchParams.toString()}`)
    }
  }

  const handleReset = () => {
    setProfession("")
    setCity("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/20 text-primary-foreground text-sm font-medium mb-6 border border-primary/30">
            <Sparkles className="w-4 h-4 mr-2" />
            Find Local Professionals
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
            Connect with trusted <span className="text-primary">professionals</span> in your city
          </h1>

          <p className="text-xl text-muted-foreground mb-12 text-pretty max-w-2xl mx-auto">
            Search for skilled service providers in your area. From plumbers to electricians, find verified
            professionals ready to help with your needs.
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
                  <Button onClick={handleSearch} size="lg" className="h-12 px-8 text-base font-semibold">
                    <Search className="w-5 h-5 mr-2" />
                    Search Professionals
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
            <p className="text-sm text-muted-foreground mb-3">Popular searches:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {["Plumber", "Electrician", "Carpenter", "Painter", "Cleaner"].map((term) => (
                <Button
                  key={term}
                  variant="secondary"
                  size="sm"
                  className="rounded-full"
                  onClick={() => {
                    setProfession(term)
                    const searchParams = new URLSearchParams({
                      profession: term,
                      city: city.trim() || "Your City",
                    })
                    router.push(`/search?${searchParams.toString()}`)
                  }}
                >
                  {term}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
