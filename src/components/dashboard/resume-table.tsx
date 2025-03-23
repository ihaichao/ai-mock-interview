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
import useSWRMutation from "swr/mutation"
import { API_ROUTES, fetchResumeList } from "@/services/api"
import { useEffect } from "react"
import { useRouter } from 'next/navigation'
import { LoadingIndicator } from "@/components/ui/loading-indicator"

interface Resume {
  resumeId: number
  title: string
  type: string
  uploadDate: string
}

export function ResumeTable() {
  const router = useRouter()
  const { trigger: fetchResumes, data, error, isMutating } = useSWRMutation<any>(
    API_ROUTES.FETCH_RESUME_LIST,
    fetchResumeList
  )

  const resumeList = data?.data || []

  useEffect(() => {
    fetchResumes()
  }, [fetchResumes])

  const handleView = (resumeId: number) => {
    router.push(`/dashboard/resume/${resumeId}`)
  }

  if (isMutating) {
    return (
      <div className="flex h-64 items-center justify-center">
        <LoadingIndicator message="Loading resumes..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-64 flex-col items-center justify-center text-red-500">
        <p className="mb-2 text-lg">Failed to load resume list</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => fetchResumes()}
        >
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-[#F8F9FA]">
          <TableHead className="w-[40%] py-3 text-sm font-medium text-[#6C757D]">Name</TableHead>
          <TableHead className="w-[20%] py-3 text-sm font-medium text-[#6C757D]">Type</TableHead>
          <TableHead className="w-[25%] py-3 text-sm font-medium text-[#6C757D]">Upload Date</TableHead>
          <TableHead className="w-[15%] py-3 text-sm font-medium text-[#6C757D]">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {resumeList.length > 0 ? (
          resumeList.map((resume: Resume) => (
            <TableRow key={resume.resumeId} className="border-b">
              <TableCell className="py-4 font-medium">{resume.title}</TableCell>
              <TableCell className="py-4">{resume.type}</TableCell>
              <TableCell className="py-4">{resume.uploadDate}</TableCell>
              <TableCell className="py-4">
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-[#6C757D] hover:text-[#4AE68A]"
                    onClick={() => handleView(resume.resumeId)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-[#6C757D] hover:text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={4} className="h-48 text-center text-muted-foreground">
              No resumes found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}

