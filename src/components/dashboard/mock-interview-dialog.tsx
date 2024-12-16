"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

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
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      resume: "",
      job: "",
      language: "english",
      others: "",
    },
  })

  const onSubmit = (data: FormData) => {
    console.log(data)
    onOpenChange(false)
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
              name="job"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-[#2D2D2D]">
                    Job <span className="text-red-500">*</span>
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
            >
              Subscribe
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

