"use client"

import { useForm } from "react-hook-form"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { AutoForm } from "@/components/ui/auto-form"
import { useRouter } from "next/navigation"

// Schema 定义
const personalInfoSchema = z.object({
  name: z.string().min(1, "Name is required"),
  location: z.string().min(1, "Location is required"),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().email("Invalid email address"),
  social: z.string().url("Invalid URL").optional(),
  introduction: z.string().min(1, "Introduction is required"),
})

const workExperienceSchema = z.object({
  company: z.string().min(1, "Company name is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  jobTitle: z.string().min(1, "Job title is required"),
  workDescription: z.string().optional(),
})

const projectExperienceSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  role: z.string().min(1, "Role is required"),
  description: z.string().min(1, "Description is required"),
})

const educationSchema = z.object({
  school: z.string().min(1, "School name is required"),
  degree: z.string().min(1, "Degree is required"),
  fieldOfStudy: z.string().min(1, "Field of study is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
})

const formSchema = z.object({
  personalInfo: personalInfoSchema,
  workExperiences: z.array(workExperienceSchema),
  projectExperiences: z.array(projectExperienceSchema),
  educations: z.array(educationSchema),
})

type FormData = z.infer<typeof formSchema>

export default function CreateResumePage() {
  const router = useRouter()
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      personalInfo: {
        name: "",
        location: "",
        phone: "",
        email: "",
        social: "",
        introduction: "",
      },
      workExperiences: [
        { company: "", startDate: "", endDate: "", jobTitle: "", workDescription: "" }
      ],
      projectExperiences: [
        { name: "", role: "", description: "" }
      ],
      educations: [
        { school: "", degree: "", fieldOfStudy: "", startDate: "", endDate: "" }
      ],
    }
  })

  const onSubmit = (data: FormData) => {
    console.log(data)
    // Handle form submission
  }

  const handleCancel = () => {
    router.back()
  }

  const addArrayField = <T extends keyof Pick<FormData, 'workExperiences' | 'projectExperiences' | 'educations'>>(fieldName: T) => {
    const currentValues = form.getValues(fieldName);
    const defaultValues = {
      workExperiences: { company: "", startDate: "", endDate: "", jobTitle: "", workDescription: "" },
      projectExperiences: { name: "", role: "", description: "" },
      educations: { school: "", degree: "", fieldOfStudy: "", startDate: "", endDate: "" }
    };

    form.setValue(fieldName, [...currentValues, defaultValues[fieldName]] as any);
  };

  const removeArrayField = <T extends keyof Pick<FormData, 'workExperiences' | 'projectExperiences' | 'educations'>>(fieldName: T, index: number) => {
    const currentValues = form.getValues(fieldName);
    form.setValue(fieldName, currentValues.filter((_, i) => i !== index) as any);
  };

  return (
    <div className="flex h-screen bg-[#F8F9FA]">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="h-full p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-medium text-[#2D2D2D]">Create Resume</h1>
          </div>
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
      </main>
    </div>
  )
}

