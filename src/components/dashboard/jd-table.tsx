import { useEffect } from "react"
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
import { API_ROUTES, fetchJDList } from "@/services/api"

interface JD {
  id: string
  title: string
  company: string
  companyDetail: string
  jobDesc: string
  createdAt: string
}

export function JDTable() {
  // 使用 useSWRMutation 获取 JD 列表
  const { trigger: fetchJDs, data, error, isMutating } = useSWRMutation<any>(
    API_ROUTES.GET_JD_LIST,
    fetchJDList
  )

  const jdList = data?.data

  // 组件加载时获取数据
  useEffect(() => {
    fetchJDs()
  }, [fetchJDs])

  if (isMutating) {
    return <div className="text-center py-4">Loading...</div>
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">Failed to load JD list</div>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-[#F8F9FA]">
          <TableHead className="w-[30%] py-3 text-sm font-medium text-[#6C757D]">Title</TableHead>
          <TableHead className="w-[25%] py-3 text-sm font-medium text-[#6C757D]">Company</TableHead>
          <TableHead className="w-[25%] py-3 text-sm font-medium text-[#6C757D]">Created At</TableHead>
          <TableHead className="w-[20%] py-3 text-sm font-medium text-[#6C757D]">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {jdList?.map((jd: JD) => (
          <TableRow key={jd.id} className="border-b">
            <TableCell className="py-4 font-medium">{jd.title}</TableCell>
            <TableCell className="py-4">{jd.company}</TableCell>
            <TableCell className="py-4">{new Date(jd.createdAt).toLocaleDateString()}</TableCell>
            <TableCell className="py-4">
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-[#6C757D] hover:text-[#4AE68A]"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-[#6C757D] hover:text-red-500"
                >
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

