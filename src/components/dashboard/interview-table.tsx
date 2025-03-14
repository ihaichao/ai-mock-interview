import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Eye, Video } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import Link from 'next/link'

interface Interview {
  id: string
  job: string
  lastUpdated: string
  score?: number
  state: "Upcoming" | "Completed"
}

const interviews: Interview[] = [
  { job: "Java Engineer", lastUpdated: "11 Nov, 2024", state: "Upcoming", id: "0" },
  { job: "Product Manager", lastUpdated: "11 Nov, 2024", score: 87, state: "Completed", id: "1" },
  { job: "Java Engineer", lastUpdated: "11 Nov, 2024", score: 70, state: "Completed", id: "2" },
  { job: "Mobile Developer", lastUpdated: "11 Nov, 2024", score: 82, state: "Completed", id: "3" },
]

export function InterviewTable() {
  const router = useRouter()

  const handleJoinInterview = () => {
    router.push('/dashboard/interview/1') // Using a dummy ID of 1
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-[#F8F9FA]">
          <TableHead className="w-[30%] py-3 text-sm font-medium text-[#6C757D]">Job</TableHead>
          <TableHead className="w-[20%] py-3 text-sm font-medium text-[#6C757D]">Last Updated</TableHead>
          <TableHead className="w-[20%] py-3 text-sm font-medium text-[#6C757D]">Score</TableHead>
          <TableHead className="w-[15%] py-3 text-sm font-medium text-[#6C757D]">State</TableHead>
          <TableHead className="w-[15%] py-3 text-sm font-medium text-[#6C757D]">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {interviews.map((interview, index) => (
          <TableRow key={index} className="border-b">
            <TableCell className="py-4 font-medium">{interview.job}</TableCell>
            <TableCell className="py-4">{interview.lastUpdated}</TableCell>
            <TableCell className="py-4">{interview.score || "-"}</TableCell>
            <TableCell className="py-4">
              <span 
                className={`inline-block rounded-full px-3 py-1 text-sm ${
                  interview.state === "Completed" 
                    ? "bg-[#E7FAF0] text-[#4AE68A]" 
                    : "bg-[#FFF4E5] text-[#FFA500]"
                }`}
              >
                {interview.state}
              </span>
            </TableCell>
            <TableCell className="py-4">
              {interview.state === "Upcoming" ? (
                <Button 
                  variant="ghost" 
                  className="h-8 gap-2 px-3 text-sm font-medium text-[#4AE68A] hover:bg-[#E7FAF0] hover:text-[#4AE68A]"
                  onClick={handleJoinInterview}
                >
                  <Video className="h-4 w-4" />
                  Join In
                </Button>
              ) : (
                <Button 
                  variant="ghost" 
                  className="h-8 gap-2 px-3 text-sm font-medium text-[#6C757D] hover:bg-gray-100 hover:text-[#2D2D2D]"
                >
                  <Eye className="h-4 w-4" />
                  <Link
                    href={`/dashboard/interview/${interview.id}/result`}
                  >
                    View Report
                  </Link>
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

