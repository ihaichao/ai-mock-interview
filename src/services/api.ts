import { fetchApi, fetchSSE, API_BASE_URL } from './fetch'
import {
  Language,
  CreateAccountRequest, 
  CreateAccountResponse, 
  GetJDListRequest, 
  GetJDListResponse, 
  LoginResponse,
  CreateJDResponse,
  CreateJDRequest,
  CreatePaymentResponse,
  CreatePaymentRequest,
  CreateResumeResponse,
  CreateResumeRequest,
  FetchResumeListResponse,
  FetchResumeDetailResponse,
  CreateInterviewRequest,
  CreateInterviewResponse,
  StartInterviewRequest,
  StartInterviewResponse,
  GetInterviewEvaluationResponse,
  GetUserProfileResponse,
  StartChatRequest,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  GetInterviewListRequest,
  GetInterviewListResponse,
  CloseInterviewResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  DeleteResumeResponse,
  GetInterviewDetailResponse,
  CreateAlipayPaymentRequest,
  CreateAlipayPaymentResponse,
  UpdateResumeRequest,
  UpdateResumeResponse
} from './types'

export const API_ROUTES = {
  CREATE_ACCOUNT: '/mockInterview/register',
  LOGIN: '/mockInterview/login',
  CREATE_JD: '/mockInterview/jd/create',
  CREATE_PAYMENT: '/mockInterview/payment/create',
  GET_JD_LIST: '/mockInterview/jd/list',
  CREATE_RESUME: '/mockInterview/resume/create',
  FETCH_RESUME_LIST: '/mockInterview/resume/list',
  FETCH_RESUME_DETAIL: '/mockInterview/resume/getById',
  CREATE_INTERVIEW: '/mockInterview/interview/create',
  START_INTERVIEW: '/mockInterview/interview/start',
  VOICE_FILE_TO_TEXT: '/file/voice-to-text',
  START_CHAT: '/mockInterview/interview/startChat',
  UPLOAD_RESUME: '/mockInterview/resume/upload',
  GET_INTERVIEW_EVALUATION: '/mockInterview/interview/evaluate',
  GET_USER_PROFILE: '/mockInterview/profile/detail',
  FORGOT_PASSWORD: '/mockInterview/forgot-password',
  GET_INTERVIEW_LIST: '/mockInterview/ai-mock-interview/list',
  CLOSE_INTERVIEW: '/mockInterview/interview/closeInterview',
  RESET_PASSWORD: '/mockInterview/reset-password',
  DELETE_RESUME: '/mockInterview/resume/delete',
  GET_INTERVIEW_DETAIL: '/mockInterview/ai-mock-interview/interviewId',
  CREATE_ALIPAY_PAYMENT: '/mockInterview/alipay/payment/create',
  UPDATE_RESUME: '/mockInterview/resume/update',
} as const


export async function voiceFileToText(formData: FormData, language: Language) {
  const response = await fetch(`${API_BASE_URL}/file/voice-to-text`, {
    method: 'POST',
    headers: {
      'X-Token': localStorage.getItem('token') || '',
      'X-Email': localStorage.getItem('email') || '',
      language
    },
    body: formData
  })
  return response.json()
}

export const textToVoice = (text: string, onMessage: (audio: ArrayBuffer) => void): WebSocket => {
  const ws = new WebSocket(`${API_BASE_URL}/text-to-voice`)
  
  ws.onopen = () => {
    ws.send(JSON.stringify(text))
  }
  
  ws.onmessage = (event) => {
    event.data.arrayBuffer().then((buffer: ArrayBuffer) => {
      onMessage(buffer)
    })
  }

  ws.onerror = (error) => {
    console.error('WebSocket Error:', error)
  }

  return ws
}

export const textToVoiceEn = (text: string, onMessage: (audio: ArrayBuffer) => void): WebSocket => {
  const ws = new WebSocket(`${API_BASE_URL}/text-to-voice-en`)
  
  ws.onopen = () => {
    ws.send(JSON.stringify(text))
  }
  
  ws.onmessage = (event) => {
    event.data.arrayBuffer().then((buffer: ArrayBuffer) => {
      onMessage(buffer)
    })
  }

  ws.onerror = (error) => {
    console.error('WebSocket Error:', error)
  }

  return ws
}

export const voiceStreamToText = (onMessage: (text: string) => void): {
  ws: WebSocket;
  start: (audioChunk: Blob) => void;
  stop: () => void;
} => {
  const ws = new WebSocket(`${API_BASE_URL}/voice-to-text`)
  
  ws.onopen = () => {
    console.log('Voice to text WebSocket connection established')
  }
  
  ws.onmessage = (event) => {
    console.log('Voice to text WebSocket message received:', event)
    try {
      onMessage(event.data)
    } catch (error) {
      console.error('Error parsing voice-to-text response:', error)
    }
  }

  ws.onerror = (error) => {
    console.error('WebSocket Error:', error)
  }

  // 修改发送数据的方式
  const start = (audioChunk: Blob) => {
    if (ws.readyState === WebSocket.OPEN) {
      // 将 Blob 转换为 ArrayBuffer
      audioChunk.arrayBuffer().then(buffer => {
        // 发送原始二进制数据
        ws.send(buffer)
      }).catch(error => {
        console.error('Error converting blob to binary:', error)
      })
    } else {
      console.warn('WebSocket not open, state:', ws.readyState)
    }
  }

  const stop = () => {
    if (ws.readyState === WebSocket.OPEN) {
      // ws.send(JSON.stringify({ command: 'stop' }))
    }
  }

  return {
    ws,
    start,
    stop
  }
}

