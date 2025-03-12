"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Search, Plus, Minus, ChevronDown, ChevronUp } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface SearchFiltersProps {
  onSearch: (filters: Record<string, any>) => void
}

export function SearchFilters({ onSearch }: SearchFiltersProps) {
  const [location, setLocation] = useState("Leavenworth, WA")
  const [propertyType, setPropertyType] = useState("single-family")
  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(500000)
  const [minBeds, setMinBeds] = useState(2)
  const [minBaths, setMinBaths] = useState(1)
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false)
  const [savedSearches, setSavedSearches] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  // Load saved searches from localStorage on component mount
  useEffect(() => {
    const savedSearchesData = localStorage.getItem("savedSearches")
    if (savedSearchesData) {
      try {
        const parsedData = JSON.parse(savedSearchesData)
        if (parsedData.length > 0) {
          // Use the first saved search as default
          const defaultSearch = parsedData[0]
          setLocation(defaultSearch.location || "Leavenworth, WA")
          setPropertyType(defaultSearch.propertyType || "single-family")
          setMinPrice(defaultSearch.minPrice || 0)
          setMaxPrice(defaultSearch.maxPrice || 500000)
          setMinBeds(defaultSearch.minBeds || 2)
          setMinBaths(defaultSearch.minBaths || 1)
        }
      } catch (error) {
        console.error("Error loading saved searches:", error)
      }
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await onSearch({
        location,
        propertyType,
        minPrice,
        maxPrice,
        minBeds,
        minBaths,
        savedSearches,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Search Properties</CardTitle>
        <CardDescription>Find investment properties based on your criteria</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="City, State or ZIP"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="property-type">Property Type</Label>
              <Select value={propertyType} onValueChange={setPropertyType}>
                <SelectTrigger id="property-type">
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single-family">Single Family</SelectItem>
                  <SelectItem value="multi-family">Multi Family</SelectItem>
                  <SelectItem value="condo">Condo</SelectItem>
                  <SelectItem value="townhouse">Townhouse</SelectItem>
                  <SelectItem value="land">Land</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Price Range</Label>
              <span className="text-sm text-muted-foreground">
                ${minPrice.toLocaleString()} - ${maxPrice.toLocaleString()}
              </span>
            </div>
            <div className="pt-4">
              <Slider
                defaultValue={[minPrice, maxPrice]}
                max={1000000}
                step={10000}
                onValueChange={(values) => {
                  setMinPrice(values[0])
                  setMaxPrice(values[1])
                }}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="min-beds">Minimum Bedrooms</Label>
              <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setMinBeds(Math.max(0, minBeds - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  id="min-beds"
                  type="number"
                  value={minBeds}
                  onChange={(e) => setMinBeds(Number.parseInt(e.target.value))}
                  className="text-center"
                />
                <Button type="button" variant="outline" size="icon" onClick={() => setMinBeds(minBeds + 1)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="min-baths">Minimum Bathrooms</Label>
              <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setMinBaths(Math.max(0, minBaths - 0.5))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  id="min-baths"
                  type="number"
                  step="0.5"
                  value={minBaths}
                  onChange={(e) => setMinBaths(Number.parseFloat(e.target.value))}
                  className="text-center"
                />
                <Button type="button" variant="outline" size="icon" onClick={() => setMinBaths(minBaths + 0.5)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen} className="border rounded-md p-2">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="flex w-full justify-between p-2">
                <span>Advanced Filters</span>
                {isAdvancedOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2 space-y-4">
              <div className="flex items-center space-x-2">
                <Switch id="saved-searches" checked={savedSearches} onCheckedChange={setSavedSearches} />
                <Label htmlFor="saved-searches">Use saved search criteria</Label>
              </div>

              {/* Additional filters can be added here */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="year-built">Year Built (After)</Label>
                  <Input id="year-built" type="number" placeholder="e.g. 1990" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lot-size">Minimum Lot Size (Acres)</Label>
                  <Input id="lot-size" type="number" step="0.1" placeholder="e.g. 0.25" />
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Button type="submit" className="w-full" disabled={isLoading}>
            <Search className="mr-2 h-4 w-4" />
            {isLoading ? "Searching..." : "Search Properties"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

