"use client"

import type { PropertyData } from "@/types/property"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { ExternalLink, Calculator } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { MortgageCalculator } from "@/components/mortgage-calculator"
import { RentalEstimator } from "@/components/rental-estimator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface PropertyTableProps {
  properties: PropertyData[]
}

export function PropertyTable({ properties }: PropertyTableProps) {
  return (
    <div className="rounded-md border overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Address</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-center">Beds</TableHead>
              <TableHead className="text-center">Baths</TableHead>
              <TableHead className="text-right">Sq Ft</TableHead>
              <TableHead className="text-right">Property Tax</TableHead>
              <TableHead className="text-right">HOA</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {properties.map((property) => (
              <TableRow key={property.id}>
                <TableCell>
                  <div className="relative h-12 w-16 overflow-hidden rounded">
                    <Image
                      src={property.imageUrl || "/placeholder.svg?height=100&width=100"}
                      alt={property.address}
                      fill
                      className="object-cover"
                    />
                  </div>
                </TableCell>
                <TableCell className="font-medium">
                  <div className="max-w-[250px] truncate" title={property.address}>
                    {property.address}
                  </div>
                  <div className="text-xs text-muted-foreground">{property.propertyType}</div>
                </TableCell>
                <TableCell className="text-right font-semibold">${property.price.toLocaleString()}</TableCell>
                <TableCell className="text-center">{property.bedrooms}</TableCell>
                <TableCell className="text-center">{property.bathrooms}</TableCell>
                <TableCell className="text-right">{property.squareFootage.toLocaleString()}</TableCell>
                <TableCell className="text-right">${property.propertyTax.toLocaleString()}/yr</TableCell>
                <TableCell className="text-right">{property.hoaFee > 0 ? `$${property.hoaFee}/mo` : "N/A"}</TableCell>
                <TableCell>
                  <div className="flex justify-center space-x-1">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="icon" title="Mortgage Calculator">
                          <Calculator className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Property Analysis</DialogTitle>
                          <DialogDescription>
                            Analyze mortgage and rental potential for this property.
                          </DialogDescription>
                        </DialogHeader>
                        <Tabs defaultValue="mortgage">
                          <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="mortgage">Mortgage</TabsTrigger>
                            <TabsTrigger value="rental">Rental</TabsTrigger>
                          </TabsList>
                          <TabsContent value="mortgage" className="pt-4">
                            <MortgageCalculator propertyPrice={property.price} />
                          </TabsContent>
                          <TabsContent value="rental" className="pt-4">
                            <RentalEstimator
                              propertyPrice={property.price}
                              propertyTax={property.propertyTax}
                              hoaFee={property.hoaFee}
                              bedrooms={property.bedrooms}
                              location={property.location}
                            />
                          </TabsContent>
                        </Tabs>
                      </DialogContent>
                    </Dialog>
                    <Button variant="outline" size="icon" asChild title="View on Zillow">
                      <Link href={property.listingUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

