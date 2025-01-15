"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { InterviewTable } from "@/components/dashboard/interview-table"
import { MockInterviewDialog } from "@/components/dashboard/mock-interview-dialog"
import { Video } from 'lucide-react'

export default function InterviewPage() {
  const [filter, setFilter] = useState<"all" | "completed">("completed")
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <div className="h-full p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-medium text-[#2D2D2D]">Interview</h1>
        <Button 
          className="h-9 gap-2 rounded-lg bg-[#4AE68A] px-4 text-sm font-medium text-white hover:bg-[#3dd17a]"
          onClick={() => setDialogOpen(true)}
        >
          <Video className="h-4 w-4" />
          Mock Interview
        </Button>
      </div>

      <div className="mb-6">
        <Button
          variant={filter === "completed" ? "secondary" : "ghost"}
          onClick={() => setFilter("completed")}
          className="rounded-lg px-4 text-sm font-medium"
        >
          Completed
        </Button>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm">
        <InterviewTable />
      </div>
      <MockInterviewDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  )
}

