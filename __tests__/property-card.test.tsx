import { render, screen } from "@testing-library/react"
import { PropertyCard } from "@/components/property-card"

// Mock the property data
const mockProperty = {
  id: "1",
  address: "123 Test St, Leavenworth, WA",
  location: "Leavenworth, WA",
  price: 450000,
  propertyType: "Single Family",
  bedrooms: 3,
  bathrooms: 2,
  squareFootage: 1800,
  yearBuilt: 2005,
  propertyTax: 3600,
  hoaFee: 0,
  imageUrl: "/placeholder.svg",
  listingUrl: "https://www.zillow.com/test",
}

// Mock the next/image component
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    return <img {...props} />
  },
}))

describe("PropertyCard", () => {
  it("renders property information correctly", () => {
    render(<PropertyCard property={mockProperty} />)

    // Check if the address is displayed
    expect(screen.getByText(mockProperty.address)).toBeInTheDocument()

    // Check if the price is displayed
    expect(screen.getByText(`$${mockProperty.price.toLocaleString()}`)).toBeInTheDocument()

    // Check if the property type is displayed
    expect(screen.getByText(mockProperty.propertyType)).toBeInTheDocument()

    // Check if the bedrooms and bathrooms are displayed
    expect(screen.getByText(`${mockProperty.bedrooms} beds`)).toBeInTheDocument()
    expect(screen.getByText(`${mockProperty.bathrooms} baths`)).toBeInTheDocument()

    // Check if the square footage is displayed
    expect(screen.getByText(`${mockProperty.squareFootage.toLocaleString()} sqft`)).toBeInTheDocument()

    // Check if the "View on Zillow" link is present
    const zillowLink = screen.getByText("View on Zillow")
    expect(zillowLink.toBeInTheDocument()\
    expect(zillowLink.closest('a')).toHaveAttribute('href', mockProperty.listingUrl)
  })
})

