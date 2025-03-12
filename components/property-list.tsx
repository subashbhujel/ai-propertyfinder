"use client"

import { useState } from "react"
import { PropertyCard } from "@/components/property-card"
import type { PropertyData } from "@/types/property"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PropertyTable } from "@/components/property-table"
import { LayoutGrid, List } from "lucide-react"

interface PropertyListProps {
  properties: PropertyData[]
}

export function PropertyList({ properties }: PropertyListProps) {
  const [sortBy, setSortBy] = useState("price-asc")
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "table">("table")

  const filteredProperties = properties.filter((property) =>
    property.address.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const sortedProperties = [...filteredProperties].sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        return a.price - b.price
      case "price-desc":
        return b.price - a.price
      case "sqft-asc":
        return a.squareFootage - b.squareFootage
      case "sqft-desc":
        return b.squareFootage - a.squareFootage
      case "beds-asc":
        return a.bedrooms - b.bedrooms
      case "beds-desc":
        return b.bedrooms - a.bedrooms
      case "baths-asc":
        return a.bathrooms - b.bathrooms
      case "baths-desc":
        return b.bathrooms - a.bathrooms
      default:
        return 0
    }
  })

  if (properties.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold mb-2">No properties found</h3>
        <p className="text-muted-foreground">Try adjusting your search criteria to find more properties.</p>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Search Results</CardTitle>
        <CardDescription>Found {properties.length} properties matching your criteria</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="w-full sm:w-1/2">
            <Label htmlFor="search" className="sr-only">
              Search
            </Label>
            <Input
              id="search"
              placeholder="Search by address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <div className="w-full sm:w-auto">
              <Label htmlFor="sort-by" className="sr-only">
                Sort by
              </Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger id="sort-by" className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="sqft-asc">Sq Ft: Low to High</SelectItem>
                  <SelectItem value="sqft-desc">Sq Ft: High to Low</SelectItem>
                  <SelectItem value="beds-asc">Beds: Low to High</SelectItem>
                  <SelectItem value="beds-desc">Beds: High to Low</SelectItem>
                  <SelectItem value="baths-asc">Baths: Low to High</SelectItem>
                  <SelectItem value="baths-desc">Baths: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-1 border rounded-md">
              <Button
                variant={viewMode === "table" ? "default" : "ghost"}
                size="icon"
                className="rounded-none rounded-l-md"
                onClick={() => setViewMode("table")}
              >
                <List className="h-4 w-4" />
                <span className="sr-only">Table view</span>
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="icon"
                className="rounded-none rounded-r-md"
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="h-4 w-4" />
                <span className="sr-only">Grid view</span>
              </Button>
            </div>
          </div>
        </div>

        {viewMode === "table" ? (
          <PropertyTable properties={sortedProperties} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

