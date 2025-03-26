"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ResumeTable } from "@/components/dashboard/resume-table"
import { UploadDialog } from "@/components/dashboard/upload-dialog"
import { Upload, Link2, Plus } from 'lucide-react'

export default function ResumePage() {
  const [uploadOpen, setUploadOpen] = useState(false)
  const router = useRouter()

  return (
    <div className="h-full p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-medium text-[#2D2D2D]">Resume</h1>
        <div className="flex items-center gap-3">
          <Button 
            onClick={() => setUploadOpen(true)}
            className="h-9 gap-2 rounded-lg bg-[#4AE68A] px-4 text-sm font-medium text-white hover:bg-[#3dd17a]"
          >
            <Upload className="h-4 w-4" />
            Upload
          </Button>
          <Button variant="outline" className="h-9 gap-2 rounded-lg border-[#E5E7EB] px-4 text-sm font-medium text-[#2D2D2D]">
            <Link2 className="h-4 w-4" />
            URL
          </Button>
          <Button 
            variant="outline" 
            className="h-9 gap-2 rounded-lg border-[#E5E7EB] px-4 text-sm font-medium text-[#2D2D2D]"
            onClick={() => router.push('/dashboard/resume/create')}
          >
            <Plus className="h-4 w-4" />
            Create
          </Button>
        </div>
      </div>
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <ResumeTable />
      </div>
      <UploadDialog open={uploadOpen} onOpenChange={setUploadOpen} />
    </div>
  )
}

