"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus, Search, Users } from "lucide-react"
import Link from "next/link"

interface SearchEmptyStateProps {
  searchTerm: string
  city: string
}

export function SearchEmptyState({ searchTerm, city }: SearchEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] px-4">
      <Card className="max-w-md w-full p-8 text-center border-2 border-slate-200/30 bg-card shadow-lg">
        <div className="mb-6 pb-6 border-b border-slate-200/20">
          <div className="w-16 h-16 bg-muted border-2 border-slate-200/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">No {searchTerm} Found</h2>
          <p className="text-muted-foreground">
            We couldn't find any {searchTerm.toLowerCase()} providers in {city}. But don't worry - you can help build
            our community!
          </p>
        </div>

        <div className="space-y-4 mb-6 pb-6 border-b border-slate-200/20">
          <Button asChild className="w-full">
            <Link href="/create-profession">
              <Plus className="w-4 h-4 mr-2" />
              Create "{searchTerm}" Profession
            </Link>
          </Button>

          <Button variant="outline" asChild className="w-full bg-transparent">
            <Link href="/">
              <Search className="w-4 h-4 mr-2" />
              Try Different Search
            </Link>
          </Button>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-200/30">
          <div className="flex items-center justify-center text-sm text-muted-foreground mb-3">
            <Users className="w-4 h-4 mr-2" />
            Popular Professions
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {["Plumber", "Electrician", "Carpenter", "Painter"].map((profession) => (
              <Button key={profession} variant="ghost" size="sm" asChild className="text-xs">
                <Link href={`/search?profession=${profession.toLowerCase()}&city=${city}`}>{profession}</Link>
              </Button>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}
