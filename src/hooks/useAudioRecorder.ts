import { useState, useRef, useCallback } from 'react'
import { useToast } from '@/components/hooks/use-toast'
import { useVoiceFileToText } from './useVoiceFileToText'

interface AudioRecorder {
  stream: MediaStream;
  audioContext: AudioContext;
  source: MediaStreamAudioSourceNode;
  processor: ScriptProcessorNode;
  stop: () => void;
}

interface Transcript {
  time: number;
  text: string;
}

export function useAudioRecorder() {
  const [isRecording, setIsRecording] = useState(false)
  const [audioChunks, setAudioChunks] = useState<Int16Array[]>([])
  const [transcripts, setTranscripts] = useState<Transcript[]>([])
  const audioRecorderRef = useRef<AudioRecorder | null>(null)
  const { isConverting, convertToText } = useVoiceFileToText()
  const { toast } = useToast()

  const startRecording = useCallback(async () => {
    try {
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
      
      // Process audio data
      processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0)
        const pcmData = new Int16Array(inputData.length)
        for (let i = 0; i < inputData.length; i++) {
          pcmData[i] = Math.max(-1, Math.min(1, inputData[i])) * 0x7FFF
        }
        setAudioChunks(prev => [...prev, pcmData])
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
      return true
    } catch (error) {
      console.error('Error starting recording:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to start recording",
      })
      return false
    }
  }, [toast])

  const stopRecording = useCallback(async (currentTime: number) => {
    if (audioRecorderRef.current) {
      audioRecorderRef.current.stop()
    }

    try {
      // Merge all audio data
      const totalLength = audioChunks.reduce((acc, chunk) => acc + chunk.length, 0)
      const mergedData = new Int16Array(totalLength)
      
      let offset = 0
      for (const chunk of audioChunks) {
        mergedData.set(chunk, offset)
        offset += chunk.length
      }

      // Create Blob
      const audioBlob = new Blob([mergedData.buffer], { type: 'audio/pcm' })
      
      // Convert to text
      const text = await convertToText(audioBlob)

      // Add to transcripts
      const newTranscript = { time: currentTime, text }
      setTranscripts(prev => [...prev, newTranscript])
      
      // Clear audio chunks
      setAudioChunks([])
      setIsRecording(false)
      
      return newTranscript
    } catch (error) {
      console.error('Error converting audio to text:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to convert audio to text",
      })
      setIsRecording(false)
      return null
    }
  }, [audioChunks, convertToText, toast])

  const toggleRecording = useCallback(async (currentTime: number, onTranscriptReady?: (transcript: Transcript) => void) => {
    if (!isRecording) {
      const success = await startRecording()
      return success
    } else {
      const transcript = await stopRecording(currentTime)
      if (transcript && onTranscriptReady) {
        onTranscriptReady(transcript)
      }
      return true
    }
  }, [isRecording, startRecording, stopRecording])

  return {
    isRecording,
    transcripts,
    isConverting,
    toggleRecording,
    startRecording,
    stopRecording
  }
} 