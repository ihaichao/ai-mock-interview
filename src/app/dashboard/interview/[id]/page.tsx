"use client"

import { useState, useEffect } from "react"
import { Phone, Camera, Subtitles } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function InterviewRoom({ params }: PageProps) {
  console.log(params)
  const [time, setTime] = useState(0)
  const [cameraOff, setCameraOff] = useState(false)
  const [subtitlesOff, setSubtitlesOff] = useState(false)
  const router = useRouter()

  // Timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prevTime) => prevTime + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleLeave = () => {
    router.push('/dashboard/interview')
  }

  return (
    <div className="flex h-screen flex-col bg-[#F8F9FA]">
      {/* Header */}
      <div className="flex items-center justify-between border-b bg-white px-6 py-4">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-medium text-[#2D2D2D]">Java Developer@Wipro</h1>
          <span className="rounded-full bg-[#E7FAF0] px-3 py-1 text-sm text-[#4AE68A]">
            {formatTime(time)}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            variant="destructive" 
            onClick={handleLeave}
            className="gap-2"
          >
            <Phone className="h-4 w-4" />
            Leave
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 gap-6 p-6">
        {/* Video and Interviewer's Voice Record Section */}
        <div className="flex w-[480px] flex-col gap-4 overflow-hidden">
          {/* Video Section */}
          <div className="relative flex-1 overflow-hidden rounded-xl bg-black">
            <video
              className={`h-full w-full object-cover ${cameraOff ? 'hidden' : ''}`}
              autoPlay
              muted
              playsInline
            />
            {cameraOff && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#2D2D2D]">
                <div className="h-24 w-24 rounded-full bg-[#4A4A4A]" />
              </div>
            )}
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCameraOff(!cameraOff)}
                className={`h-10 w-10 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 ${
                  cameraOff ? 'text-red-500' : 'text-white'
                }`}
              >
                <Camera className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSubtitlesOff(!subtitlesOff)}
                className={`h-10 w-10 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 ${
                  subtitlesOff ? 'text-red-500' : 'text-white'
                }`}
              >
                <Subtitles className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Interviewer's Voice Record */}
          <div className="h-[400px] overflow-y-auto rounded-xl bg-white p-4 shadow-sm">
            <h3 className="mb-2 font-medium text-[#2D2D2D]">Interviewer's Voice Record</h3>
            <div className="space-y-2">
              <p className="text-sm text-[#6C757D]">00:05 - Can you tell me about your experience with Java?</p>
              <p className="text-sm text-[#6C757D]">00:15 - How have you used Spring Framework in your projects?</p>
              <p className="text-sm text-[#6C757D]">00:30 - Can you explain the concept of dependency injection?</p>
              <p className="text-sm text-[#6C757D]">00:45 - What's your experience with microservices architecture?</p>
              <p className="text-sm text-[#6C757D]">01:00 - How do you handle concurrency in Java?</p>
              <p className="text-sm text-[#6C757D]">01:15 - Can you describe a challenging project you've worked on?</p>
            </div>
          </div>
        </div>

        {/* Transcript Section */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-[#E7FAF0] px-3 py-1 text-sm text-[#4AE68A]">
                  Ready
                </span>
                <span className="text-sm text-[#6C757D]">AI prompts your answers</span>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="text-[#6C757D]">00:18</div>
                  <ul className="list-disc space-y-2 pl-5 text-[#2D2D2D]">
                    <li>Referring to my role in overseeing technology and architeture initiatives.</li>
                    <li>interested in discussing the strategies implemented in a recent launch.</li>
                    <li>Aiming to highlight the outcomes and impact achieved through the technology solutions</li>
                  </ul>
                </div>

                <div className="rounded-xl bg-[#F8F9FA] p-4">
                  <div className="text-[#6C757D]">00:20</div>
                  <p className="mt-2 text-[#2D2D2D]">
                    I'm still unclear on what you're referring to. Are you asking about a specific product launch or a project idea? Can you give more details?
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="text-[#6C757D]">00:25</div>
                  <ul className="list-disc space-y-2 pl-5 text-[#2D2D2D]">
                    <li>Referring to the transformation of an existing merchant platform through Domain-Driven Design</li>
                    <li>Reduced onboarding time for independent sites from 45 to 7 days and for new business onboarding ur day</li>
                    <li>Led Sub-project 2: Migrated 90% of warehouse distribution and RSs business systems to the cloud, relcapabilities, and system boundaries</li>
                    <li>Led Sub-project 1: Collaborated with international mid-end, Lazada trading platform, and Redmart technology teams to define technical boundaries and coordinate across teams</li>
                    <li>Project challenges: Juhuasuan faced issues integrating personalized businesses into merchant access</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

