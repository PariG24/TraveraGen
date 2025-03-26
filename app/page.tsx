import Image from "next/image"
import { Home, FolderKanban, Map } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Instagram } from "lucide-react" // Import Instagram icon from lucide-react

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex-1 flex justify-start">
            <Button variant="ghost" size="icon" asChild>
              <Link href="https://www.instagram.com/travera_travel?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==">
                <Instagram className="h-5 w-5" />
              </Link>
            </Button>
          </div>
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
        <div className="max-w-2xl mx-auto space-y-4 text-center">
          <h1 className="text-3xl font-bold mb-4">Hi User, Welcome to Travera!</h1>
          <p className="text-lg mb-4">
            Check out the folders page to see your saved locations and map to see what places you're close to.
          </p>
          <p className="text-lg mb-4">
            Reach out to{" "}
            <a href="mailto:traverateam@gmail.com" className="text-blue-600 hover:underline">
              traverateam@gmail.com
            </a>{" "}
            for questions or recommendations!
          </p>
          <p className="text-lg font-semibold">Enjoy and we hope you get to visit your saved locations soon!</p>
        </div>
      </main>
    </div>
  )
}