"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"

interface SearchFiltersProps {
  sortBy: string
  setSortBy: (value: string) => void
  filterVerified: boolean
  setFilterVerified: (value: boolean) => void
}

export function SearchFilters({ sortBy, setSortBy, filterVerified, setFilterVerified }: SearchFiltersProps) {
  return (
    <Card className="w-80 border-2 border-slate-200/30 bg-card">
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="pb-3 border-b border-slate-200/20">
            <Label htmlFor="sort-select" className="text-sm font-medium mb-2 block">
              Sort by
            </Label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger id="sort-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="reviews">Most Reviews</SelectItem>
                <SelectItem value="experience">Most Experience</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Switch id="verified-filter" checked={filterVerified} onCheckedChange={setFilterVerified} />
            <Label htmlFor="verified-filter" className="text-sm">
              Verified providers only
            </Label>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
