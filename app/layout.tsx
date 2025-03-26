import { Toaster } from "sonner"
import "@/app/globals.css"
import type React from "react"
import { Poppins } from "next/font/google"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="font-poppins">
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  )
}



import './globals.css'