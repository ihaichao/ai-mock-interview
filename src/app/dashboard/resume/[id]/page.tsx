"use client"

import { useEffect } from "react"
import { Card, CardContent } from '@/components/ui/card'
import useSWRMutation from "swr/mutation"
import { API_ROUTES, fetchResumeDetail } from "@/services/api"
import { WorkExperience, ProjectExperience, Education } from '@/services/types'
import { formatDate } from "@/lib/utils"

export default function ResumePage({ params }: { params: any }) {
  const { trigger: fetchResume, data, error, isMutating } = useSWRMutation(
    `${API_ROUTES.FETCH_RESUME_DETAIL}`,
    () => fetchResumeDetail(params.id)
  )

  useEffect(() => {
    fetchResume()
  }, [fetchResume])

  if (isMutating) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center text-red-500">Failed to load resume details</div>
      </div>
    )
  }

  const resumeData = data?.data ? {
    ...data.data,
    personInfo: JSON.parse(data.data.personInfo),
    workExperience: JSON.parse(data.data.workExperience),
    projectExperience: JSON.parse(data.data.projectExperience),
    education: JSON.parse(data.data.education)
  } : null

  console.log("resumeData", resumeData)

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">简历详情</h1>
      
      <Card>
        <CardContent className="p-6 space-y-6">
          {/* Personal Information */}
          <div>
            <h1 className="text-2xl font-bold mb-6">{resumeData?.title}</h1>
            <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500">Name</label>
                <p>{resumeData?.personInfo?.name || '-'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Location</label>
                <p>{resumeData?.personInfo?.location || '-'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Phone</label>
                <p>{resumeData?.personInfo?.phone || '-'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Email</label>
                <p>{resumeData?.personInfo?.email || '-'}</p>
              </div>
              <div className="col-span-2">
                <label className="text-sm text-gray-500">LinkedIn</label>
                <p>{resumeData?.personInfo?.linkedinUrl || '-'}</p>
              </div>
              <div className="col-span-2">
                <label className="text-sm text-gray-500">Introduction</label>
                <p>{resumeData?.personInfo?.personIntroduction || '-'}</p>
              </div>
            </div>
          </div>

          {/* Work Experience */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Work Experience</h2>
            <div className="space-y-4">
              {resumeData?.workExperience?.map((work: WorkExperience, index: number) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-500">Company</label>
                      <p>{work.company}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Job Title</label>
                      <p>{work.jobTitle}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Period</label>
                      <p>{formatDate(work.startTime)} - {formatDate(work.endTime)}</p>
                    </div>
                    <div className="col-span-2">
                      <label className="text-sm text-gray-500">Description</label>
                      <p>{work.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Project Experience */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Project Experience</h2>
            <div className="space-y-4">
              {resumeData?.projectExperience?.map((project: ProjectExperience, index: number) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-500">Company</label>
                      <p>{project.company}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Project Title</label>
                      <p>{project.jobTitle}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Period</label>
                      <p>{project.startTime} - {project.endTime}</p>
                    </div>
                    <div className="col-span-2">
                      <label className="text-sm text-gray-500">Description</label>
                      <p>{project.description}</p>
                    </div>
                    <div className="col-span-2">
                      <label className="text-sm text-gray-500">Outcome</label>
                      <p>{project.outcome}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Education</h2>
            <div className="space-y-4">
              {resumeData?.education?.map((education: Education, index: number) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-500">School</label>
                      <p>{education.school}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Period</label>
                      <p>{education.startTime} - {education.endTime}</p>
                    </div>
                    <div className="col-span-2">
                      <label className="text-sm text-gray-500">Campus Experience</label>
                      <p>{education.campusExperience}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}