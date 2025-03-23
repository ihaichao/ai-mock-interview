"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { useToast } from "@/components/hooks/use-toast"
import Link from "next/link"
import { forgotPassword } from "@/services/api"

// 定义表单验证模式
const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
})

type FormData = z.infer<typeof formSchema>

export default function ForgotPasswordPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)

  // 初始化表单
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
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

  return (
    <div className="flex min-h-screen">
      {/* Left Section */}
      <div className="flex w-full flex-col justify-center px-4 md:w-1/2 md:px-8 lg:px-12 xl:px-20">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8">
            <div className="mb-6 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="5" y="11" width="14" height="10" rx="2" stroke="#000000" strokeWidth="2"/>
                  <path d="M12 16V14" stroke="#000000" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M16 11V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V11" stroke="#000000" strokeWidth="2"/>
                </svg>
              </div>
            </div>
            
            <h1 className="mb-2 text-center text-2xl font-bold text-[#2D2D2D]">Forgot Password</h1>
            <p className="text-center text-sm text-[#6C757D]">
              Fill in your email and we will send you the verification code for resetting your password.
            </p>
          </div>

          {!isEmailSent ? (
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
          ) : (
            <div className="rounded-lg border border-green-100 bg-green-50 p-4 text-center">
              <p className="text-sm text-green-700">
                We've sent a verification code to your email. Please check your inbox and follow the instructions to reset your password.
              </p>
              <Button
                className="mt-4 w-full rounded-lg bg-black py-6 text-white hover:bg-gray-800"
                onClick={() => router.push('/sign-in')}
              >
                RETURN TO SIGN IN
              </Button>
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-[#6C757D]">
              Remember your password?{" "}
              <Link href="/sign-in" className="font-medium text-[#2D2D2D] hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="hidden bg-[#F8F9FA] md:flex md:w-1/2">
        <div className="flex flex-col justify-center px-12 lg:px-16 xl:px-24">
          <img src="/signup.jpg" alt="" className="w-full rounded-xl" />
        </div>
      </div>
    </div>
  )
} 