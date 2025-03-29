"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Home, FolderKanban, Map, ExternalLink, Search, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { fetchLocations } from "@/data/locations"  // Importing the function that fetches locations
import { Location } from "../../components/world-map";

export default function FoldersPage() {
  const [locations, setLocations] = useState<Location[]>([])  // Correctly typing the state
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  // Fetch locations when the component mounts
  useEffect(() => {
    const getLocations = async () => {
      try {
        const fetchedLocations = await fetchLocations() // Fetch locations from Supabase
        setLocations(fetchedLocations)
      } catch (error) {
        console.error("Error fetching locations:", error)
      }
    }

    getLocations()
  }, [])

  //.reduce
  //.forEach

  // Group locations by country
  const groupedLocations = locations.reduce((acc, location) => {
    if (location.Country) {
      if (!acc[location.Country]) {
        acc[location.Country] = []
      }
      acc[location.Country].push(location)
    }
    return acc
  }, {} as Record<string, Location[]>)

  // Filter locations based on search term and selected country
  const filteredLocations = selectedCountry
    ? groupedLocations[selectedCountry].filter((location) => {
        const searchLower = searchTerm.toLowerCase()
        return (
          location.Location_Name?.toLowerCase().includes(searchLower) ||
          location.Address?.toLowerCase().includes(searchLower) ||
          location.Country?.toLowerCase().includes(searchLower)
        )
      })
    : []

  const handleCountryClick = (country: string) => {
    setSelectedCountry(country)
    setSearchTerm("")
  }

  const handleBackClick = () => {
    setSelectedCountry(null)
    setSearchTerm("")
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex-1">{/* Placeholder for alignment */}</div>
          <div className="flex-1 flex justify-center">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Travera%20Posts-BizabT9jr3GKZSyM2mvkarIUWMG2zp.png"
              alt="Travera Logo"
              width={200}
              height={60}
              priority
            />
          </div>
          <div className="flex-1 flex justify-end gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/">
                <Home className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/folders">
                <FolderKanban className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/map">
                <Map className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {selectedCountry ? (
          <div>
            <Button variant="ghost" className="mb-4 pl-0" onClick={handleBackClick}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Countries
            </Button>
            <h1 className="text-2xl font-bold mb-6">{selectedCountry}</h1>
            <div className="mb-4 relative">
              <Input
                type="text"
                placeholder={`Search locations, addresses, or states in ${selectedCountry}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
            {filteredLocations.length > 0 ? (
              <div className="grid gap-4">
                {filteredLocations.map((location) => (
                  <div key={location.id} className="border rounded-lg p-4 shadow-sm">
                    <h3 className="text-lg font-semibold mb-2">{location.Location_Name}</h3>
                    <p className="text-gray-600 mb-2">{location.Address}</p>
                    <a
                      href={location.URL ?? ''}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline flex items-center gap-1"
                    >
                      View on Instagram <ExternalLink size={16} />
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No locations found for your search.</p>
            )}
          </div>
        ) : (
          <div>
            <h1 className="text-2xl font-bold mb-6">Your Saved Locations</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.keys(groupedLocations).map((country) => (
                <button
                  key={country}
                  className="border rounded-lg p-6 text-left hover:bg-gray-50 transition-colors"
                  onClick={() => handleCountryClick(country)}
                >
                  <h2 className="text-xl font-semibold mb-2">{country}</h2>
                  <p className="text-gray-600">{groupedLocations[country].length} locations</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
