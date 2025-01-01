"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import useSWRMutation from 'swr/mutation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
// import Image from "next/image"
import { createAccount, login } from "@/services/auth"
import { API_ROUTES } from "@/services/api"
import type { CreateAccountResponse, LoginResponse } from "@/services/types"
import { useToast } from "@/components/hooks/use-toast"

interface AuthLayoutProps {
  mode: 'sign-in' | 'sign-up'
}

export function AuthLayout({ mode }: AuthLayoutProps) {
  const isSignIn = mode === 'sign-in'
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const { toast } = useToast()

  // Initialize SWR mutations
  const { trigger: signupTrigger, isMutating: isSigningUp } = useSWRMutation<CreateAccountResponse>(
    API_ROUTES.CREATE_ACCOUNT,
    createAccount
  )

  const { trigger: loginTrigger, isMutating: isLoggingIn } = useSWRMutation<LoginResponse>(
    API_ROUTES.LOGIN,
    login
  )

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const validatePassword = (password: string) => {
    return password.length >= 6
  }

  const handleSubmit = async () => {
    // Reset all errors
    setEmailError("")
    setPasswordError("")

    // Validate inputs
    let hasError = false

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address")
      hasError = true
    }

    if (!validatePassword(password)) {
      setPasswordError("Password must be at least 6 characters long")
      hasError = true
    }

    if (hasError) return

    try {
      const payload = {
        email: email,
        password: password
      }

      if (isSignIn) {
        // Handle login
        const result = await loginTrigger(payload as any)
        if (result.status) {
          toast({
            description: "Login successful",
          })
          if (result.data?.token && result.data?.email) {
            localStorage.setItem('token', result.data.token)
            localStorage.setItem('email', result.data.email)
          }
          router.push('/dashboard/resume')
        } else {
          toast({
            variant: "destructive",
            title: "Login failed",
            description: result.message || "Invalid credentials"
          })
        }
      } else {
        // Handle signup
        const result = await signupTrigger(payload as any)
        if (result.status) {
          console.log("result", result)
          toast({
            title: "Sign up successful",
            description: result.message || "Please verify your email by using the verification link sent to your email address"
          })
        } else {
          toast({
            variant: "destructive",
            title: "Registration failed",
            description: result.message || "Unable to create account"
          })
        }
      }
    } catch (e) {
      console.log(e)
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred. Please try again later."
      })
    }
  }

  return (
    <div className="flex min-h-screen">
      <div className="flex w-full flex-col justify-center px-4 md:w-1/2 md:px-12 lg:px-16 xl:px-24">
        <div className="mx-auto w-full max-w-[420px]">
          <h1 className="mb-8 text-3xl font-medium text-[#2D2D2D]">
            Welcome to <span className="font-semibold">Mock Interview</span>
          </h1>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Input 
                type="email" 
                placeholder="Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`h-12 rounded-xl bg-[#F8F9FA] px-4 text-base placeholder:text-[#6C757D] ${
                  emailError ? "border-red-500" : ""
                }`}
              />
              {emailError && (
                <p className="text-sm text-red-500">{emailError}</p>
              )}
            </div>

            <div className="space-y-2">
              <Input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`h-12 rounded-xl bg-[#F8F9FA] px-4 text-base placeholder:text-[#6C757D] ${
                  passwordError ? "border-red-500" : ""
                }`}
              />
              {passwordError && (
                <p className="text-sm text-red-500">{passwordError}</p>
              )}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm">
            <Link 
              href={isSignIn ? "/sign-up" : "/sign-in"} 
              className="text-[#2D2D2D] hover:underline"
            >
              {isSignIn ? "Sign up" : "Sign in"}
            </Link>
            <Link href="/forgot-password" className="text-[#2D2D2D] hover:underline">
              Forgot password
            </Link>
          </div>

          <Button 
            className="mt-6 h-12 w-full rounded-xl bg-black text-base font-medium text-white hover:bg-black/90"
            onClick={handleSubmit}
            disabled={isSigningUp || isLoggingIn}
          >
            {isSigningUp || isLoggingIn ? "Loading..." : (isSignIn ? "SIGN IN" : "SIGN UP")}
          </Button>

          <p className="mt-4 text-center text-sm text-[#6C757D]">
            By continuing, you agree to the Mock Interview{" "}
            <Link href="/terms" className="text-[#2D2D2D] hover:underline">
              Terms of Service
            </Link>{" "}
            and the{" "}
            <Link href="/privacy" className="text-[#2D2D2D] hover:underline">
              Privacy Policy
            </Link>
          </p>

          {/* <div className="mt-6 flex items-center justify-center gap-4">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-10 w-10 rounded-full border-[#E5E7EB]"
            >
              <Image
                src="/google.svg"
                alt="Google"
                width={24}
                height={24}
                className="h-6 w-6"
              />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="h-10 w-10 rounded-full border-[#E5E7EB]"
            >
              <Image
                src="/linkedin.svg"
                alt="LinkedIn"
                width={24}
                height={24}
                className="h-6 w-6"
              />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="h-10 w-10 rounded-full border-[#E5E7EB]"
            >
              <Image
                src="/facebook.svg"
                alt="Facebook"
                width={24}
                height={24}
                className="h-6 w-6"
              />
            </Button>
          </div> */}
        </div>
      </div>

      {/* Right Section */}
      <div className="hidden bg-[#F8F9FA] md:flex md:w-1/2">
        <div className="flex flex-col justify-center px-12 lg:px-16 xl:px-24">
          <div className="mb-8 h-[300px] w-full rounded-2xl bg-[#E9ECEF]" />
          <div className="relative">
            <p className="text-xl leading-relaxed text-[#2D2D2D]">
              The mock interview feature is phenomenal. I conducted 10 mock interviews each time before facing the real thing, significantly boosting my confidence.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

