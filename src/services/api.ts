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
  FetchResumeDetailResponse
} from './types'

export const API_ROUTES = {
  CREATE_ACCOUNT: '/mockInterview/register',
  LOGIN: '/mockInterview/login',
  CREATE_JD: '/mockInterview/jd/create',
  CREATE_PAYMENT: '/mockInterview/payment/create',
  GET_JD_LIST: '/mockInterview/jd/list',
  CREATE_RESUME: '/mockInterview/resume/create',
  FETCH_RESUME_LIST: '/mockInterview/resume/list',
  FETCH_RESUME_DETAIL: '/mockInterview/resume/getById'
} as const


export const createAccount = fetchApi<CreateAccountResponse, CreateAccountRequest>
export const login = fetchApi<LoginResponse, CreateAccountRequest> 
export const createJD = fetchApi<CreateJDResponse, CreateJDRequest>
export const fetchJDList = fetchApi<GetJDListResponse, GetJDListRequest>
export const createPayment = fetchApi<CreatePaymentResponse, CreatePaymentRequest>
export const createResume = fetchApi<CreateResumeResponse, CreateResumeRequest>
export const fetchResumeList = () => fetchApi<FetchResumeListResponse, null>(API_ROUTES.FETCH_RESUME_LIST, { method: 'GET' })
export const fetchResumeDetail = (resumeId: string) => fetchApi<FetchResumeDetailResponse, null>(`${API_ROUTES.FETCH_RESUME_DETAIL}/${resumeId}`, { method: 'GET' })