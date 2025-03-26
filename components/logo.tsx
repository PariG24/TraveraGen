import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
}

export default function Logo({ className }: LogoProps) {
  return (
    <div className={cn("relative w-full max-w-[600px]", className)}>
      <h1 className="text-[#006699] text-6xl md:text-7xl lg:text-8xl font-serif tracking-wide">
        TR
        <span className="relative inline-block">
          A
          <svg
            className="absolute -top-1/4 left-1/2 -translate-x-1/2 w-full h-full text-[#006699]"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M21 14.5L14.5 21L8 14.5L14.5 8L21 14.5Z" transform="rotate(-45 14.5 14.5)" />
            <path d="M3 21V19H21V21H3Z" />
          </svg>
        </span>
        VERA
      </h1>
    </div>
  )
}

