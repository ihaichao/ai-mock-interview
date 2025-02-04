import { fetchApi } from './fetch'
import { 
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
  StartInterviewResponse
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
  TEXT_TO_VOICE: '/text-to-voice'
} as const


export const createAccount = fetchApi<CreateAccountResponse, CreateAccountRequest>
export const login = fetchApi<LoginResponse, CreateAccountRequest> 
export const createJD = fetchApi<CreateJDResponse, CreateJDRequest>
export const fetchJDList = fetchApi<GetJDListResponse, GetJDListRequest>
export const createPayment = fetchApi<CreatePaymentResponse, CreatePaymentRequest>
export const createResume = fetchApi<CreateResumeResponse, CreateResumeRequest>
export const fetchResumeList = () => fetchApi<FetchResumeListResponse, null>(API_ROUTES.FETCH_RESUME_LIST, { method: 'GET' })
export const fetchResumeDetail = (resumeId: string) => fetchApi<FetchResumeDetailResponse, null>(`${API_ROUTES.FETCH_RESUME_DETAIL}/${resumeId}`, { method: 'GET' })
export const createInterview = (params: CreateInterviewRequest) => fetchApi<CreateInterviewResponse, CreateInterviewRequest>(
  API_ROUTES.CREATE_INTERVIEW, 
  { method: 'GET', arg: params }
)
export const startInterview = (interviewId: string) => fetchApi<StartInterviewResponse, StartInterviewRequest>(
  API_ROUTES.START_INTERVIEW, 
  { method: 'GET', arg: { interviewId } }
)

// Add this new function for WebSocket text-to-voice
export const textToVoice = (text: string, onMessage: (audio: ArrayBuffer) => void): WebSocket => {
  // Create WebSocket connection
  const ws = new WebSocket('/text-to-voice')
  
  // Connection opened
  ws.onopen = () => {
    // Send the text to convert when connection is established
    ws.send(JSON.stringify(text))
  }
  
  // Listen for messages
  ws.onmessage = (event) => {
    // Convert the received data to ArrayBuffer
    event.data.arrayBuffer().then((buffer: ArrayBuffer) => {
      onMessage(buffer)
    })
  }

  // Handle errors
  ws.onerror = (error) => {
    console.error('WebSocket Error:', error)
  }

  // Return the WebSocket instance so the caller can close it when needed
  return ws
}