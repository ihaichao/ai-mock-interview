"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function PrivacyPolicyPage() {
  const router = useRouter()

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <Button 
        variant="ghost" 
        className="mb-8 flex h-8 items-center gap-2 p-0 text-sm text-gray-500"
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-4 w-4" />
        Go back
      </Button>

      <h1 className="mb-8 text-3xl font-bold text-[#2D2D2D]">Privacy Policy</h1>
      
      <div className="space-y-6 text-[#2D2D2D]">
        <section>
          <h2 className="mb-4 text-xl font-semibold">1. Introduction</h2>
          <p>
            Welcome to Mock Interview AI. We respect your privacy and are committed to protecting your personal data. 
            This privacy policy will inform you about how we look after your personal data when you visit our website 
            and tell you about your privacy rights and how the law protects you.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-semibold">2. Data We Collect</h2>
          <p>
            We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
          </p>
          <ul className="ml-6 mt-2 list-disc space-y-2">
            <li>Identity Data includes first name, last name, username or similar identifier.</li>
            <li>Contact Data includes email address and telephone numbers.</li>
            <li>Technical Data includes internet protocol (IP) address, your login data, browser type and version, 
                time zone setting and location, browser plug-in types and versions, operating system and platform, 
                and other technology on the devices you use to access this website.</li>
            <li>Profile Data includes your username and password, your interests, preferences, feedback and survey responses.</li>
            <li>Usage Data includes information about how you use our website, products and services.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-semibold">3. How We Use Your Data</h2>
          <p>
            We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
          </p>
          <ul className="ml-6 mt-2 list-disc space-y-2">
            <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
            <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
            <li>Where we need to comply with a legal obligation.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-semibold">4. Data Security</h2>
          <p>
            We have put in place appropriate security measures to prevent your personal data from being accidentally lost, 
            used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data 
            to those employees, agents, contractors and other third parties who have a business need to know.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-semibold">5. Your Legal Rights</h2>
          <p>
            Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to:
          </p>
          <ul className="ml-6 mt-2 list-disc space-y-2">
            <li>Request access to your personal data.</li>
            <li>Request correction of your personal data.</li>
            <li>Request erasure of your personal data.</li>
            <li>Object to processing of your personal data.</li>
            <li>Request restriction of processing your personal data.</li>
            <li>Request transfer of your personal data.</li>
            <li>Right to withdraw consent.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-semibold">6. Contact Us</h2>
          <p>
            If you have any questions about this privacy policy or our privacy practices, please contact us at:
          </p>
          <p className="mt-2">
            <strong>Email:</strong> privacy@mockinterviewai.com
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-semibold">7. Changes to the Privacy Policy</h2>
          <p>
            We may update our privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page.
          </p>
          <p className="mt-2">
            <strong>Last updated:</strong> June 1, 2023
          </p>
        </section>
      </div>
    </div>
  )
} 