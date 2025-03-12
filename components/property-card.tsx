"use client"
import Image from "next/image"
import Link from "next/link"
import type { PropertyData } from "@/types/property"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MortgageCalculator } from "@/components/mortgage-calculator"
import { RentalEstimator } from "@/components/rental-estimator"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Bed, Bath, SquareIcon as SquareFoot } from "lucide-react"

interface PropertyCardProps {
  property: PropertyData
}

export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-48">
        <Image
          src={property.imageUrl || "/placeholder.svg?height=400&width=600"}
          alt={property.address}
          fill
          className="object-cover"
        />
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="font-semibold">
            ${property.price.toLocaleString()}
          </Badge>
        </div>
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{property.address}</CardTitle>
        <CardDescription>{property.propertyType}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex justify-between mb-4">
          <div className="flex items-center">
            <Bed className="h-4 w-4 mr-1" />
            <span className="text-sm">{property.bedrooms} beds</span>
          </div>
          <div className="flex items-center">
            <Bath className="h-4 w-4 mr-1" />
            <span className="text-sm">{property.bathrooms} baths</span>
          </div>
          <div className="flex items-center">
            <SquareFoot className="h-4 w-4 mr-1" />
            <span className="text-sm">{property.squareFootage.toLocaleString()} sqft</span>
          </div>
        </div>

        <Tabs defaultValue="details">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="mortgage">Mortgage</TabsTrigger>
            <TabsTrigger value="rental">Rental</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="space-y-2">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Property Tax:</div>
              <div className="font-medium">${property.propertyTax.toLocaleString()}/yr</div>

              {property.hoaFee > 0 && (
                <>
                  <div>HOA Fee:</div>
                  <div className="font-medium">${property.hoaFee.toLocaleString()}/mo</div>
                </>
              )}

              <div>Year Built:</div>
              <div className="font-medium">{property.yearBuilt || "N/A"}</div>
            </div>
          </TabsContent>
          <TabsContent value="mortgage">
            <MortgageCalculator propertyPrice={property.price} />
          </TabsContent>
          <TabsContent value="rental">
            <RentalEstimator
              propertyPrice={property.price}
              propertyTax={property.propertyTax}
              hoaFee={property.hoaFee}
              bedrooms={property.bedrooms}
              location={property.location}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={property.listingUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4 mr-2" />
            View on Zillow
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

