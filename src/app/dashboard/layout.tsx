import { Sidebar } from "@/components/dashboard/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-[#F8F9FA]">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
} 