import { useState, useRef, useEffect } from 'react'
import { startChat, textToVoice } from '@/services/api'
import { useToast } from '@/components/hooks/use-toast'
import { playAudio } from '@/lib/utils'

interface StreamResponse {
  id: string
  object: string
  created: number
  model: string
  system_fingerprint: string
  choices: Array<{
    index: number
    delta: {
      role?: string
      content?: string
    }
    logprobs: null
    finish_reason: null | string
  }>
}

export interface ChatMessage {
  content: string
  time: number
}

export function useInterviewChat(interviewId: string) {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [isChatLoading, setIsChatLoading] = useState(false)
  const abortControllerRef = useRef<AbortController | null>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const messageRef = useRef('')
  const { toast } = useToast()

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [])

  const sendMessage = async (text: string, currentTime: number) => {
    if (!text.trim() || isChatLoading) return
    setIsChatLoading(true)
    messageRef.current = ''

    try {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      abortControllerRef.current = new AbortController()

      if (wsRef.current) {
        wsRef.current.close()
      }

      await startChat(
        {
          interviewId,
          userInput: text
        },
        (data: StreamResponse) => {
          const { choices } = data
          if (choices && choices.length > 0) {
            const { delta } = choices[0]
            
            // Accumulate content
            if (delta.content) {
              messageRef.current += delta.content
              
              // Update the latest assistant message
              setChatMessages(prev => {
                const newMessages = [...prev]
                const lastMessage = newMessages.find(msg => 
                  msg.content === messageRef.current.substring(0, msg.content.length)
                )
                
                if (lastMessage) {
                  // Update existing message
                  lastMessage.content = messageRef.current
                  return newMessages
                } else {
                  // Add new assistant message
                  return [...prev, {
                    content: messageRef.current,
                    time: currentTime
                  }]
                }
              })
            }

            // When stream ends, convert text to speech
            if (choices[0].finish_reason !== null) {
              setIsChatLoading(false)
              
              // 使用 ref 中的完整消息
              wsRef.current = textToVoice(messageRef.current, (audioBuffer) => {
                playAudio(audioBuffer)
              })
            }
          }
        },
        (error) => {
          console.error('Chat error:', error)
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to get interview response",
          })
          setIsChatLoading(false)
        }
      )
    } catch (error) {
      console.error('Send message error:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send message",
      })
      setIsChatLoading(false)
    }
  }

  return {
    chatMessages,
    isChatLoading,
    sendMessage,
  }
} 