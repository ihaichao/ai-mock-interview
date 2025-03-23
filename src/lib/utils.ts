import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import dayjs from "dayjs"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(timestamp: string, format: string = 'YYYY.MM.DD') {
  return dayjs(timestamp).format(format)
}

export function playAudio(audioBuffer: ArrayBuffer) {
  console.log("playAudio", audioBuffer)
  const AudioContext = window.AudioContext || (window as any).webkitAudioContext
  const audioContext = new AudioContext()
  
  if (audioContext.state === 'suspended') {
    audioContext.resume()
  }
  
  audioContext.decodeAudioData(
    audioBuffer, 
    (buffer) => {
      const source = audioContext.createBufferSource()
      source.buffer = buffer
      
      source.connect(audioContext.destination)
      try {
        source.start(0)
      } catch (error) {
        console.error('Error starting audio playback:', error)
      }
    },
    (error) => {
      console.error('Error decoding audio data:', error)
    }
  )
}

export const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}