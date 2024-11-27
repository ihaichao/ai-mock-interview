import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function LoginPage() {
  return (
    <div className="container flex h-screen w-full flex-col items-center justify-center">
      <Card className="w-full max-w-[480px] shadow-none">
        <CardHeader className="text-center">
          <h1 className="text-3xl font-semibold">Welcome to Mock Interview</h1>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email"
                className="h-12 rounded-lg bg-gray-50 px-4"
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Password"
                className="h-12 rounded-lg bg-gray-50 px-4"
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <Link 
              href="/auth/signup" 
              className="text-gray-900 hover:underline"
            >
              Sign up
            </Link>
            <Link 
              href="/auth/forgot-password" 
              className="text-gray-900 hover:underline"
            >
              Forgot password
            </Link>
          </div>

          <Button 
            className="w-full rounded-lg bg-black text-white hover:bg-gray-900"
            size="lg"
          >
            LOG IN
          </Button>

          <p className="text-center text-sm text-gray-600">
            By continuing, you agree to the Mock Interview{" "}
            <Link href="/terms" className="text-gray-900 hover:underline">
              Terms of Service
            </Link>{" "}
            and the{" "}
            <Link href="/privacy" className="text-gray-900 hover:underline">
              Privacy Policy
            </Link>
          </p>

          <div className="flex items-center justify-center gap-4">
            <Image
              src="/google.svg"
              alt="Google"
              width={24}
              height={24}
              className="h-6 w-6"
            />
            <Image
              src="/linkedin.svg"
              alt="LinkedIn"
              width={24}
              height={24}
              className="h-6 w-6"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

