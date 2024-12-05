"use client"

import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { MapPin, Phone, Mail, LinkIcon } from 'lucide-react'

export default function CreateResumePage() {
  const router = useRouter()

  const handleCancel = () => {
    router.push('/dashboard/resume')
  }

  const handleSave = () => {
    // Implement save functionality here
    console.log("Save button clicked")
  }

  return (
    <div className="flex h-screen bg-[#F8F9FA]">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="h-full p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-medium text-[#2D2D2D]">create resume</h1>
          </div>
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <form className="space-y-8">
              {/* Basic Information */}
              <div className="space-y-4">
                <Input 
                  placeholder="Name" 
                  className="h-12 rounded-xl bg-[#F8F9FA] px-4 text-base placeholder:text-[#6C757D]"
                />
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div className="relative">
                    <MapPin className="absolute left-4 top-3.5 h-5 w-5 text-[#6C757D]" />
                    <Input 
                      placeholder="Location" 
                      className="h-12 rounded-xl bg-[#F8F9FA] pl-12 pr-4 text-base placeholder:text-[#6C757D]"
                    />
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-4 top-3.5 h-5 w-5 text-[#6C757D]" />
                    <Input 
                      placeholder="Phone" 
                      className="h-12 rounded-xl bg-[#F8F9FA] pl-12 pr-4 text-base placeholder:text-[#6C757D]"
                    />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-4 top-3.5 h-5 w-5 text-[#6C757D]" />
                    <Input 
                      placeholder="Email" 
                      className="h-12 rounded-xl bg-[#F8F9FA] pl-12 pr-4 text-base placeholder:text-[#6C757D]"
                    />
                  </div>
                  <div className="relative">
                    <LinkIcon className="absolute left-4 top-3.5 h-5 w-5 text-[#6C757D]" />
                    <Input 
                      placeholder="Linkedin or MaiMaiUrl" 
                      className="h-12 rounded-xl bg-[#F8F9FA] pl-12 pr-4 text-base placeholder:text-[#6C757D]"
                    />
                  </div>
                </div>
              </div>

              {/* Personal Introduction */}
              <div className="space-y-4">
                <h2 className="text-lg font-medium text-[#2D2D2D]">Personal Introduction</h2>
                <Textarea 
                  className="min-h-[120px] rounded-xl bg-[#F8F9FA] p-4 text-base placeholder:text-[#6C757D]"
                />
              </div>

              {/* Work Experience */}
              <div className="space-y-4">
                <h2 className="text-lg font-medium text-[#2D2D2D]">Work Experience</h2>
                <div className="space-y-4">
                  <Input 
                    placeholder="Company" 
                    className="h-12 rounded-xl bg-[#F8F9FA] px-4 text-base placeholder:text-[#6C757D]"
                  />
                  <div className="flex items-center gap-4">
                    <Input 
                      placeholder="Date" 
                      className="h-12 rounded-xl bg-[#F8F9FA] px-4 text-base placeholder:text-[#6C757D]"
                    />
                    <div className="flex h-12 w-12 items-center justify-center">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 12H19" stroke="#6C757D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 5L19 12L12 19" stroke="#6C757D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <Input 
                      placeholder="Date" 
                      className="h-12 rounded-xl bg-[#F8F9FA] px-4 text-base placeholder:text-[#6C757D]"
                    />
                  </div>
                  <Input 
                    placeholder="Job title" 
                    className="h-12 rounded-xl bg-[#F8F9FA] px-4 text-base placeholder:text-[#6C757D]"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className="h-10 px-6 rounded-lg border-[#E5E7EB] text-sm font-medium text-[#2D2D2D]"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  className="h-10 px-6 rounded-lg bg-[#4AE68A] text-sm font-medium text-white hover:bg-[#3dd17a]"
                >
                  Save
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}

