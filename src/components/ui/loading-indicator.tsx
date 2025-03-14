import React from 'react'

interface LoadingIndicatorProps {
  message?: string
  className?: string
}

export function LoadingIndicator({ message = "Loading...", className = "" }: LoadingIndicatorProps) {
  return (
    <div className={`flex items-center gap-2 text-[#6C757D] ${className}`}>
      <div className="flex space-x-1">
        <div className="h-2 w-2 animate-pulse rounded-full bg-[#4AE68A]"></div>
        <div className="h-2 w-2 animate-pulse rounded-full bg-[#4AE68A] delay-150 animate-pulse"></div>
        <div className="h-2 w-2 animate-pulse rounded-full bg-[#4AE68A] delay-300 animate-pulse"></div>
      </div>
      {message && <span className="text-sm">{message}</span>}
    </div>
  )
} 