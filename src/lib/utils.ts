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
  const audioContext = new window.AudioContext()
  audioContext.decodeAudioData(audioBuffer, (buffer) => {
    const source = audioContext.createBufferSource()
    source.buffer = buffer
    source.connect(audioContext.destination)
    source.start(0)
  })
}