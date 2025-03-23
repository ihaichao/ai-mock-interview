"use client"

import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { useToast } from "@/components/hooks/use-toast"
import { forgotPassword } from "@/services/api"

// 定义表单验证模式
const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
})

type FormData = z.infer<typeof formSchema>

interface ResetPasswordDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultEmail?: string
}

export function ResetPasswordDialog({ open, onOpenChange, defaultEmail = "" }: ResetPasswordDialogProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)

  // 初始化表单
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: defaultEmail,
    },
  })

  // 表单提交处理
  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    
    try {
      const response = await forgotPassword(data.email)
      
      if (response.status) {
        setIsEmailSent(true)
        toast({
          title: "Email sent",
          description: "Please check your email for the password reset link.",
        })
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: response.message || "Failed to send reset email. Please try again.",
        })
      }
    } catch (error) {
      console.error("Error sending reset email:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send reset email. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // 关闭弹框时重置状态
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setIsEmailSent(false)
      form.reset({ email: defaultEmail })
    }
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-[400px] p-6">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-medium text-[#2D2D2D]">
            Reset Password
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          {!isEmailSent ? (
            <>
              <p className="mb-4 text-center text-sm text-[#6C757D]">
                Fill in your email and we will send you the verification code for resetting your password.
              </p>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Email"
                            className="h-12 rounded-lg bg-[#F8F9FA] px-4"
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage className="text-xs text-red-500" />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full rounded-lg bg-black py-6 text-white hover:bg-gray-800"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "SENDING..." : "SEND"}
                  </Button>
                </form>
              </Form>
            </>
          ) : (
            <div className="rounded-lg border border-green-100 bg-green-50 p-4 text-center">
              <p className="text-sm text-green-700">
                We've sent a verification code to your email. Please check your inbox and follow the instructions to reset your password.
              </p>
              <Button
                className="mt-4 w-full rounded-lg bg-black py-3 text-white hover:bg-gray-800"
                onClick={() => handleOpenChange(false)}
              >
                CLOSE
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
} 