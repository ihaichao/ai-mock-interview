import { Button } from "@/components/ui/button"
import { Sidebar } from "@/components/dashboard/sidebar"
import { JDTable } from "@/components/dashboard/jd-table"
import { Plus } from 'lucide-react'

export default function JDPage() {
  return (
    <div className="flex h-screen bg-[#F8F9FA]">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="h-full p-8">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-medium text-[#2D2D2D]">Job information.</h1>
            <Button className="h-9 gap-2 rounded-lg bg-[#4AE68A] px-4 text-sm font-medium text-white hover:bg-[#3dd17a]">
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <JDTable />
          </div>
        </div>
      </main>
    </div>
  )
}

