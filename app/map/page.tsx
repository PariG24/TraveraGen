"use client"

import Image from "next/image"
import { Home, FolderKanban, Map } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import dynamic from "next/dynamic"

const WorldMap = dynamic(() => import("@/components/world-map"), { ssr: false })

export default function MapPage() {
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
        <WorldMap />
      </main>
    </div>
  )
}