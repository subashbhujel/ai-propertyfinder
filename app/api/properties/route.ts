import { type NextRequest, NextResponse } from "next/server"
import type { PropertyData } from "@/types/property"
import axios from "axios"
import * as cheerio from "cheerio"

// Helper function to extract property data from Zillow HTML
async function scrapeZillowSearch(location: string, filters: Record<string, any>): Promise<PropertyData[]> {
  try {
    // Construct the Zillow search URL
    const encodedLocation = encodeURIComponent(location)
    let url = `https://www.zillow.com/homes/${encodedLocation}_rb/`

    // Add price filter if provided
    if (filters.minPrice && filters.maxPrice) {
      url += `${filters.minPrice}-${filters.maxPrice}_price/`
    }

    // Add beds filter if provided
    if (filters.minBeds) {
      url += `${filters.minBeds}-_beds/`
    }

    // Add baths filter if provided
    if (filters.minBaths) {
      url += `${filters.minBaths}-_baths/`
    }

    // Add property type filter if provided
    if (filters.propertyType && filters.propertyType !== "all") {
      const propertyTypeMap: Record<string, string> = {
        "single-family": "house",
        "multi-family": "multi-family",
        condo: "condo",
        townhouse: "townhouse",
        land: "land",
      }

      const zillowPropertyType = propertyTypeMap[filters.propertyType] || "house"
      url += `${zillowPropertyType}_type/`
    }

    // Make the request with appropriate headers to mimic a browser
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        Referer: "https://www.zillow.com/",
        Connection: "keep-alive",
        "Upgrade-Insecure-Requests": "1",
        "Cache-Control": "max-age=0",
      },
    })

    // Use Cheerio to parse the HTML
    const $ = cheerio.load(response.data)
    const properties: PropertyData[] = []

    // Extract the property data from the search results
    // Note: Zillow's HTML structure may change, so this selector might need updates
    $('article[data-test="property-card"]').each((index, element) => {
      try {
        const $element = $(element)

        // Extract property details
        const address = $element.find('[data-test="property-card-addr"]').text().trim()
        const priceText = $element.find('[data-test="property-card-price"]').text().trim()
        const price = Number.parseInt(priceText.replace(/[^0-9]/g, "")) || 0

        const detailsText = $element.find('[data-test="property-card-details"]').text().trim()
        const bedsMatch = detailsText.match(/(\d+)\s+bd/)
        const bathsMatch = detailsText.match(/(\d+(?:\.\d+)?)\s+ba/)
        const sqftMatch = detailsText.match(/([\d,]+)\s+sqft/)

        const bedrooms = bedsMatch ? Number.parseInt(bedsMatch[1]) : 0
        const bathrooms = bathsMatch ? Number.parseFloat(bathsMatch[1]) : 0
        const squareFootage = sqftMatch ? Number.parseInt(sqftMatch[1].replace(/,/g, "")) : 0

        // Extract image URL
        const imageUrl = $element.find("img").attr("src") || "/placeholder.svg?height=400&width=600"

        // Extract listing URL
        const listingUrl = $element.find("a").attr("href") || ""
        const fullListingUrl = listingUrl.startsWith("http") ? listingUrl : `https://www.zillow.com${listingUrl}`

        // Extract property type (if available)
        const propertyType = $element.find('[data-test="property-card-home-type"]').text().trim() || "Single Family"

        // Create property object
        const property: PropertyData = {
          id: `property-${index}`,
          address,
          location: filters.location || location,
          price,
          propertyType,
          bedrooms,
          bathrooms,
          squareFootage,
          yearBuilt: 0, // Not available in search results
          propertyTax: Math.round(price * 0.01), // Estimate
          hoaFee: 0, // Not available in search results
          imageUrl,
          listingUrl: fullListingUrl,
        }

        properties.push(property)
      } catch (error) {
        console.error("Error parsing property:", error)
      }
    })

    return properties
  } catch (error) {
    console.error("Error scraping Zillow:", error)
    return []
  }
}

// Fallback to RapidAPI if direct scraping fails
async function fetchFromRapidAPI(location: string, filters: Record<string, any>): Promise<PropertyData[]> {
  try {
    // This is a placeholder for using RapidAPI's Zillow API
    // You would need to sign up for RapidAPI and get an API key
    const response = await axios.get("https://zillow-com1.p.rapidapi.com/propertyExtendedSearch", {
      params: {
        location,
        home_type: filters.propertyType || "Houses",
        price_min: filters.minPrice || "0",
        price_max: filters.maxPrice || "10000000",
        beds_min: filters.minBeds || "0",
        baths_min: filters.minBaths || "0",
      },
      headers: {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY || "",
        "X-RapidAPI-Host": "zillow-com1.p.rapidapi.com",
      },
    })

    // Map the API response to our PropertyData format
    return response.data.props.map((prop: any, index: number) => ({
      id: prop.zpid || `property-${index}`,
      address: prop.address || "Unknown Address",
      location: filters.location || location,
      price: prop.price || 0,
      propertyType: prop.homeType || "Unknown",
      bedrooms: prop.bedrooms || 0,
      bathrooms: prop.bathrooms || 0,
      squareFootage: prop.livingArea || 0,
      yearBuilt: prop.yearBuilt || 0,
      propertyTax: Math.round((prop.price || 0) * 0.01), // Estimate
      hoaFee: 0, // Not available
      imageUrl: prop.imgSrc || "/placeholder.svg?height=400&width=600",
      listingUrl: `https://www.zillow.com/homedetails/${prop.zpid}_zpid/`,
    }))
  } catch (error) {
    console.error("Error fetching from RapidAPI:", error)
    return []
  }
}

