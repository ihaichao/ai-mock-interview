"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, FileText } from "lucide-react"
import { TooltipProvider } from "@/components/ui/tooltip"

interface SkillScore {
  name: string
  score: number
  tooltip: string
}

const skillScores: SkillScore[] = [
  {
    name: "Communication Skills",
    score: 85,
    tooltip: "Ability to express ideas clearly and listen effectively",
  },
  {
    name: "Professional Knowledge and Skills",
    score: 90,
    tooltip: "Technical expertise and industry-specific knowledge",
  },
  {
    name: "Problem-Solving Ability",
    score: 80,
    tooltip: "Capacity to analyze and resolve complex issues",
  },
  {
    name: "Teamwork and Interpersonal Skills",
    score: 75,
    tooltip: "Ability to collaborate and work effectively with others",
  },
  {
    name: "Attitude and Professionalism",
    score: 85,
    tooltip: "Professional conduct and work ethic",
  },
  {
    name: "Self-awareness and Learning Ability",
    score: 70,
    tooltip: "Capacity for self-reflection and continuous improvement",
  },
]

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

export default function InterviewResults() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Header */}
      <div className="border-b bg-[#F8F9FA] px-8 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-medium text-[#2D2D2D]">Interview Results</h1>
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="gap-2 text-[#6C757D]" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
              Go back
            </Button>
            <Button variant="outline" className="gap-2">
              <FileText className="h-4 w-4" />
              Export by PDF
            </Button>
          </div>
        </div>
      </div>

      <div className="px-8 py-6">
        {/* Score Section */}
        <div className="mb-8 rounded-xl bg-white p-8 shadow-sm">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            {/* Overall Score */}
            <div className="flex flex-col items-center justify-center">
              <CircularProgress value={82} size="large" gradient />
              <h2 className="mt-4 text-xl font-medium text-[#2D2D2D]">Overall Interview Score</h2>
            </div>

            {/* Detailed Scores */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <TooltipProvider>
                {skillScores.map((skill, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <CircularProgress value={skill.score} />
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-[#2D2D2D]">{skill.name}</span>
                        {/* <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-[#6C757D]" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{skill.tooltip}</p>
                          </TooltipContent>
                        </Tooltip> */}
                      </div>
                    </div>
                  </div>
                ))}
              </TooltipProvider>
            </div>
          </div>
        </div>

        {/* Overall Evaluation */}
        <div className="mb-8 text-[#2D2D2D]">
          Overall, your performance in this interview was quite good. With 3 years of experience as a product manager
          for medical surgical robots, you demonstrated relatively solid professional competence, good communication
          skills, and certain problem-solving abilities, leaving a rather deep impression on the interviewer. However,
          there are still some aspects that can be further improved.
        </div>

        {/* Suggestions Section */}
        <div>
          <h2 className="mb-6 text-xl font-medium text-[#2D2D2D]">Suggestions for Optimization</h2>
          <div className="space-y-4">
            <div>
              <h3 className="mb-4 flex items-center gap-2 font-medium text-[#2D2D2D]">
                <span className="h-2 w-2 rounded-full bg-[#4AE68A]" />
                Personal Appearance Aspect
              </h3>
              <div className="space-y-4 rounded-xl bg-[#F8F9FA] p-6 text-[#2D2D2D]">
                <p>
                  If it is a video interview, pay attention to keeping the background clean and the lighting sufficient
                  to ensure that your image is clearly visible. Choose simple and professional clothing, such as a
                  plain-colored shirt paired with dark-colored suit pants or a skirt, to show a professional and stable
                  image.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

