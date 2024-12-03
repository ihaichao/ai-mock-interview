import { Button } from "@/components/ui/button"
import { Sidebar } from "@/components/dashboard/sidebar"
import { ResumeTable } from "@/components/dashboard/resume-table"
import { Upload, Link2, Plus } from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="flex h-screen bg-[#F8F9FA]">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="h-full p-8">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-medium text-[#2D2D2D]">resume</h1>
            <div className="flex items-center gap-3">
              <Button className="h-9 gap-2 rounded-lg bg-[#4AE68A] px-4 text-sm font-medium text-white hover:bg-[#3dd17a]">
                <Upload className="h-4 w-4" />
                Upload
              </Button>
              <Button variant="outline" className="h-9 gap-2 rounded-lg border-[#E5E7EB] px-4 text-sm font-medium text-[#2D2D2D]">
                <Link2 className="h-4 w-4" />
                URL
              </Button>
              <Button variant="outline" className="h-9 gap-2 rounded-lg border-[#E5E7EB] px-4 text-sm font-medium text-[#2D2D2D]">
                <Plus className="h-4 w-4" />
                Create
              </Button>
            </div>
          </div>
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <ResumeTable />
          </div>
        </div>
      </main>
    </div>
  )
}

