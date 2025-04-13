"use client"

import { useRouter } from "next/navigation"
import { useToast } from "@/components/hooks/use-toast"
import useSWRMutation from "swr/mutation"
import { API_ROUTES, createResume } from "@/services/api"
import { ResumeForm, FormData } from "@/components/resume/resume-form"

export default function CreateResumePage() {
  const router = useRouter()
  const { toast } = useToast()
  const { trigger: createResumeTrigger } = useSWRMutation(
    API_ROUTES.CREATE_RESUME,
    createResume
  )

  const handleSubmit = async (data: FormData) => {
    try {
      const result = await createResumeTrigger({
        type: 'normal',
        title: data.title,
        personInfo: JSON.stringify(data.personalInfo),
        workExperience: JSON.stringify(data.workExperiences),
        projectExperience: JSON.stringify(data.projectExperiences),
        education: JSON.stringify(data.educations)
      })
      
      if (result.status) {
        toast({
          title: "Success",
          description: "Resume created successfully",
        })
        router.push('/dashboard/resume')
      } else {
        toast({
          title: "Error",
          description: "Failed to create resume",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.log("error", error)
      toast({
        title: "Error",
        description: "An error occurred while creating the resume",
        variant: "destructive",
      })
    }
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <ResumeForm
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      submitButtonText="Create"
      title="Create Resume"
    />
  )
}

