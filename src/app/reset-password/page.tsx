"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/hooks/use-toast"
import { resetPassword } from "@/services/api"
import Link from "next/link"
import { LoadingIndicator } from "@/components/ui/loading-indicator"

// 创建一个内部组件来处理重置密码的逻辑
function ResetPasswordForm() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!token) {
      toast({
        variant: "destructive",
        title: "Invalid Reset Link",
        description: "The password reset link is invalid or has expired. Please request a new one.",
      })
      return
    }

    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords Don't Match",
        description: "Please make sure both passwords match.",
      })
      return
    }

    try {
      setIsSubmitting(true)
      const result = await resetPassword({
        token,
        newPassword: password
      })

      if (result.status) {
        toast({
          title: "Password Reset Successful",
          description: "Your password has been reset successfully. Please login with your new password.",
        })
        router.push('/sign-in')
      } else {
        toast({
          variant: "destructive",
          title: "Reset Failed",
          description: result.message || "Failed to reset password. Please try again.",
        })
      }
    } catch (error) {
      console.error('Reset password error:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while resetting your password. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8F9FA] p-4">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-sm">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Reset Password</h1>
          <p className="text-sm text-gray-500">
            Enter your new password below
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              New Password
            </label>
            <Input
              type="password"
              placeholder="Enter your new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Confirm Password
            </label>
            <Input
              type="password"
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full rounded-lg bg-black py-6 text-white hover:bg-gray-800"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Resetting..." : "Reset Password"}
          </Button>
        </form>

        <div className="text-center text-sm">
          <Link 
            href="/sign-in" 
            className="text-[#2D2D2D] hover:underline"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  )
}

// 主组件使用 Suspense 包装表单组件
export default function ResetPassword() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <LoadingIndicator message="Loading..." /> 
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  )
} 