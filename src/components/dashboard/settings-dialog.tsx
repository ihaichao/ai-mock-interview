"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { LogOut } from 'lucide-react'
import { useAuth } from "@/hooks/useAuth"
import { useToast } from "@/components/hooks/use-toast"
import { ResetPasswordDialog } from "./reset-password-dialog"

interface SettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const router = useRouter()
  const { logout } = useAuth()
  const { toast } = useToast()
  const [email, setEmail] = useState<string>("")
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false)

  // Safely access localStorage only on the client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      setEmail(localStorage.getItem("email") || "")
    }
  }, [])

  const handleLogout = () => {
    logout()
    onOpenChange(false)
    toast({
      title: "Logged out",
      description: "You have been successfully logged out."
    })
  }

  const handlePrivacyPolicy = () => {
    onOpenChange(false) // 关闭设置对话框
    router.push('/privacy-policy') // 跳转到隐私协议页面
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[800px] p-6">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle className="text-xl font-medium text-[#2D2D2D]">Settings</DialogTitle>
          </DialogHeader>

          <div className="mt-6 space-y-6">
            {/* Email Section */}
            <div className="space-y-2">
              <h3 className="text-base font-medium text-[#2D2D2D]">Email</h3>
              <p className="text-[#6C757D]">{email}</p>
            </div>

            {/* Password Section */}
            <div className="flex items-center justify-between">
              <h3 className="text-base font-medium text-[#2D2D2D]">Password</h3>
              <Button 
                variant="outline" 
                className="h-9 rounded-lg border-[#E5E7EB] px-4 text-sm font-medium text-[#2D2D2D]"
                onClick={() => setResetPasswordOpen(true)}
              >
                Reset password
              </Button>
            </div>

            {/* Privacy Policy Section */}
            <div className="flex items-center justify-between">
              <h3 className="text-base font-medium text-[#2D2D2D]">Privacy policy</h3>
              <Button 
                variant="outline" 
                className="h-9 rounded-lg border-[#E5E7EB] px-4 text-sm font-medium text-[#2D2D2D]"
                onClick={handlePrivacyPolicy}
              >
                Privacy policy
              </Button>
            </div>

            {/* Delete Account Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-medium text-[#2D2D2D]">Delete my account</h3>
                <Button 
                  variant="outline" 
                  className="h-9 rounded-lg border-[#E5E7EB] px-4 text-sm font-medium text-[#2D2D2D]"
                >
                  Delete account
                </Button>
              </div>
              <p className="text-sm text-[#6C757D]">Delete your account and all associated data</p>
            </div>

            {/* Log Out Button */}
            <Button 
              variant="outline" 
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-full border-[#E5E7EB] py-6 text-base font-medium text-[#2D2D2D]"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              Log out
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <ResetPasswordDialog 
        open={resetPasswordOpen} 
        onOpenChange={setResetPasswordOpen}
        defaultEmail={email}
      />
    </>
  )
}

