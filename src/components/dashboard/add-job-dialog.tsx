"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

interface AddJobDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const formSchema = z.object({
  jobLink: z.string().url({ message: "Please enter a valid URL" }).nonempty("Job link is required"),
  jobTitle: z.string().nonempty("Job title is required"),
  company: z.string().nonempty("Company name is required"),
  companyDetails: z.string().nonempty("Company details are required"),
  jobDescription: z.string().nonempty("Job description is required")
})

type JobFormData = z.infer<typeof formSchema>

export function AddJobDialog({ open, onOpenChange }: AddJobDialogProps) {
  const form = useForm<JobFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobLink: "",
      jobTitle: "",
      company: "",
      companyDetails: "",
      jobDescription: ""
    }
  })

  const onSubmit = (data: JobFormData) => {
    console.log(data)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[800px] p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-medium text-[#2D2D2D]">Add Job Information</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="jobLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-[#2D2D2D]">
                    Job Link <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="https://example.com/job-posting"
                      className="h-12 rounded-xl bg-[#F8F9FA] px-4 text-base placeholder:text-[#6C757D]"
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="jobTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-[#2D2D2D]">
                      Job Title <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Job Title"
                        className="h-12 rounded-xl bg-[#F8F9FA] px-4 text-base placeholder:text-[#6C757D]"
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-[#2D2D2D]">
                      Company <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Company"
                        className="h-12 rounded-xl bg-[#F8F9FA] px-4 text-base placeholder:text-[#6C757D]"
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="companyDetails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-[#2D2D2D]">
                    Company details <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Copy and paste the company description here"
                      className="min-h-[100px] rounded-xl bg-[#F8F9FA] p-4 text-base placeholder:text-[#6C757D]"
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="jobDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-[#2D2D2D]">
                    Job Description <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Copy and paste the job description here"
                      className="min-h-[100px] rounded-xl bg-[#F8F9FA] p-4 text-base placeholder:text-[#6C757D]"
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="h-10 px-6 rounded-lg border-[#E5E7EB] text-sm font-medium text-[#2D2D2D]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="h-10 px-6 rounded-lg bg-black text-sm font-medium text-white"
              >
                Save
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

