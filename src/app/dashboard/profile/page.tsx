"use client"

import { useRouter } from "next/navigation"
import { SubscriptionTable } from "@/components/dashboard/subscription-table"
import { Badge } from "@/components/ui/badge"

export default function ProfilePage() {
  const router = useRouter()

  return (
    <div className="h-full p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-medium text-[#2D2D2D]">Profile</h1>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm">
        {/* Profile Section */}
        <div className="mb-8 flex items-center gap-6">
          {/* <img
            src="https://kzmkgmfxtdfapl5x3wog.lite.vusercontent.net/placeholder.svg?height=120&width=120"
            alt="Profile"
            className="h-[120px] w-[120px] rounded-full object-cover"
          /> */}
          <div>
            <div className="mb-2 flex items-center gap-3">
              <h2 className="text-2xl font-medium text-[#2D2D2D]">Echo Li</h2>
              <Badge variant="secondary" className="rounded-md bg-[#E7FAF0] text-[#4AE68A]">
                Essential
              </Badge>
            </div>
            <p className="text-[#6C757D]">137463894343@gmail.com</p>
          </div>
        </div>

        {/* Subscription Records */}
        <div>
          <h3 className="mb-4 text-lg font-medium text-[#2D2D2D]">Subscription records</h3>
          <SubscriptionTable />
        </div>

        {/* Upgrade Section */}
        <div className="mt-6">
          <button 
            className="w-full group"
            onClick={() => router.push('/dashboard/payment')}
          >
            <div className="flex items-center justify-between rounded-xl bg-[#E7FAF0] p-6 transition-colors hover:bg-[#d8f5e5]">
              <span className="text-lg text-[#2D2D2D]">
                Upgrade for free mock interviews and experience the AI magic of Mock Mock.
              </span>
              <div className="rounded-full bg-white p-2 shadow-sm transition-transform group-hover:translate-x-1">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 18L15 12L9 6" stroke="#2D2D2D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