// Mock data as a fallback
const mockProperties: PropertyData[] = [
  {
    id: "1",
    address: "123 Pine St, Leavenworth, WA 98826",
    location: "Leavenworth, WA",
    price: 450000,
    propertyType: "Single Family",
    bedrooms: 3,
    bathrooms: 2,
    squareFootage: 1800,
    yearBuilt: 2005,
    propertyTax: 3600,
    hoaFee: 0,
    imageUrl: "/placeholder.svg?height=400&width=600",
    listingUrl: "https://www.zillow.com/homedetails/123-fake-st",
  },
  {
    id: "2",
    address: "456 Mountain View Dr, Leavenworth, WA 98826",
    location: "Leavenworth, WA",
    price: 389000,
    propertyType: "Single Family",
    bedrooms: 2,
    bathrooms: 1.5,
    squareFootage: 1200,
    yearBuilt: 1995,
    propertyTax: 2800,
    hoaFee: 0,
    imageUrl: "/placeholder.svg?height=400&width=600",
    listingUrl: "https://www.zillow.com/homedetails/456-fake-st",
  },
  {
    id: "3",
    address: "789 River Rd, Leavenworth, WA 98826",
    location: "Leavenworth, WA",
    price: 499000,
    propertyType: "Single Family",
    bedrooms: 4,
    bathrooms: 3,
    squareFootage: 2400,
    yearBuilt: 2010,
    propertyTax: 4200,
    hoaFee: 0,
    imageUrl: "/placeholder.svg?height=400&width=600",
    listingUrl: "https://www.zillow.com/homedetails/789-fake-st",
  },
  {
    id: "4",
    address: "101 Alpine Way, Leavenworth, WA 98826",
    location: "Leavenworth, WA",
    price: 425000,
    propertyType: "Townhouse",
    bedrooms: 3,
    bathrooms: 2.5,
    squareFootage: 1650,
    yearBuilt: 2015,
    propertyTax: 3400,
    hoaFee: 250,
    imageUrl: "/placeholder.svg?height=400&width=600",
    listingUrl: "https://www.zillow.com/homedetails/101-fake-st",
  },
  {
    id: "5",
    address: "202 Cascade Ave, Leavenworth, WA 98826",
    location: "Leavenworth, WA",
    price: 349000,
    propertyType: "Condo",
    bedrooms: 2,
    bathrooms: 2,
    squareFootage: 1100,
    yearBuilt: 2008,
    propertyTax: 2600,
    hoaFee: 350,
    imageUrl: "/placeholder.svg?height=400&width=600",
    listingUrl: "https://www.zillow.com/homedetails/202-fake-st",
  },
  {
    id: "6",
    address: "303 Icicle Rd, Leavenworth, WA 98826",
    location: "Leavenworth, WA",
    price: 475000,
    propertyType: "Single Family",
    bedrooms: 3,
    bathrooms: 2,
    squareFootage: 1950,
    yearBuilt: 2000,
    propertyTax: 3800,
    hoaFee: 0,
    imageUrl: "/placeholder.svg?height=400&width=600",
    listingUrl: "https://www.zillow.com/homedetails/303-fake-st",
  },
]

export async function POST(request: NextRequest) {
  try {
    const filters = await request.json()

    // Try to fetch real data first
    let properties: PropertyData[] = []

    try {
      // Try direct scraping first
      properties = await scrapeZillowSearch(filters.location || "Leavenworth, WA", filters)

      // If direct scraping fails or returns no results, try RapidAPI
      if (properties.length === 0 && process.env.RAPIDAPI_KEY) {
        properties = await fetchFromRapidAPI(filters.location || "Leavenworth, WA", filters)
      }
    } catch (error) {
      console.error("Error fetching real property data:", error)
    }

    // If both methods fail, use mock data
    if (properties.length === 0) {
      console.log("Using mock data as fallback")
      properties = [...mockProperties]

      // Apply filters to mock data
      if (filters.minPrice) {
        properties = properties.filter((property) => property.price >= filters.minPrice)
      }

      if (filters.maxPrice) {
        properties = properties.filter((property) => property.price <= filters.maxPrice)
      }

      if (filters.minBeds) {
        properties = properties.filter((property) => property.bedrooms >= filters.minBeds)
      }

      if (filters.minBaths) {
        properties = properties.filter((property) => property.bathrooms >= filters.minBaths)
      }

      if (filters.propertyType && filters.propertyType !== "all") {
        properties = properties.filter((property) =>
          property.propertyType.toLowerCase().includes(filters.propertyType.toLowerCase()),
        )
      }
    }

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return NextResponse.json(properties)
  } catch (error) {
    console.error("Error fetching properties:", error)
    return NextResponse.json({ error: "Failed to fetch properties" }, { status: 500 })
  }
}

