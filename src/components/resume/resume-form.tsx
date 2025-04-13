"use client"

import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { AutoForm } from "@/components/ui/auto-form"
import { Input } from "@/components/ui/input"

// Schema 定义
export const personalInfoSchema = z.object({
  name: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  linkedinUrl: z.string().nullable().optional(),
  personIntroduction: z.string().nullable().optional(),
})

export const workExperienceSchema = z.object({
  company: z.string().nullable().optional(),
  startTime: z.string().nullable().optional(),
  endTime: z.string().nullable().optional(),
  jobTitle: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
})

export const projectExperienceSchema = z.object({
  company: z.string().nullable().optional(),
  startTime: z.string().nullable().optional(),
  endTime: z.string().nullable().optional(),
  jobTitle: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  outcome: z.string().nullable().optional(),
})

export const educationSchema = z.object({
  school: z.string().nullable().optional(),
  startTime: z.string().nullable().optional(),
  endTime: z.string().nullable().optional(),
  campusExperience: z.string().nullable().optional(),
})

export const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  personalInfo: personalInfoSchema,
  workExperiences: z.array(workExperienceSchema),
  projectExperiences: z.array(projectExperienceSchema),
  educations: z.array(educationSchema),
})

export type FormData = z.infer<typeof formSchema>

interface ResumeFormProps {
  initialData?: FormData;
  onSubmit: (data: FormData) => Promise<void>;
  onCancel: () => void;
  submitButtonText?: string;
  title?: string;
}

export function ResumeForm({
  initialData,
  onSubmit,
  onCancel,
  submitButtonText = "Save",
  title = "Resume"
}: ResumeFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
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
          <h1 className="text-2xl font-medium text-[#2D2D2D]">{title}</h1>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <h2 className="text-xl font-medium mb-4">Position title</h2>
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
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
                <Button type="submit">
                  {submitButtonText}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
} 