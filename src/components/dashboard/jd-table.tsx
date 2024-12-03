import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Eye, Pencil, Trash2 } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface JobDescription {
  title: string
  company: string
  companyDetails: string
  jobDescription: string
}

const jobs: JobDescription[] = [
  {
    title: "Product Manager",
    company: "Aditi Consulting",
    companyDetails: "Aditi Consulting is a firm that st...",
    jobDescription: "Responsible for the product planni..."
  },
  {
    title: "Health Product Manager",
    company: "Oracle",
    companyDetails: "Aditi Consulting is a firm that st...",
    jobDescription: "Responsible for the product planni..."
  },
  {
    title: "Java Developer",
    company: "Wipro",
    companyDetails: "Wipro is a technology services and...",
    jobDescription: "Must have : JavaScript, Java/Sprin..."
  },
]

export function JDTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-[#F8F9FA]">
          <TableHead className="w-[20%] py-3 text-sm font-medium text-[#6C757D]">Job Title</TableHead>
          <TableHead className="w-[20%] py-3 text-sm font-medium text-[#6C757D]">Company</TableHead>
          <TableHead className="w-[25%] py-3 text-sm font-medium text-[#6C757D]">Company Details</TableHead>
          <TableHead className="w-[25%] py-3 text-sm font-medium text-[#6C757D]">Job Description</TableHead>
          <TableHead className="w-[10%] py-3 text-sm font-medium text-[#6C757D]">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {jobs.map((job, index) => (
          <TableRow key={index} className="border-b">
            <TableCell className="py-4 font-medium">{job.title}</TableCell>
            <TableCell className="py-4">{job.company}</TableCell>
            <TableCell className="py-4">{job.companyDetails}</TableCell>
            <TableCell className="py-4">{job.jobDescription}</TableCell>
            <TableCell className="py-4">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-[#6C757D] hover:text-[#4AE68A]">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-[#6C757D] hover:text-[#4AE68A]">
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-[#6C757D] hover:text-red-500">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

