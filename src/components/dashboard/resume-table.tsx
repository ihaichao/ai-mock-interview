import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Eye, Trash2 } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface Resume {
  name: string
  type: string
  uploadDate: string
}

const resumes: Resume[] = [
  { name: "Product Manager", type: "docx", uploadDate: "11 Nov, 2024" },
  { name: "Product Manager", type: "pdf", uploadDate: "11 Nov, 2024" },
  { name: "https://www.maimai.cn/1863541.com", type: "maimai url", uploadDate: "11 Nov, 2024" },
  { name: "Product Manager", type: "docx", uploadDate: "11 Nov, 2024" },
]

export function ResumeTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-[#F8F9FA]">
          <TableHead className="w-[40%] py-3 text-sm font-medium text-[#6C757D]">Resume</TableHead>
          <TableHead className="w-[20%] py-3 text-sm font-medium text-[#6C757D]">Type</TableHead>
          <TableHead className="w-[20%] py-3 text-sm font-medium text-[#6C757D]">Upload Date</TableHead>
          <TableHead className="w-[20%] py-3 text-sm font-medium text-[#6C757D]">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {resumes.map((resume, index) => (
          <TableRow key={index} className="border-b">
            <TableCell className="py-4 font-medium">{resume.name}</TableCell>
            <TableCell className="py-4">{resume.type}</TableCell>
            <TableCell className="py-4">{resume.uploadDate}</TableCell>
            <TableCell className="py-4">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-[#6C757D] hover:text-[#4AE68A]">
                  <Eye className="h-4 w-4" />
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

