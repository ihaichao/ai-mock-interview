"use client"

import { useRouter } from "next/navigation"
import { useToast } from "@/components/hooks/use-toast"
import { updateResume, fetchResumeDetail } from "@/services/api"
import { ResumeForm, FormData } from "@/components/resume/resume-form"
import { useEffect, useState, use } from "react"
import { LoadingIndicator } from "@/components/ui/loading-indicator"

export default function EditResumePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const { toast } = useToast()
  const [initialData, setInitialData] = useState<FormData | undefined>()

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const result = await fetchResumeDetail(resolvedParams.id)
        if (result.status) {
          const resume = result.data
          setInitialData({
            title: resume.title,
            personalInfo: JSON.parse(resume.personInfo),
            workExperiences: JSON.parse(resume.workExperience),
            projectExperiences: JSON.parse(resume.projectExperience),
            educations: JSON.parse(resume.education)
          })
        }
      } catch (error) {
        console.error("Error fetching resume:", error)
        toast({
          title: "Error",
          description: "Failed to load resume data",
          variant: "destructive",
        })
      }
    }

    fetchResume()
  }, [resolvedParams.id, toast])

  const handleSubmit = async (data: FormData) => {
    try {
      const result = await updateResume(Number(resolvedParams.id), {
        title: data.title,
        type: 'normal',
        uploadDate: new Date().toISOString().split('T')[0],
        personInfo: JSON.stringify(data.personalInfo),
        workExperience: JSON.stringify(data.workExperiences),
        projectExperience: JSON.stringify(data.projectExperiences),
        education: JSON.stringify(data.educations)
      })
      
      if (result.status) {
        toast({
          title: "Success",
          description: "Resume updated successfully",
        })
        router.push('/dashboard/resume')
      } else {
        toast({
          title: "Error",
          description: "Failed to update resume",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.log("error", error)
      toast({
        title: "Error",
        description: "An error occurred while updating the resume",
        variant: "destructive",
      })
    }
  }

  const handleCancel = () => {
    router.back()
  }

  if (!initialData) {
    return (
      <div className="h-full flex items-center justify-center">
        <LoadingIndicator />
      </div>
    )
  }

  return (
    <ResumeForm
      initialData={initialData}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      submitButtonText="Save Changes"
      title="Edit Resume"
    />
  )
} 