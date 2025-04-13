import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Eye, Trash2, Pencil } from 'lucide-react'
import { Button } from "@/components/ui/button"
import useSWRMutation from "swr/mutation"
import { API_ROUTES, fetchResumeList, deleteResume } from "@/services/api"
import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import { LoadingIndicator } from "@/components/ui/loading-indicator"
import { useToast } from "@/components/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Resume {
  resumeId: number
  title: string
  type: string
  uploadDate: string
}

export function ResumeTable() {
  const router = useRouter()
  const { toast } = useToast()
  const [deleteResumeId, setDeleteResumeId] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

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

  const handleEdit = (resumeId: number) => {
    router.push(`/dashboard/resume/${resumeId}/edit`)
  }

  const handleDelete = async () => {
    if (!deleteResumeId) return

    try {
      setIsDeleting(true)
      const result = await deleteResume(deleteResumeId.toString())
      
      if (result.status) {
        toast({
          title: "Resume Deleted",
          description: "The resume has been successfully deleted.",
        })
        // 重新获取简历列表
        fetchResumes()
      } else {
        toast({
          variant: "destructive",
          title: "Delete Failed",
          description: result.message || "Failed to delete resume. Please try again.",
        })
      }
    } catch (error) {
      console.error('Delete resume error:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while deleting the resume.",
      })
    } finally {
      setIsDeleting(false)
      setDeleteResumeId(null)
    }
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
    <>
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
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-[#6C757D] hover:text-[#4AE68A]"
                      onClick={() => handleEdit(resume.resumeId)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-[#6C757D] hover:text-red-500"
                      onClick={() => setDeleteResumeId(resume.resumeId)}
                      disabled={isDeleting}
                    >
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

      {/* 删除确认对话框 */}
      <AlertDialog open={!!deleteResumeId} onOpenChange={() => setDeleteResumeId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Resume</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this resume? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

