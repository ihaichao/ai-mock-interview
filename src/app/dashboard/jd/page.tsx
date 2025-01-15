"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { JDTable } from "@/components/dashboard/jd-table"
import { AddJobDialog } from "@/components/dashboard/add-job-dialog"
import { Plus } from 'lucide-react'

export default function JDPage() {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <div className="h-full p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-medium text-[#2D2D2D]">Job information.</h1>
        <Button 
          className="h-9 gap-2 rounded-lg bg-[#4AE68A] px-4 text-sm font-medium text-white hover:bg-[#3dd17a]"
          onClick={() => setDialogOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Add
        </Button>
      </div>
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <JDTable />
      </div>
      <AddJobDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  )
}

