"use client"

import { useForm } from "react-hook-form"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { AutoForm } from "@/components/ui/auto-form"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/hooks/use-toast"
import useSWRMutation from "swr/mutation"
import { API_ROUTES, createResume } from "@/services/api"

// Schema 定义
const personalInfoSchema = z.object({
  name: z.string().optional(),
  location: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  linkedinUrl: z.string().optional(),
  introduction: z.string().optional(),
})

const workExperienceSchema = z.object({
  company: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  jobTitle: z.string().optional(),
  description: z.string().optional(),
})

const projectExperienceSchema = z.object({
  company: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  jobTitle: z.string().optional(),
  description: z.string().optional(),
  outcome: z.string().optional(),
})

const educationSchema = z.object({
  school: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  campusExperience: z.string().optional(),
})

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  personalInfo: personalInfoSchema,
  workExperiences: z.array(workExperienceSchema),
  projectExperiences: z.array(projectExperienceSchema),
  educations: z.array(educationSchema),
})

type FormData = z.infer<typeof formSchema>

export default function CreateResumePage() {
  const router = useRouter()
  const { toast } = useToast()
  const { trigger: createResumeTrigger } = useSWRMutation(
    API_ROUTES.CREATE_RESUME,
    createResume
  )
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      workExperiences: [
        {
          company: "",
          startTime: "",
          endTime: "",
          jobTitle: "",
          description: ""
        }
      ],
      projectExperiences: [
        {
          company: "",
          startTime: "",
          endTime: "",
          jobTitle: "",
          description: "",
          outcome: ""
        }
      ],
      educations: [
        {
          school: "",
          startTime: "",
          endTime: "",
          campusExperience: ""
        }
      ],
      personalInfo: {},
    }
  })

  const onSubmit = async (data: FormData) => {
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
        router.push('/dashboard/resume') // 假设这是简历列表页面的路径
      } else {
        toast({
          title: "Error",
          description: "Failed to create resume",
          variant: "destructive",
        })
      }
    } catch (error) {
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

  const addArrayField = <T extends keyof Pick<FormData, 'workExperiences' | 'projectExperiences' | 'educations'>>(fieldName: T) => {
    const currentValues = form.getValues(fieldName);
    const defaultValues = {
      workExperiences: [{ company: "", startTime: "", endTime: "", jobTitle: "", description: "" }],
      projectExperiences: [{ company: "", startTime: "", endTime: "", jobTitle: "", description: "", outcome: "" }],
      educations: [{ school: "", startTime: "", endTime: "", campusExperience: "" }]
    };

    form.setValue(fieldName, [...currentValues, ...defaultValues[fieldName]] as any);
  };

  const removeArrayField = <T extends keyof Pick<FormData, 'workExperiences' | 'projectExperiences' | 'educations'>>(fieldName: T, index: number) => {
    const currentValues = form.getValues(fieldName);
    form.setValue(fieldName, currentValues.filter((_, i) => i !== index) as any);
  };

  return (
    <div className="h-full p-8 bg-[#F8F9FA]">
        <div className="h-full p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-medium text-[#2D2D2D]">Create Resume</h1>
          </div>
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <h2 className="text-xl font-medium mb-4">Position title</h2>
                  {/* <AutoForm 
                    schema={jobSchema} 
                    form={form} 
                    path="position" 
                  /> */}
                  <Input
                    placeholder="title"
                    {...form.register('title')}
                  />
                </div>
                {/* Personal Info Section */}
                <div>
                  <h2 className="text-xl font-medium mb-4">Personal Information</h2>
                  <AutoForm 
                    schema={personalInfoSchema} 
                    form={form} 
                    path="personalInfo" 
                  />
                </div>

                {/* Work Experiences Section */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-medium">Work Experience</h2>
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={() => addArrayField("workExperiences")}
                    >
                      Add Work Experience
                    </Button>
                  </div>
                  {form.watch('workExperiences').map((_, index) => (
                    <div key={index} className="relative border rounded-lg p-4 mb-4">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => removeArrayField("workExperiences", index)}
                      >
                        Remove
                      </Button>
                      <AutoForm
                        schema={workExperienceSchema}
                        form={form}
                        path={`workExperiences.${index}`}
                      />
                    </div>
                  ))}
                </div>

                {/* Project Experiences Section */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-medium">Projects</h2>
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={() => addArrayField("projectExperiences")}
                    >
                      Add Project
                    </Button>
                  </div>
                  {form.watch('projectExperiences').map((_, index) => (
                    <div key={index} className="relative border rounded-lg p-4 mb-4">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => removeArrayField("projectExperiences", index)}
                      >
                        Remove
                      </Button>
                      <AutoForm
                        schema={projectExperienceSchema}
                        form={form}
                        path={`projectExperiences.${index}`}
                      />
                    </div>
                  ))}
                </div>

                {/* Education Section */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-medium">Education</h2>
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={() => addArrayField("educations")}
                    >
                      Add Education
                    </Button>
                  </div>
                  {form.watch('educations').map((_, index) => (
                    <div key={index} className="relative border rounded-lg p-4 mb-4">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => removeArrayField("educations", index)}
                      >
                        Remove
                      </Button>
                      <AutoForm
                        schema={educationSchema}
                        form={form}
                        path={`educations.${index}`}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    className="h-10 px-6 rounded-lg border-[#E5E7EB] text-sm font-medium text-[#2D2D2D]"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="h-10 px-6 rounded-lg bg-[#4AE68A] text-sm font-medium text-white hover:bg-[#3dd17a]"
                  >
                    Save
                  </Button>
                </div>
              </form>
            </Form>
        </div>
      </div>
    </div>
  )
}

