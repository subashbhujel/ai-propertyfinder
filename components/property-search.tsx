"use client"

import { useState } from "react"
import { PropertyList } from "@/components/property-list"
import { SearchFilters } from "@/components/search-filters"
import type { PropertyData } from "@/types/property"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export function PropertySearch() {
  const [properties, setProperties] = useState<PropertyData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)
  const { toast } = useToast()

  const handleSearch = async (filters: Record<string, any>) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/properties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(filters),
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch properties: ${response.statusText}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      setProperties(data)
      setHasSearched(true)

      if (data.length === 0) {
        toast({
          title: "No properties found",
          description: "Try adjusting your search criteria to find more properties.",
          variant: "default",
        })
      } else {
        toast({
          title: "Search completed",
          description: `Found ${data.length} properties matching your criteria.`,
          variant: "default",
        })
      }
    } catch (error) {
      console.error(error)
      setError(error instanceof Error ? error.message : "An unknown error occurred")
      toast({
        title: "Error",
        description: "Failed to fetch properties. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <SearchFilters onSearch={handleSearch} />

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Fetching properties...</span>
        </div>
      ) : (
        hasSearched && <PropertyList properties={properties} />
      )}
    </div>
  )
}

