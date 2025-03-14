"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"

export function HeroSection() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()

  const handleActivateClick = () => {
    if (isAuthenticated) {
      router.push('/dashboard/resume')
    } else {
      router.push('/sign-in')
    }
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-white to-[#E5FFFF]">
      <div className="px-40 mx-auto flex min-h-screen flex-col-reverse items-center gap-8 md:gap-16 pt-[100px] lg:flex-row lg:gap-12">
        <div className="flex w-full lg:w-1/2 flex-col items-start">
          <h1 className="mb-4 text-[32px] md:text-[48px] font-medium leading-[1.2] tracking-[-0.02em] text-[#2D2D2D]">
            Unlock Your Interview{"\n"}
            Superpowers with AI,{"\n"}
            Your AI Interview Expert
          </h1>
          <p className="mb-6 md:mb-8 text-base md:text-lg leading-relaxed text-[#666666]">
            AI interview expert generating actionable guidance for interviews{"\n"}
            in real-time
          </p>
          <Button 
            size="lg"
            className="h-10 md:h-12 rounded-xl bg-[#4AE68A] px-4 md:px-6 text-sm md:text-base font-medium text-white hover:bg-[#3dd17a]"
            onClick={handleActivateClick}
          >
            Activate AI Interview Mode Now
          </Button>
        </div>
        
        <div className="w-full lg:w-1/2">
          <div className="overflow-hidden rounded-2xl bg-white p-2 md:p-4 shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
            <img
              src="/home.jpg"
              alt="AI Interview Interface"
              className="w-full rounded-xl"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

