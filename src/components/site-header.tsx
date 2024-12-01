import Link from "next/link"
import { Button } from "@/components/ui/button"

export function SiteHeader() {
  return (
    <header className="fixed top-0 z-50 w-full bg-white">
      <div className="flex h-[72px] items-center justify-between px-8 mx-auto">
        <Link href="/" className="flex items-center gap-3">
          <img 
            src="./logo.png" 
            alt="MockMock Logo" 
            className="h-12 w-12 md:h-14 md:w-14" 
          />
          <div className="flex flex-col">
            <span className="text-[18px] md:text-[20px] font-medium text-[#2D2D2D]">MockMock</span>
            <span className="text-[12px] md:text-[14px] text-[#666666]">AI interview Expert</span>
          </div>
        </Link>

        <div className="flex items-center gap-2 md:gap-3">
          <Button 
            variant="outline" 
            className="h-8 md:h-9 rounded-[8px] border-[#E5E7EB] px-3 md:px-4 text-xs md:text-sm font-medium text-[#2D2D2D] hover:bg-gray-50"
            asChild
          >
            <Link href="/sign-in">Sign In</Link>
          </Button>
          <Button 
            className="h-8 md:h-9 rounded-[8px] bg-[#4AE68A] px-3 md:px-4 text-xs md:text-sm font-medium text-white hover:bg-[#3dd17a]"
            asChild
          >
            <Link href="/sign-up">Sign Up</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}

