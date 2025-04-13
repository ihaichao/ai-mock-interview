import { useState, useRef, useEffect } from 'react'
import { startChat, textToVoice } from '@/services/api'
import { useToast } from '@/components/hooks/use-toast'
import { playAudio } from '@/lib/utils'
import { Language } from '@/services/types'

export interface ChatMessage {
  content: string
  time: number
}

export function useInterviewChat(interviewId: string, language: Language) {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [isChatLoading, setIsChatLoading] = useState(false)
  const abortControllerRef = useRef<AbortController | null>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const messageRef = useRef('')
  const { toast } = useToast()

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
    const startTime = Date.now()

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
        {
          language
        },
        (data: string) => {
          console.log('data :>> ', data);
          // const { choices } = data
          if (data.length > 0) {
            // const { delta } = choices[0]
            
            if (data !== '[END]') {
              // Accumulate content
              messageRef.current += data
              
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
                    time: currentTime + Math.floor((Date.now() - startTime) / 1000)
                  }]
                }
              })
            } else {
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