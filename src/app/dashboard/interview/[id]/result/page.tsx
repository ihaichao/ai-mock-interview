"use client"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { TooltipProvider } from "@/components/ui/tooltip"
import { getInterviewEvaluation } from "@/services/api"
import { InterviewEvaluation } from "@/services/types"
import { useToast } from "@/components/hooks/use-toast"
import { LoadingIndicator } from "@/components/ui/loading-indicator"

const CircularProgress = ({
  value,
  size = "small",
  gradient = false,
}: {
  value: number
  size?: "small" | "large"
  gradient?: boolean
}) => {
  const radius = size === "large" ? 80 : 36
  const strokeWidth = size === "large" ? 8 : 4
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference
  const svgSize = size === "large" ? 200 : 100

  return (
    <div className={`relative ${size === "large" ? "h-48 w-48" : "h-24 w-24"} flex items-center justify-center`}>
      <svg className="h-full w-full -rotate-90" viewBox={`0 0 ${svgSize} ${svgSize}`}>
        <defs>
          {gradient && (
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4AE68A" />
              <stop offset="50%" stopColor="#4AE6E6" />
              <stop offset="100%" stopColor="#4A8AE6" />
            </linearGradient>
          )}
        </defs>
        <circle
          className="stroke-[#E7FAF0]"
          cx={svgSize / 2}
          cy={svgSize / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
        />
        <circle
          className="transition-all duration-1000 ease-in-out"
          cx={svgSize / 2}
          cy={svgSize / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke={gradient ? "url(#scoreGradient)" : "#4AE68A"}
        />
      </svg>
      <div
        className={`absolute inset-0 flex items-center justify-center ${
          size === "large" ? "text-5xl" : "text-2xl"
        } font-medium`}
      >
        {value}
      </div>
    </div>
  )
}

export default function InterviewResults({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const { toast } = useToast()
  const [evaluation, setEvaluation] = useState<InterviewEvaluation['received_data'] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('fetchEvaluation======')
    async function fetchEvaluation() {
      try {
        const result = await getInterviewEvaluation(resolvedParams.id)
        if (result.status && result.data) {
          setEvaluation(result.data.received_data)
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: result.message || "Failed to load interview evaluation",
          })
        }
      } catch (error) {
        console.error('Error fetching evaluation:', error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load interview evaluation",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchEvaluation()
  }, [])

  // 处理返回面试列表
  const handleGoBack = () => {
    router.push('/dashboard/interview')
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingIndicator message="Loading evaluation..." />
      </div>
    )
  }

  if (!evaluation) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-medium text-red-500">Evaluation not available</p>
          <Button className="mt-4" onClick={handleGoBack}>Go Back</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Header */}
      <div className="border-b bg-[#F8F9FA] px-8 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-medium text-[#2D2D2D]">Interview Results</h1>
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              className="gap-2 text-[#6C757D]" 
              onClick={handleGoBack}
            >
              <ArrowLeft className="h-4 w-4" />
              Go back
            </Button>
            {/* <Button variant="outline" className="gap-2">
              <FileText className="h-4 w-4" />
              Export by PDF
            </Button> */}
          </div>
        </div>
      </div>

      <div className="px-8 py-6">
        {/* Score Section */}
        <div className="mb-8 rounded-xl bg-white p-8 shadow-sm">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            {/* Overall Score */}
            {/* <div className="flex flex-col items-center justify-center">
              <CircularProgress value={evaluation.overallScore} size="large" gradient />
              <h2 className="mt-4 text-xl font-medium text-[#2D2D2D]">Overall Interview Score</h2>
            </div> */}

            {/* Detailed Scores */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <TooltipProvider>
                {Object.keys(evaluation).map((skill, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <CircularProgress value={evaluation[skill as keyof typeof evaluation]} />
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-[#2D2D2D]">{skill}</span>
                        {/* {skill.tooltip && (
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4 text-[#6C757D]" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{skill.tooltip}</p>
                            </TooltipContent>
                          </Tooltip>
                        )} */}
                      </div>
                    </div>
                  </div>
                ))}
              </TooltipProvider>
            </div>
          </div>
        </div>

        {/* Overall Evaluation */}
        {/* <div className="mb-8 text-[#2D2D2D]">
          {evaluation.overallEvaluation}
        </div> */}

        {/* Suggestions Section */}
        {/* <div>
          <h2 className="mb-6 text-xl font-medium text-[#2D2D2D]">Suggestions for Optimization</h2>
          <div className="space-y-4">
            {evaluation.suggestions.map((suggestion, index) => (
              <div key={index}>
                <h3 className="mb-4 flex items-center gap-2 font-medium text-[#2D2D2D]">
                  <span className="h-2 w-2 rounded-full bg-[#4AE68A]" />
                  {suggestion.title}
                </h3>
                <div className="space-y-4 rounded-xl bg-[#F8F9FA] p-6 text-[#2D2D2D]">
                  <p>{suggestion.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div> */}
      </div>
    </div>
  )
}

