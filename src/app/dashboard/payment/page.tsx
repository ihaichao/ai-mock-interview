"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft } from 'lucide-react'
import { useToast } from "@/components/hooks/use-toast"
import useSWRMutation from "swr/mutation"
import { createPaypalPayment, createAlipayPayment, API_ROUTES } from "@/services/api"

export default function PaymentPage() {
  const router = useRouter()
  const [paymentMethod, setPaymentMethod] = useState<"paypal" | "alipay">("paypal")
  const { toast } = useToast()

  const { trigger: createPaymentTrigger, isMutating: isPaypalMutating } = useSWRMutation(
    API_ROUTES.CREATE_PAYMENT,
    (key, { arg }) => createPaypalPayment(arg)
  )

  const { trigger: createAlipayTrigger, isMutating: isAlipayMutating } = useSWRMutation(
    API_ROUTES.CREATE_ALIPAY_PAYMENT,
    (key, { arg }) => createAlipayPayment(arg)
  )

  const isMutating = isPaypalMutating || isAlipayMutating

  const handlePay = async () => {
    try {
      let result
      if (paymentMethod === "paypal") {
        result = await (createPaymentTrigger as any)({
          amount: '0.01',
          method: 'paypal',
          currency: 'USD',
        })
        window.open(result)
      } else {
        result = await (createAlipayTrigger as any)({
          amount: '0.01',
          description: 'Mock interview service',
          email: localStorage.getItem('email') || '',
          subject: 'Mock Interview Service'
        })

        const divForm = document.getElementsByTagName('divform')
        if (divForm.length) {
          document.body.removeChild(divForm[0])
        }
        const div = document.createElement('divform');
        div.innerHTML = result;
        document.body.appendChild(div);
        document.forms[0].setAttribute('target', '_blank') 
        document.forms[0].submit();
      }

      // if (result.status) {
      //   if (paymentMethod === "alipay" && result.data?.paymentUrl) {
      //     window.location.href = result.data.paymentUrl
      //     return
      //   }
      //   toast({
      //     title: "Success",
      //     description: "Payment created successfully",
      //   })
      // } else {
      //   toast({
      //     variant: "destructive",
      //     title: "Error",
      //     description: result.message || "Payment failed",
      //   })
      // }
    } catch (error) {
      console.error("Payment error:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Payment failed. Please try again.",
      })
    }
  }

  return (
    <div className="h-full p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-medium text-[#2D2D2D]">Pay</h1>
        <Button
          variant="ghost"
          className="gap-2 text-[#6C757D]"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
          Go back
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column - Order Summary */}
        <div className="space-y-6">
          <div>
            <h2 className="mb-4 text-lg text-[#2D2D2D]">Mock interview services</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-medium text-[#2D2D2D]">$ 59.00</span>
              </div>
              <div className="flex items-center justify-between border-b pb-4">
                <span className="text-[#2D2D2D]">Mock interview services</span>
                <span className="text-[#2D2D2D]">$59.00</span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="font-medium text-[#2D2D2D]">Total due today</span>
                <span className="font-medium text-[#2D2D2D]">$59.00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Payment Form */}
        <div className="space-y-6">
          <div>
            <h2 className="mb-4 text-lg text-[#2D2D2D]">Payment method</h2>
            <RadioGroup
              defaultValue="paypal"
              onValueChange={(value) => setPaymentMethod(value as "paypal" | "alipay")}
              className="grid grid-cols-2 gap-4"
            >
              <div>
                <RadioGroupItem
                  value="paypal"
                  id="paypal"
                  className="peer sr-only"
                />
                <label
                  htmlFor="paypal"
                  className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border bg-[#F8F9FA] p-4 hover:bg-[#F1F3F5] peer-data-[state=checked]:border-[#4AE68A] peer-data-[state=checked]:bg-[#E7FAF0]"
                >
                  <img
                    src="/paypal.svg"
                    alt="PayPal"
                    className="h-20 w-20"
                  />
                </label>
              </div>
              <div>
                <RadioGroupItem
                  value="alipay"
                  id="alipay"
                  className="peer sr-only"
                />
                <label
                  htmlFor="alipay"
                  className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border bg-[#F8F9FA] p-4 hover:bg-[#F1F3F5] peer-data-[state=checked]:border-[#4AE68A] peer-data-[state=checked]:bg-[#E7FAF0]"
                >
                  <img
                    src="/alipay.svg"
                    alt="Alipay"
                    className="h-20 w-20"
                  />
                </label>
              </div>
            </RadioGroup>
          </div>

          {paymentMethod === "paypal" ? (
            <div className="rounded-lg bg-[#F8F9FA] p-6 text-center text-[#6C757D]">
              You will be redirected to PayPal to complete your payment.
            </div>
          ) : (
            <div className="rounded-lg bg-[#F8F9FA] p-6 text-center text-[#6C757D]">
              You will be redirected to Alipay to complete your payment.
            </div>
          )}

          <Button 
            className="w-full rounded-lg bg-black py-6 text-white hover:bg-black/90"
            onClick={handlePay}
            disabled={isMutating}
          >
            {isMutating ? "Processing..." : "Pay Now"}
          </Button>
        </div>
      </div>
    </div>
  )
}

