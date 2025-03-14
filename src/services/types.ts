// API Request Types
export interface CreateAccountRequest {
  account: string
  password: string
}

// API Response Types
export interface ApiResponse<T = any> {
  code: number
  status: 'success' | 'fail'
  message?: string
  data?: T
}

export interface CreateAccountResponse extends ApiResponse {
  accountId?: number
}

export interface LoginResponse extends ApiResponse {
  accountId?: number
  token?: string
}

export interface CreateJDRequest {
  title: string
  company: string
  companyDetail: string
  jobDesc: string
}

export interface CreateJDResponse extends ApiResponse {}

export interface CreatePaymentRequest {
  amount: string
  method: string
  currency: string
  description?: string
}

export interface CreatePaymentResponse extends ApiResponse {}

export interface GetJDListRequest {}

export interface GetJDListResponse extends ApiResponse {
  jdId: number
  title: string
  company: string
  companyDetail: string
  jobDesc: string
}

export interface PersonalInfo {
  name: string
  location: string
  phone: string
  email: string
  linkedinUrl: string
}

export interface WorkExperience {
  company: string
  startTime: string
  endTime: string
  jobTitle: string
  description: string
}

export interface ProjectExperience extends WorkExperience {
  outcome: string
}

export interface Education {
  school: string
  startTime: string
  endTime: string
  campusExperience: string
}

export interface CreateResumeRequest {
  title: string
  type: string
  personInfo: string
  workExperience: string
  projectExperience: string
  education: string
}

export interface CreateResumeResponse extends ApiResponse {}

export interface FetchResumeListResponse extends ApiResponse {}

export interface FetchResumeDetailResponse extends ApiResponse {
  resumeId: number
  title: string
  type: string
  personInfo: string
  workExperience: string
  projectExperience: string
  education: string
}

export interface CreateInterviewRequest {
  resumeId: string
  jobId: string
}

export interface CreateInterviewResponse extends ApiResponse<string> {}

export interface StartInterviewRequest {
  interviewId: string
}

export interface StartInterviewResponse extends ApiResponse {
  res: string
  interviewId: string
}

export interface VoiceFileToTextResponse extends ApiResponse {
  text: string
}