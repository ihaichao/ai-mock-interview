"use client"

import { useState, useEffect } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Eye, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { getInterviewList } from "@/services/api"
import { InterviewItem } from "@/services/types"
import { useToast } from "@/components/hooks/use-toast"
import { LoadingIndicator } from "@/components/ui/loading-indicator"
import { formatDate } from "@/lib/utils"

export function InterviewTable() {
  const router = useRouter()
  const { toast } = useToast()
  const [interviews, setInterviews] = useState<InterviewItem[]>([])
  const [loading, setLoading] = useState(true)
  const [total] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)

  // 获取面试列表数据
  const fetchInterviews = async (currentPage = page, currentPageSize = pageSize) => {
    setLoading(true)
    try {
      const response = await getInterviewList({
        page: currentPage,
        pageSize: currentPageSize
      })

      if (response.status && response.data) {
        setInterviews(response.data || [])
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: response.message || "Failed to load interviews"
        })

      }
    } catch (error) {
      console.error("Error fetching interviews:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while loading interviews"
      })
    } finally {
      setLoading(false)
    }
  }

  // 页面加载时获取数据
  useEffect(() => {
    fetchInterviews()
  }, [])

  // 处理页码变化
  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    fetchInterviews(newPage, pageSize)
  }

  // 计算总页数
  const totalPages = Math.ceil(total / pageSize)

  // 处理查看面试结果
  const handleViewResult = (id: string) => {
    router.push(`/dashboard/interview/${id}/result`)
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <LoadingIndicator message="Loading interviews..." />
      </div>
    )
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow className="bg-[#F8F9FA]">
            <TableHead className="w-[25%] py-3 text-sm font-medium text-[#6C757D]">Title</TableHead>
            <TableHead className="w-[20%] py-3 text-sm font-medium text-[#6C757D]">Company</TableHead>
            <TableHead className="w-[15%] py-3 text-sm font-medium text-[#6C757D]">Date</TableHead>
            <TableHead className="w-[10%] py-3 text-sm font-medium text-[#6C757D]">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {interviews.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No interviews found.
              </TableCell>
            </TableRow>
          ) : (
            interviews.map((interview) => (
              <TableRow key={interview.id} className="border-b">
                <TableCell className="py-4 font-medium">{interview.title}</TableCell>
                <TableCell className="py-4">{interview.company}</TableCell>
                <TableCell className="py-4">{formatDate(interview.createTime)}</TableCell>
                <TableCell className="py-4">
                  <Button 
                    variant="ghost" 
                    className="h-8 gap-2 px-3 text-sm font-medium text-[#6C757D] hover:bg-gray-100 hover:text-[#2D2D2D]"
                    onClick={() => handleViewResult(interview.interviewId)}
                  >
                    <Eye className="h-4 w-4" />
                    View Report
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      
      {/* 分页控件 */}
      {total > 0 && (
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {Math.min((page - 1) * pageSize + 1, total)} to {Math.min(page * pageSize, total)} of {total} entries
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

