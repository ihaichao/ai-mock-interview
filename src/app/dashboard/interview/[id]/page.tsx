"use client"

import { useState, useEffect, useRef, use } from "react"
import { Phone, Camera, Subtitles, Play, Square } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/hooks/use-toast"
import { textToVoice, startInterview } from "@/services/api"

export default function InterviewRoom({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [time, setTime] = useState(0)
  const [answerTime, setAnswerTime] = useState(0)
  const [isAnswering, setIsAnswering] = useState(false)
  const [cameraOff, setCameraOff] = useState(false)
  const [subtitlesOff, setSubtitlesOff] = useState(false)
  const [hasAudioPermission, setHasAudioPermission] = useState<boolean | null>(null)
  const answerTimerRef = useRef<NodeJS.Timeout>()
  const router = useRouter()
  const { toast } = useToast()
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const [interviewStarted, setInterviewStarted] = useState(false)
  const [openingStatement, setOpeningStatement] = useState("")

  // 检查麦克风权限
  useEffect(() => {
    async function checkAudioPermission() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        // 获取权限成功
        setHasAudioPermission(true)
        // 停止所有音轨
        stream.getTracks().forEach(track => track.stop())
      } catch (err) {
        console.log(err)
        // 用户拒绝或获取权限失败
        setHasAudioPermission(false)
        toast({
          variant: "destructive",
          title: "Permission Denied",
          description: "Microphone access is required for the interview. Please enable it and try again.",
        })
        // 3秒后返回面试列表页
        setTimeout(() => {
          router.push('/dashboard/interview')
        }, 3000)
      }
    }

    checkAudioPermission()
  }, [router, toast])

  // Main timer effect
  useEffect(() => {
    // 只有在获得麦克风权限后才启动计时器
    if (hasAudioPermission) {
      const interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [hasAudioPermission])

  // Answer timer effect
  useEffect(() => {
    if (isAnswering && hasAudioPermission) {
      answerTimerRef.current = setInterval(() => {
        setAnswerTime((prevTime) => prevTime + 1)
      }, 1000)
    }
    return () => {
      if (answerTimerRef.current) {
        clearInterval(answerTimerRef.current)
      }
    }
  }, [isAnswering, hasAudioPermission])

  // 初始化 AudioContext
  useEffect(() => {
    // AudioContext 需要在用户交互后创建
    const context = new (window.AudioContext || window.webkitAudioContext)()
    setAudioContext(context)

    return () => {
      context.close()
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [])

  // 开始面试，获取开场白
  useEffect(() => {
    async function initInterview() {
      if (!hasAudioPermission || interviewStarted) return

      try {
        const result = await startInterview(resolvedParams.id)
        if (result.status && result.data?.res) {
          setOpeningStatement(result.data.res)
          setInterviewStarted(true)
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

  // 监听开场白变化，自动播放
  useEffect(() => {
    if (openingStatement && audioContext) {
      // 关闭之前的连接
      if (wsRef.current) {
        wsRef.current.close()
      }

      // 创建新的 WebSocket 连接
      wsRef.current = textToVoice(openingStatement, (audioBuffer) => {
        // 解码音频数据
        audioContext.decodeAudioData(audioBuffer, (decodedData) => {
          // 创建音频源
          const source = audioContext.createBufferSource()
          source.buffer = decodedData
          
          // 连接到扬声器
          source.connect(audioContext.destination)
          
          // 播放音频
          source.start(0)
        }).catch(error => {
          console.error('Error decoding audio data:', error)
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to play audio",
          })
        })
      })
    }
  }, [openingStatement, audioContext, toast])

  // 在组件卸载时清理
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleLeave = () => {
    router.push('/dashboard/interview')
  }

  const toggleAnswering = () => {
    setIsAnswering(!isAnswering)
    if (!isAnswering) {
      setAnswerTime(0) // Reset answer timer when starting
    }
  }

  // 如果权限状态还未确定，显示加载状态
  if (hasAudioPermission === null) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F8F9FA]">
        <div className="text-center">
          <p className="mb-2 text-lg">Requesting microphone permission...</p>
          <p className="text-sm text-gray-500">Please allow microphone access to continue</p>
        </div>
      </div>
    )
  }

  // 如果没有权限，显示错误状态（虽然会很快重定向）
  if (!hasAudioPermission) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F8F9FA]">
        <div className="text-center text-red-500">
          <p className="mb-2 text-lg">Microphone access denied</p>
          <p className="text-sm">Redirecting to interview list...</p>
        </div>
      </div>
    )
  }

  // 原有的渲染逻辑
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
            <div className="mb-4">
              <h3 className="font-medium text-[#2D2D2D]">Interviewer's Voice Record</h3>
            </div>
            <div className="space-y-2">
              {openingStatement && (
                <p className="text-sm text-[#6C757D]">
                  00:00 - {openingStatement}
                </p>
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
              {isAnswering && (
                <span className="text-sm text-[#6C757D]">
                  {formatTime(answerTime)}
                </span>
              )}
              <Button
                variant={isAnswering ? "destructive" : "default"}
                size="sm"
                onClick={toggleAnswering}
                className="gap-2"
              >
                {isAnswering ? (
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
              <div className="space-y-2">
                <div className="text-[#6C757D]">00:18</div>
                <ul className="list-disc space-y-2 pl-5 text-[#2D2D2D]">
                  <li>Referring to my role in overseeing technology and architeture initiatives.</li>
                  <li>interested in discussing the strategies implemented in a recent launch.</li>
                  <li>Aiming to highlight the outcomes and impact achieved through the technology solutions</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

