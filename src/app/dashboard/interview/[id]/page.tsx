"use client"

import { useState, useEffect, useRef, use } from "react"
import { Play, Square } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/hooks/use-toast"
import { startInterview, textToVoice, closeInterview } from "@/services/api"
import { useInterviewChat } from "@/hooks/useInterviewChat"
import { useAudioRecorder } from "@/hooks/useAudioRecorder"
import { LoadingIndicator } from "@/components/ui/loading-indicator"
import { playAudio, formatTime } from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function InterviewRoom({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [time, setTime] = useState(0)
  const [hasAudioPermission, setHasAudioPermission] = useState<boolean | null>(null)
  const [, setAudioContext] = useState<AudioContext | null>(null)
  const router = useRouter()
  const { toast } = useToast()
  const wsRef = useRef<WebSocket | null>(null)
  const [interviewStarted, setInterviewStarted] = useState(false)
  const [openingStatement, setOpeningStatement] = useState("")
  const { chatMessages, isChatLoading, sendMessage } = useInterviewChat(resolvedParams.id)
  const { 
    isRecording, 
    transcripts, 
    isConverting, 
    toggleRecording 
  } = useAudioRecorder()
  
  // 添加离开确认和关闭面试状态
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false)
  const [isClosingInterview, setIsClosingInterview] = useState(false)

  // Check microphone permission
  useEffect(() => {
    async function checkAudioPermission() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        setHasAudioPermission(true)
        stream.getTracks().forEach(track => track.stop())
      } catch (err) {
        console.log(err)
        setHasAudioPermission(false)
        toast({
          variant: "destructive",
          title: "Permission Denied",
          description: "Microphone access is required for the interview. Please enable it and try again.",
        })
        setTimeout(() => {
          router.push('/dashboard/interview')
        }, 3000)
      }
    }

    checkAudioPermission()
  }, [router, toast])

  useEffect(() => {
    const context = new (window.AudioContext)
    setAudioContext(context)

    return () => {
      context.close()
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [])

  // Main timer effect
  useEffect(() => {
    if (hasAudioPermission) {
      const interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [hasAudioPermission])

  // Start interview, get opening statement
  useEffect(() => {
    async function initInterview() {
      if (!hasAudioPermission || interviewStarted) return

      try {
        const result = await startInterview(resolvedParams.id)
        if (result.status && result.data?.res) {
          setOpeningStatement(result.data.res)
          setInterviewStarted(true)
          
          // Convert opening statement to speech
          wsRef.current = textToVoice(result.data.res, (audioBuffer) => {
            playAudio(audioBuffer)
          })
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: result.message || "Failed to start interview",
          })
        }
      } catch (error) {
        console.error('Start interview error:', error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to start interview",
        })
      }
    }

    if (hasAudioPermission) {
      initInterview()
    }
  }, [hasAudioPermission, resolvedParams.id, interviewStarted, toast])

  const handleToggleRecording = async () => {
    await toggleRecording(time, async (transcript) => {
      // Send the transcript to the interviewer
      await sendMessage(transcript.text, transcript.time)
    })
  }

  // 处理离开面试按钮点击
  const handleLeaveInterview = () => {
    setShowLeaveConfirm(true)
  }

  // 处理确认离开面试
  const handleConfirmLeave = async () => {
    setIsClosingInterview(true)
    try {
      const result = await closeInterview(resolvedParams.id)
      if (result.status) {
        toast({
          title: "Interview Completed",
          description: "Your interview has been successfully completed."
        })
        // 跳转到面试结果页
        router.push(`/dashboard/interview/${resolvedParams.id}/result`)
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.message || "Failed to close the interview"
        })
      }
    } catch (error) {
      console.error("Error closing interview:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while closing the interview"
      })
    } finally {
      setIsClosingInterview(false)
      setShowLeaveConfirm(false)
    }
  }

  // 处理取消离开面试
  const handleCancelLeave = () => {
    setShowLeaveConfirm(false)
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
            variant="outline" 
            className="border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600"
            onClick={handleLeaveInterview}
            disabled={isClosingInterview}
          >
            {isClosingInterview ? "Leaving..." : "Leave"}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 gap-6 p-6">
        {/* Video and Interviewer's Voice Record Section */}
        <div className="flex w-[480px] flex-col gap-4 overflow-hidden">
          {/* Video Section */}
          <div className="relative h-[270px] overflow-hidden rounded-xl">
            <img src="/interviewer.jpg" alt="interviewer" className="w-full rounded-xl" />
          </div>

          {/* Interviewer's Voice Record */}
          <div className="h-[400px] overflow-y-auto rounded-xl bg-white p-4 shadow-sm">
            <div className="mb-4">
              <h3 className="font-medium text-[#2D2D2D]">Interviewer's Voice Record</h3>
            </div>
            <div className="space-y-2">
              {!openingStatement ? (
                <LoadingIndicator message="Starting interview..." className="mt-2" />
              ) : (
                <>
                  {openingStatement && (
                    <p className="text-sm text-[#6C757D]">
                      00:00 - {openingStatement}
                    </p>
                  )}
                  {chatMessages.map((message, index) => (
                    <p key={index} className="text-sm text-[#6C757D]">
                      {formatTime(message.time)} - {message.content}
                    </p>
                  ))}
                </>
              )}
              
              {isChatLoading && (
                <LoadingIndicator message="Interviewer is thinking..." className="mt-2" />
              )}
            </div>
          </div>
        </div>

        {/* Transcript Section */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[#E7FAF0] px-3 py-1 text-sm text-[#4AE68A]">
                Ready
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={isRecording ? "destructive" : "default"}
                size="sm"
                onClick={handleToggleRecording}
                className="gap-2"
                disabled={isConverting || !openingStatement}
              >
                {isRecording ? (
                  <>
                    <Square className="h-4 w-4" />
                    Stop
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Start
                  </>
                )}
              </Button>
            </div>
          </div>

            <div className="flex-1 overflow-y-auto">
              <div className="space-y-6">
                {transcripts.map((transcript, index) => (
                  <div key={index} className="rounded-lg bg-[#F8F9FA] p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs text-[#6C757D]">{formatTime(transcript.time)}</span>
                    </div>
                    <p className="text-sm text-[#2D2D2D]">{transcript.text}</p>
                  </div>
                ))}
                
                {isConverting && (
                  <div className="text-center">
                    <LoadingIndicator message="Converting your answer..." />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

      {/* 离开确认对话框 */}
      <AlertDialog open={showLeaveConfirm} onOpenChange={setShowLeaveConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>End Interview</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to end this interview? This will complete the current session and take you to the results page.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelLeave} disabled={isClosingInterview}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmLeave}
              disabled={isClosingInterview}
              className="bg-red-500 hover:bg-red-600"
            >
              {isClosingInterview ? "Ending..." : "End Interview"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

