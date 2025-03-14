import { useState, useRef, useEffect } from "react"
import { voiceStreamToText } from "@/services/api"

interface AudioRecorder {
  stream: MediaStream;
  audioContext: AudioContext;
  source: MediaStreamAudioSourceNode;
  processor: ScriptProcessorNode;
  stop: () => void;
}

export function useVoiceStreamToText() {
  const [isRecording, setIsRecording] = useState(false)
  const [allAudioData, setAllAudioData] = useState<Int16Array[]>([])
  const [transcripts, setTranscripts] = useState<Array<{ time: number; text: string }>>([])
  const audioRecorderRef = useRef<AudioRecorder | null>(null)
  const voiceToTextRef = useRef<ReturnType<typeof voiceStreamToText> | null>(null)

  // Initialize voice to text
  useEffect(() => {
    if (!voiceToTextRef.current) {
      voiceToTextRef.current = voiceStreamToText((text) => {
        setTranscripts(prev => [...prev, { time: Date.now(), text }])
      })
    }

    return () => {
      if (voiceToTextRef.current) {
        voiceToTextRef.current.ws.close()
        voiceToTextRef.current = null
      }
    }
  }, [])

  const startRecording = async () => {
    try {
      setAllAudioData([])

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true, 
          noiseSuppression: true  
        } 
      })

      const audioContext = new AudioContext({
        sampleRate: 16000,
      })

      const source = audioContext.createMediaStreamSource(stream)
      const processor = audioContext.createScriptProcessor(1024, 1, 1)

      processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0)
        const pcmData = new Int16Array(inputData.length)
        for (let i = 0; i < inputData.length; i++) {
          pcmData[i] = Math.max(-1, Math.min(1, inputData[i])) * 0x7FFF
        }
        setAllAudioData(prev => [...prev, pcmData])
      }

      source.connect(processor)
      processor.connect(audioContext.destination)

      audioRecorderRef.current = {
        stream,
        audioContext,
        source,
        processor,
        stop: () => {
          processor.disconnect()
          source.disconnect()
          audioContext.close()
          stream.getTracks().forEach(track => track.stop())
        }
      }

      setIsRecording(true)
    } catch (error) {
      console.error('Error starting recording:', error)
      throw error
    }
  }

  const stopRecording = () => {
    if (voiceToTextRef.current?.ws.readyState === WebSocket.OPEN && allAudioData.length > 0) {
      const totalLength = allAudioData.reduce((acc, chunk) => acc + chunk.length, 0)
      const mergedData = new Int16Array(totalLength)
      
      let offset = 0
      for (const chunk of allAudioData) {
        mergedData.set(chunk, offset)
        offset += chunk.length
      }

      voiceToTextRef.current.start(new Blob([mergedData.buffer], { 
        type: 'audio/pcm' 
      }))

      voiceToTextRef.current.stop()
    }

    if (audioRecorderRef.current) {
      audioRecorderRef.current.stop()
    }

    setAllAudioData([])
    setIsRecording(false)
  }

  useEffect(() => {
    return () => {
      if (audioRecorderRef.current) {
        audioRecorderRef.current.stop()
        audioRecorderRef.current.stream.getTracks().forEach(track => track.stop())
      }
      if (voiceToTextRef.current) {
        voiceToTextRef.current.ws.close()
        voiceToTextRef.current = null
      }
    }
  }, [])

  return {
    isRecording,
    transcripts,
    startRecording,
    stopRecording
  }
} 