import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import Image from "next/image"

interface AuthLayoutProps {
  mode: 'sign-in' | 'sign-up'
}

export function AuthLayout({ mode }: AuthLayoutProps) {
  const isSignIn = mode === 'sign-in'
  
  return (
    <div className="flex min-h-screen">
      {/* Left Section */}
      <div className="flex w-full flex-col justify-center px-4 md:w-1/2 md:px-12 lg:px-16 xl:px-24">
        <div className="mx-auto w-full max-w-[420px]">
          <h1 className="mb-8 text-3xl font-medium text-[#2D2D2D]">
            Welcome to <span className="font-semibold">Mock Interview</span>
          </h1>
          
          <div className="space-y-4">
            <Input 
              type="email" 
              placeholder="Email" 
              className="h-12 rounded-xl bg-[#F8F9FA] px-4 text-base placeholder:text-[#6C757D]" 
            />
            <Input 
              type="password" 
              placeholder="Password" 
              className="h-12 rounded-xl bg-[#F8F9FA] px-4 text-base placeholder:text-[#6C757D]" 
            />
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

          <Button className="mt-6 h-12 w-full rounded-xl bg-black text-base font-medium text-white hover:bg-black/90">
            {isSignIn ? "SIGN IN" : "SIGN UP"}
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

          <div className="mt-6 flex items-center justify-center gap-4">
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
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="hidden bg-[#F8F9FA] md:flex md:w-1/2">
        <div className="flex flex-col justify-center px-12 lg:px-16 xl:px-24">
          <div className="mb-8 h-[300px] w-full rounded-2xl bg-[#E9ECEF]" />
          <div className="relative">
            <div className="absolute -left-6 top-0 text-[80px] leading-none text-[#E9ECEF]">
              "
            </div>
            <p className="text-xl leading-relaxed text-[#2D2D2D]">
              The mock interview feature is phenomenal. I conducted 10 mock interviews each time before facing the real thing, significantly boosting my confidence.
            </p>
            <div className="mt-6">
              <p className="font-medium text-[#2D2D2D]">Emily J.</p>
              <p className="text-[#6C757D]">Account Executive</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

