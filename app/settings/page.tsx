"use client"

import { useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pencil, Trash, Plus } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface SavedSearch {
  id: string
  name: string
  location: string
  propertyType: string
  minPrice: number
  maxPrice: number
  minBeds: number
  minBaths: number
}

export default function SettingsPage() {
  const { toast } = useToast()
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([
    {
      id: "1",
      name: "Leavenworth Homes",
      location: "Leavenworth, WA",
      propertyType: "Single Family",
      minPrice: 0,
      maxPrice: 500000,
      minBeds: 2,
      minBaths: 1,
    },
    {
      id: "2",
      name: "Seattle Condos",
      location: "Seattle, WA",
      propertyType: "Condo",
      minPrice: 200000,
      maxPrice: 600000,
      minBeds: 1,
      minBaths: 1,
    },
  ])

  const [editingSearch, setEditingSearch] = useState<SavedSearch | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [newSearch, setNewSearch] = useState<Omit<SavedSearch, "id">>({
    name: "",
    location: "",
    propertyType: "",
    minPrice: 0,
    maxPrice: 500000,
    minBeds: 1,
    minBaths: 1,
  })

  const handleDelete = (id: string) => {
    setSavedSearches(savedSearches.filter((search) => search.id !== id))
    toast({
      title: "Search deleted",
      description: "Your saved search has been deleted.",
    })
  }

  const handleEdit = (search: SavedSearch) => {
    setEditingSearch(search)
  }

  const handleSaveEdit = () => {
    if (editingSearch) {
      setSavedSearches(savedSearches.map((search) => (search.id === editingSearch.id ? editingSearch : search)))
      setEditingSearch(null)
      toast({
        title: "Search updated",
        description: "Your saved search has been updated.",
      })
    }
  }

  const handleAdd = () => {
    const id = Math.random().toString(36).substring(2, 9)
    setSavedSearches([...savedSearches, { id, ...newSearch }])
    setIsAdding(false)
    setNewSearch({
      name: "",
      location: "",
      propertyType: "",
      minPrice: 0,
      maxPrice: 500000,
      minBeds: 1,
      minBaths: 1,
    })
    toast({
      title: "Search added",
      description: "Your new search has been saved.",
    })
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Saved Searches</CardTitle>
            <CardDescription>Manage your saved property search criteria</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Property Type</TableHead>
                  <TableHead>Price Range</TableHead>
                  <TableHead>Beds/Baths</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {savedSearches.map((search) => (
                  <TableRow key={search.id}>
                    <TableCell>{search.name}</TableCell>
                    <TableCell>{search.location}</TableCell>
                    <TableCell>{search.propertyType}</TableCell>
                    <TableCell>
                      ${search.minPrice.toLocaleString()} - ${search.maxPrice.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {search.minBeds}+ beds, {search.minBaths}+ baths
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(search)}>
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(search.id)}>
                        <Trash className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {!isAdding && (
              <Button className="mt-4" variant="outline" onClick={() => setIsAdding(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add New Search
              </Button>
            )}

            {isAdding && (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Add New Search</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Search Name</Label>
                        <Input
                          id="name"
                          value={newSearch.name}
                          onChange={(e) => setNewSearch({ ...newSearch, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={newSearch.location}
                          onChange={(e) =>
                            setNewSearch({
                              ...newSearch,
                              location: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="property-type">Property Type</Label>
                      <Input
                        id="property-type"
                        value={newSearch.propertyType}
                        onChange={(e) =>
                          setNewSearch({
                            ...newSearch,
                            propertyType: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="min-price">Min Price</Label>
                        <Input
                          id="min-price"
                          type="number"
                          value={newSearch.minPrice}
                          onChange={(e) =>
                            setNewSearch({
                              ...newSearch,
                              minPrice: Number.parseInt(e.target.value),
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="max-price">Max Price</Label>
                        <Input
                          id="max-price"
                          type="number"
                          value={newSearch.maxPrice}
                          onChange={(e) =>
                            setNewSearch({
                              ...newSearch,
                              maxPrice: Number.parseInt(e.target.value),
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="min-beds">Min Beds</Label>
                        <Input
                          id="min-beds"
                          type="number"
                          value={newSearch.minBeds}
                          onChange={(e) =>
                            setNewSearch({
                              ...newSearch,
                              minBeds: Number.parseInt(e.target.value),
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="min-baths">Min Baths</Label>
                        <Input
                          id="min-baths"
                          type="number"
                          step="0.5"
                          value={newSearch.minBaths}
                          onChange={(e) =>
                            setNewSearch({
                              ...newSearch,
                              minBaths: Number.parseFloat(e.target.value),
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => setIsAdding(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAdd}>Save</Button>
                </CardFooter>
              </Card>
            )}

            {editingSearch && (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Edit Search</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-name">Search Name</Label>
                        <Input
                          id="edit-name"
                          value={editingSearch.name}
                          onChange={(e) =>
                            setEditingSearch({
                              ...editingSearch,
                              name: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-location">Location</Label>
                        <Input
                          id="edit-location"
                          value={editingSearch.location}
                          onChange={(e) =>
                            setEditingSearch({
                              ...editingSearch,
                              location: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-property-type">Property Type</Label>
                      <Input
                        id="edit-property-type"
                        value={editingSearch.propertyType}
                        onChange={(e) =>
                          setEditingSearch({
                            ...editingSearch,
                            propertyType: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-min-price">Min Price</Label>
                        <Input
                          id="edit-min-price"
                          type="number"
                          value={editingSearch.minPrice}
                          onChange={(e) =>
                            setEditingSearch({
                              ...editingSearch,
                              minPrice: Number.parseInt(e.target.value),
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-max-price">Max Price</Label>
                        <Input
                          id="edit-max-price"
                          type="number"
                          value={editingSearch.maxPrice}
                          onChange={(e) =>
                            setEditingSearch({
                              ...editingSearch,
                              maxPrice: Number.parseInt(e.target.value),
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-min-beds">Min Beds</Label>
                        <Input
                          id="edit-min-beds"
                          type="number"
                          value={editingSearch.minBeds}
                          onChange={(e) =>
                            setEditingSearch({
                              ...editingSearch,
                              minBeds: Number.parseInt(e.target.value),
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-min-baths">Min Baths</Label>
                        <Input
                          id="edit-min-baths"
                          type="number"
                          step="0.5"
                          value={editingSearch.minBaths}
                          onChange={(e) =>
                            setEditingSearch({
                              ...editingSearch,
                              minBaths: Number.parseFloat(e.target.value),
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => setEditingSearch(null)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveEdit}>Save Changes</Button>
                </CardFooter>
              </Card>
            )}
          </CardContent>
        </Card>
      </main>
      <SiteFooter />
    </div>
  )
}

