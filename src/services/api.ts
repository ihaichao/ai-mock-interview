import { fetchApi } from './fetch'
import { CreateAccountRequest, CreateAccountResponse, GetJDListRequest, GetJDListResponse, LoginResponse } from './types'
import { CreateJDResponse, CreateJDRequest } from './types'
import { CreatePaymentResponse, CreatePaymentRequest } from './types'
// Base API configuration
const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? '' 
  : 'https://www.2100wbtc.com:8080'

export const API_ROUTES = {
  CREATE_ACCOUNT: `${API_BASE_URL}/mockInterview/register`,
  LOGIN: `${API_BASE_URL}/mockInterview/login`,
  CREATE_JD: `${API_BASE_URL}/mockInterview/jd/create`,
  CREATE_PAYMENT: `${API_BASE_URL}/mockInterview/payment/create`,
  GET_JD_LIST: `${API_BASE_URL}/mockInterview/jd/list`
} as const


export const createAccount = fetchApi<CreateAccountResponse, CreateAccountRequest>
export const login = fetchApi<LoginResponse, CreateAccountRequest> 
export const createJD = fetchApi<CreateJDResponse, CreateJDRequest>
export const fetchJDList = fetchApi<GetJDListResponse, GetJDListRequest>
export const createPayment = fetchApi<CreatePaymentResponse, CreatePaymentRequest>