export const createAccount = fetchApi<CreateAccountResponse, CreateAccountRequest>
export const login = fetchApi<LoginResponse, CreateAccountRequest> 
export const createJD = fetchApi<CreateJDResponse, CreateJDRequest>
export const fetchJDList = fetchApi<GetJDListResponse, GetJDListRequest>
export const createResume = fetchApi<CreateResumeResponse, CreateResumeRequest>
export const fetchResumeList = () => fetchApi<FetchResumeListResponse, null>(API_ROUTES.FETCH_RESUME_LIST, { method: 'GET' })
export const fetchResumeDetail = (resumeId: string) => fetchApi<FetchResumeDetailResponse, null>(`${API_ROUTES.FETCH_RESUME_DETAIL}/${resumeId}`, { method: 'GET' })
export const createInterview = (params: CreateInterviewRequest & { headers?: Record<string, string> }) => fetchApi<CreateInterviewResponse, CreateInterviewRequest>(
  API_ROUTES.CREATE_INTERVIEW, 
  { 
    method: 'GET', 
    arg: params,
    headers: params.headers
  }
)
export const startInterview = (params: StartInterviewRequest) => fetchApi<StartInterviewResponse, StartInterviewRequest>(
  API_ROUTES.START_INTERVIEW, 
  { method: 'GET', arg: { interviewId: params.interviewId } as StartInterviewRequest, headers: { language: params.language } }
)

export const startChat = (
  params: StartChatRequest,
  headers: Record<string, string>,
  onMessage: (data: any) => void,
  onError?: (error: any) => void
) => {
  return fetchSSE<StartChatRequest>(
    API_ROUTES.START_CHAT,
    {
      arg: params,
      headers,
      onMessage,
      onError
    }
  )
}

export const uploadResume = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  
  return fetchApi<any, FormData>(
    API_ROUTES.UPLOAD_RESUME, 
    {
      method: 'POST',
      arg: formData
    }
  );
}

export const getInterviewEvaluation = (interviewId: string) => fetchApi<GetInterviewEvaluationResponse, null>(
  `${API_ROUTES.GET_INTERVIEW_EVALUATION}?interviewId=${interviewId}`, 
  { method: 'GET' }
)

export const getUserProfile = () => fetchApi<GetUserProfileResponse, null>(
  API_ROUTES.GET_USER_PROFILE, 
  { method: 'GET' }
)

export const forgotPassword = (email: string) => fetchApi<ForgotPasswordResponse, ForgotPasswordRequest>(
  API_ROUTES.FORGOT_PASSWORD,
  {
    method: 'POST',
    arg: { email }
  }
)

export const getInterviewList = (params?: GetInterviewListRequest) => 
  fetchApi<GetInterviewListResponse, GetInterviewListRequest>(
    API_ROUTES.GET_INTERVIEW_LIST, 
    { 
      method: 'GET',
      arg: params
    }
  )

export const closeInterview = (interviewId: string) => 
  fetchApi<CloseInterviewResponse, null>(
    `${API_ROUTES.CLOSE_INTERVIEW}?interviewId=${interviewId}`, 
    { method: 'GET' }
  )

export const resetPassword = (params: ResetPasswordRequest) => 
  fetchApi<ResetPasswordResponse, ResetPasswordRequest>(
    API_ROUTES.RESET_PASSWORD,
    {
      method: 'POST',
      arg: params
    }
  )

export const deleteResume = (resumeId: string) => 
  fetchApi<DeleteResumeResponse, null>(
    `${API_ROUTES.DELETE_RESUME}/${resumeId}`, 
    { method: 'GET' }
  )

export const getInterviewDetail = (interviewId: string) => 
  fetchApi<GetInterviewDetailResponse, null>(
    `${API_ROUTES.GET_INTERVIEW_DETAIL}/${interviewId}`, 
    { method: 'GET' }
  )

export const createPaypalPayment = (params: CreatePaymentRequest) => 
  fetchApi<CreatePaymentResponse, CreatePaymentRequest>(
    API_ROUTES.CREATE_PAYMENT,
    {
      method: 'POST',
      arg: params
    }
  )

export const createAlipayPayment = (params: CreateAlipayPaymentRequest) => 
  fetchApi<CreateAlipayPaymentResponse, CreateAlipayPaymentRequest>(
    API_ROUTES.CREATE_ALIPAY_PAYMENT,
    {
      method: 'POST',
      arg: params
    }
  )

export const updateResume = (resumeId: number, resume: UpdateResumeRequest) => 
  fetchApi<UpdateResumeResponse, UpdateResumeRequest>(
    `${API_ROUTES.UPDATE_RESUME}/${resumeId}`,
    {
      method: 'POST',
      arg: resume
    }
  )
