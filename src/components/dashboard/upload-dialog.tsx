"use client"

import { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { FileText } from 'lucide-react'

interface UploadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UploadDialog({ open, onOpenChange }: UploadDialogProps) {
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError("File size exceeds 10MB limit.")
        setFile(null)
      } else if (
        !['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
        .includes(selectedFile.type)
      ) {
        setError("Only PDF and Word documents are allowed.")
        setFile(null)
      } else {
        setFile(selectedFile)
        setError(null)
      }
    }
  }

  const handleUpload = () => {
    if (file) {
      // Here you would typically send the file to your server
      console.log("Uploading file:", file.name)
      // After successful upload:
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-6 pt-8">
        <DialogHeader className="text-center flex flex-col items-center justify-center">
          <div className="mb-4">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#E7FAF0]">
              {file ? (
                <FileText className="h-12 w-12 text-[#4AE68A]" />
              ) : (
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M35 25V31.6667C35 32.5507 34.6488 33.3986 34.0237 34.0237C33.3986 34.6488 32.5507 35 31.6667 35H8.33333C7.44928 35 6.60143 34.6488 5.97631 34.0237C5.35119 33.3986 5 32.5507 5 31.6667V25" stroke="#4AE68A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M11.6667 16.6667L20 25L28.3333 16.6667" stroke="#4AE68A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M20 25V5" stroke="#4AE68A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
          </div>
          <div className="mb-2 text-center text-[#2D2D2D] text-sm">
            {file ? file.name : "No file selected"}
            {file && (
              <svg className="ml-1 inline-block" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 10V12.6667C14 13.0203 13.8595 13.3594 13.6095 13.6095C13.3594 13.8595 13.0203 14 12.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V10" stroke="#6C757D" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4.66669 6.66667L8.00002 10L11.3334 6.66667" stroke="#6C757D" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 10V2" stroke="#6C757D" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </div>
          <DialogTitle></DialogTitle>
          <div className="w-full flex justify-center">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="hidden"
            />
            <Button 
              className="h-10 rounded-full bg-white text-sm font-medium text-black hover:bg-gray-100 border border-gray-300"
              onClick={() => {fileInputRef.current?.click()}}
            >
              Upload Your Resume
            </Button>
          </div>
          <div className="text-center text-sm text-[#6C757D]">
            Files should be in <span className="font-medium text-[#2D2D2D]">PDF</span> or{" "}
            <span className="font-medium text-[#2D2D2D]">Word</span> format and must not exceed 10MB in size.
          </div>
          {error && (
            <div className="mt-2 text-center text-sm text-red-500">
              {error}
            </div>
          )}
        </DialogHeader>
        <div className="mt-6 w-full flex justify-center">
          <Button
            size="lg"
            className="h-10 rounded-full bg-black text-sm font-medium text-white"
            onClick={handleUpload}
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

