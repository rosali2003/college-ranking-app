"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, X } from "lucide-react"
import type { College } from "@/lib/types"

interface SearchFiltersProps {
  colleges: College[]
  onFilter: (filtered: College[]) => void
}

interface Filters {
  search: string
  type: string
  size: string
  tuitionRange: string
  major: string
}

export function SearchFilters({ colleges, onFilter }: SearchFiltersProps) {
  const [filters, setFilters] = useState<Filters>({
    search: "",
    type: "any",
    size: "any",
    tuitionRange: "any",
    major: "any",
  })
  const [showFilters, setShowFilters] = useState(false)

  const allMajors = Array.from(new Set(colleges.flatMap((c) => c.majors))).sort()

  const applyFilters = () => {
    let filtered = colleges

    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(
        (college) =>
          college.name.toLowerCase().includes(searchLower) ||
          college.location.toLowerCase().includes(searchLower) ||
          college.description.toLowerCase().includes(searchLower),
      )
    }

    if (filters.type !== "any") {
      filtered = filtered.filter((college) => college.type === filters.type)
    }

    if (filters.size !== "any") {
      filtered = filtered.filter((college) => college.size === filters.size)
    }

    if (filters.tuitionRange !== "any") {
      filtered = filtered.filter((college) => {
        switch (filters.tuitionRange) {
          case "under-20k":
            return college.tuition < 20000
          case "20k-40k":
            return college.tuition >= 20000 && college.tuition < 40000
          case "40k-60k":
            return college.tuition >= 40000 && college.tuition < 60000
          case "over-60k":
            return college.tuition >= 60000
          default:
            return true
        }
      })
    }

    if (filters.major !== "any") {
      filtered = filtered.filter((college) => college.majors.includes(filters.major))
    }

    onFilter(filtered)
  }

  const clearFilters = () => {
    setFilters({
      search: "",
      type: "any",
      size: "any",
      tuitionRange: "any",
      major: "any",
    })
    onFilter(colleges)
  }

  const updateFilter = (key: keyof Filters, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)

    // Apply filters immediately for search
    if (key === "search") {
      let filtered = colleges
      if (value) {
        const searchLower = value.toLowerCase()
        filtered = filtered.filter(
          (college) =>
            college.name.toLowerCase().includes(searchLower) ||
            college.location.toLowerCase().includes(searchLower) ||
            college.description.toLowerCase().includes(searchLower),
        )
      }
      onFilter(filtered)
    }
  }

  const activeFiltersCount = Object.values(filters).filter((value) => value !== "any").length

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search colleges by name, location, or description..."
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="space-y-2">
            <label className="text-sm font-medium text-card-foreground">Type</label>
            <Select value={filters.type} onValueChange={(value) => updateFilter("type", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Any type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any type</SelectItem>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="private">Private</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-card-foreground">Size</label>
            <Select value={filters.size} onValueChange={(value) => updateFilter("size", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Any size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any size</SelectItem>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-card-foreground">Tuition Range</label>
            <Select value={filters.tuitionRange} onValueChange={(value) => updateFilter("tuitionRange", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Any range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any range</SelectItem>
                <SelectItem value="under-20k">Under $20k</SelectItem>
                <SelectItem value="20k-40k">$20k - $40k</SelectItem>
                <SelectItem value="40k-60k">$40k - $60k</SelectItem>
                <SelectItem value="over-60k">Over $60k</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-card-foreground">Major</label>
            <Select value={filters.major} onValueChange={(value) => updateFilter("major", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Any major" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any major</SelectItem>
                {allMajors.map((major) => (
                  <SelectItem key={major} value={major}>
                    {major}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 md:col-span-2 lg:col-span-4">
            <Button onClick={applyFilters} className="flex-1 bg-primary hover:bg-primary/90">
              Apply Filters
            </Button>
            <Button variant="outline" onClick={clearFilters} className="flex items-center gap-2 bg-transparent">
              <X className="w-4 h-4" />
              Clear
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
