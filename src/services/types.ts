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