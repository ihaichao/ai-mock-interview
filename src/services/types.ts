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

// 添加面试评估结果的类型定义
export interface SkillScore {
  name: string;
  score: number;
  tooltip?: string;
}

export interface InterviewEvaluation {
  received_data: {
    'Attitude and Professionalism': number;
    'Communication Skills': number;
    'Problem-Solving Ability': number;
    'Professional Knowledge': number;
    'Self-awareness and Learning Ability': number;
    'Teamwork and Interpersonal Skills': number;
  }
}

export interface GetInterviewEvaluationResponse {
  status: boolean;
  message?: string;
  data?: InterviewEvaluation;
}

// 用户个人资料类型
export interface UserProfile {
  id: string;
  email: string;
  username: string;
  isMember: boolean;
  memberExpireDate: string;
  createTime: string;
  modifyTime: string;
}

export interface GetUserProfileResponse extends ApiResponse {
  data?: UserProfile;
}

export interface StartChatRequest {
  interviewId: string
  userInput: string
}

// 忘记密码请求类型
export interface ForgotPasswordRequest {
  email: string;
}

// 忘记密码响应类型
export interface ForgotPasswordResponse extends ApiResponse {
  code: number;
  message: string;
}

// 面试列表项类型
export interface InterviewItem {
  id: string;
  title: string;
  company: string;
  position: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// 获取面试列表响应类型
export interface GetInterviewListResponse extends ApiResponse {
  data?: {
    list: InterviewItem[];
    total: number;
  };
}

// 获取面试列表请求参数类型
export interface GetInterviewListRequest {
  page?: number;
  pageSize?: number;
}

// 关闭面试响应类型
export interface CloseInterviewResponse extends ApiResponse {}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface ResetPasswordResponse extends ApiResponse {}

export interface DeleteResumeResponse extends ApiResponse {}