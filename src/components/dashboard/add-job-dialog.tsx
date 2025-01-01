"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import useSWRMutation from 'swr/mutation'
import { API_ROUTES } from "@/services/api"
import { createJD } from "@/services/api"
import { useToast } from "@/components/hooks/use-toast"

interface AddJobDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const formSchema = z.object({
  title: z.string().nonempty("Job title is required"),
  company: z.string().nonempty("Company name is required"),
  companyDetail: z.string().nonempty("Company details are required"),
  jobDesc: z.string().nonempty("Job description is required")
})

type JobFormData = z.infer<typeof formSchema>

export function AddJobDialog({ open, onOpenChange }: AddJobDialogProps) {
  const { toast } = useToast()
  const { trigger: createJDTrigger, isMutating } = useSWRMutation(
    API_ROUTES.CREATE_JD,
    createJD
  )
  const form = useForm<JobFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {}
  })

  const onSubmit = async (data: JobFormData) => {
    try {
      const result = await createJDTrigger(data)
      
      if (result.status) {
        toast({
          title: "Success",
          description: "Job description created successfully",
        })
        onOpenChange(false)
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.message || "Failed to create job description",
        })
      }
    } catch (error) {
      console.error('error :>> ', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create job description",
      })
    }
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
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-[#2D2D2D]">
                    Job Title <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
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
                      className="h-12 rounded-xl bg-[#F8F9FA] px-4 text-base placeholder:text-[#6C757D]"
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="companyDetail"
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
              name="jobDesc"
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
                disabled={isMutating}
                onClick={() => onSubmit(form.getValues())}
              >
                {isMutating ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

