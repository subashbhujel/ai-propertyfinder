import { PropertySearch } from "@/components/property-search"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">Investment Property Analyzer</h1>
        <PropertySearch />
      </main>
      <SiteFooter />
    </div>
  )
}

