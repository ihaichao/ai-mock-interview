"use client"

import { useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import useSWRMutation from "swr/mutation"
import { API_ROUTES, fetchResumeList, fetchJDList, createInterview } from "@/services/api"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/hooks/use-toast"

interface MockInterviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const formSchema = z.object({
  resume: z.string().nonempty("Resume is required"),
  job: z.string().nonempty("Job is required"),
  language: z.enum(["english", "chinese"]).default("english"),
  others: z.string().optional(),
})

type FormData = z.infer<typeof formSchema>

export function MockInterviewDialog({ open, onOpenChange }: MockInterviewDialogProps) {
  const router = useRouter()
  const { toast } = useToast()

  // Fetch resume list
  const { trigger: fetchResumes, data: resumeData } = useSWRMutation<any>(
    API_ROUTES.FETCH_RESUME_LIST,
    fetchResumeList
  )

  // Fetch job list
  const { trigger: fetchJDs, data: jobData } = useSWRMutation<any>(
    API_ROUTES.GET_JD_LIST,
    fetchJDList
  )

  // Start interview mutation
  const { trigger: startInterviewTrigger, isMutating: isStarting } = useSWRMutation(
    API_ROUTES.CREATE_INTERVIEW,
    (key, { arg }) => createInterview(arg)
  )

  // Initialize form
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      resume: "",
      job: "",
      language: "english",
      others: "",
    },
  })

  // Fetch data when dialog opens
  useEffect(() => {
    if (open) {
      fetchResumes()
      fetchJDs()
    }
  }, [open, fetchResumes, fetchJDs])

  const onSubmit = async (data: FormData) => {
    try {
      const result = await startInterviewTrigger({
        resumeId: data.resume,
        jobId: data.job,
      } as any)

      if (result.status) {
        toast({
          title: "Success",
          description: "Interview session created successfully",
        })
        onOpenChange(false)
        // Redirect to interview room with the interview ID
        router.push(`/dashboard/interview/${result.data}`)
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.message || "Failed to start interview",
        })
      }
    } catch (error) {
      console.error('Start interview error:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to start interview session",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[800px] p-6">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-medium text-[#2D2D2D]">Interview information</DialogTitle>
          {/* <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full p-0 hover:bg-gray-100"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button> */}
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="resume"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-[#2D2D2D]">
                    Resume <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12 rounded-xl bg-[#F8F9FA] px-4 text-base">
                        <SelectValue placeholder="Select a resume" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {resumeData?.data?.map((resume: any) => (
                        <SelectItem key={resume.resumeId} value={String(resume.resumeId)}>
                          {resume.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="job"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-[#2D2D2D]">
                    Job <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12 rounded-xl bg-[#F8F9FA] px-4 text-base">
                        <SelectValue placeholder="Select a job" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {jobData?.data?.map((job: any) => (
                        <SelectItem key={job.jdId} value={String(job.jdId)}>
                          {job.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-sm font-medium text-[#2D2D2D]">Language</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2 rounded-lg bg-[#F8F9FA] px-4 py-3">
                        <RadioGroupItem value="english" id="english" />
                        <label htmlFor="english" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          English
                        </label>
                      </div>
                      <div className="flex items-center space-x-2 rounded-lg bg-[#F8F9FA] px-4 py-3">
                        <RadioGroupItem value="chinese" id="chinese" />
                        <label htmlFor="chinese" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          Chinese
                        </label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="others"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-[#2D2D2D]">Others</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="For example:It is hoped that mock interviews can set relevant questions regarding certain aspects of abilities, such as communication skills, language expression abilities, professional competence, and stress tolerance, etc."
                      className="min-h-[100px] rounded-xl bg-[#F8F9FA] p-4 text-base placeholder:text-[#6C757D]"
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full rounded-lg bg-black py-3 text-sm font-medium text-white hover:bg-black/90"
              disabled={isStarting}
            >
              {isStarting ? "Starting..." : "Create Interview"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

