import { useState } from "react"
import { voiceFileToText } from "@/services/api"

export function useVoiceFileToText() {
  const [isConverting, setIsConverting] = useState(false)

  const convertToText = async (audioBlob: Blob): Promise<string> => {
    try {
      setIsConverting(true)
      
      // 创建 FormData
      const formData = new FormData()
      
      // 将 Blob 转换为 File，添加 .pcm 扩展名
      const file = new File([audioBlob], "audio.pcm", {
        type: "audio/pcm",
      })
      formData.append("file", file)

      // 调用 API
      const result = await voiceFileToText(formData)
      
      if (result.status && result.data) {
        return result.data
      } else {
        throw new Error(result.message || "Failed to convert audio to text")
      }
    } catch (error) {
      console.error("Error converting audio to text:", error)
      throw error
    } finally {
      setIsConverting(false)
    }
  }

  return {
    isConverting,
    convertToText
  }
} 