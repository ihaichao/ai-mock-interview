"use client"

import { useState } from "react"
import Link from "next/link"
import { FileText, Briefcase, Users, User, Settings } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { SettingsDialog } from "./settings-dialog"

const navigation = [
  { name: 'Resume', href: '/dashboard/resume', icon: FileText },
  { name: 'JD', href: '/dashboard/jd', icon: Briefcase },
  { name: 'Interview', href: '/dashboard/interview', icon: Users },
  { name: 'Profile', href: '/dashboard/profile', icon: User },
]

export function Sidebar() {
  const pathname = usePathname()
  const [settingsOpen, setSettingsOpen] = useState(false)

  const isActive = (href: string) => {
    return pathname.startsWith(href)
  }

  return (
    <>
      <div className="flex h-full w-[72px] flex-col border-r bg-white">
        <div className="flex h-[72px] items-center justify-center border-b">
          <img 
            src="/logo.png" 
            alt="MockMock Logo" 
            className="h-10 w-10 rounded-full" 
          />
        </div>
        <nav className="flex-1 space-y-1 py-4">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`
                flex flex-col items-center justify-center gap-1 py-3 text-xs
                ${isActive(item.href)
                  ? 'text-[#4AE68A]' 
                  : 'text-[#6C757D] hover:text-[#4AE68A]'
                }
              `}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="border-t py-4">
          {/* <Link
            href="/dashboard/chat"
            className={`
              flex flex-col items-center justify-center gap-1 py-3 text-xs
              ${isActive('/dashboard/chat') ? 'text-[#4AE68A]' : 'text-[#6C757D] hover:text-[#4AE68A]'}
            `}
          >
            <MessageSquare className="h-5 w-5" />
            Chat
          </Link> */}
          <button
            onClick={() => setSettingsOpen(true)}
            className={`
              w-full flex flex-col items-center justify-center gap-1 py-3 text-xs
              text-[#171818] hover:text-[#4AE68A]
            `}
          >
            <Settings className="h-5 w-5" />
            Settings
          </button>
        </div>
      </div>
      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  )
}

