"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { getUserProfile } from "@/services/api"
import { UserProfile } from "@/services/types"
import { useToast } from "@/components/hooks/use-toast"
import { LoadingIndicator } from "@/components/ui/loading-indicator"

export default function ProfilePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await getUserProfile()
        if (response.status && response.data) {
          setProfile(response.data)
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: response.message || "Failed to load profile"
          })
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "An error occurred while fetching profile"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [toast])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingIndicator message="Loading profile..." />
      </div>
    )
  }

  return (
    <div className="h-full p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-medium text-[#2D2D2D]">Profile</h1>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm">
        {/* Profile Section */}
        <div className="mb-8 flex items-center gap-6">
          <div className="flex h-[120px] w-[120px] items-center justify-center rounded-full bg-[#E7FAF0] text-4xl font-medium text-[#4AE68A]">
            {profile?.username?.charAt(0) || profile?.email?.charAt(0) || "U"}
          </div>
          <div>
            <div className="mb-2 flex items-center gap-3">
              <h2 className="text-2xl font-medium text-[#2D2D2D]">
                {profile?.username || "User"}
              </h2>
              <Badge variant="secondary" className="rounded-md bg-[#E7FAF0] text-[#4AE68A]">
                {profile?.isMember ? "Pro" : "Free"}
              </Badge>
            </div>
            <p className="text-[#6C757D]">{profile?.email}</p>
          </div>
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

