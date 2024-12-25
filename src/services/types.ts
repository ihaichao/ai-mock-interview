// API Request Types
export interface CreateAccountRequest {
  account: string
  password: string
}

// API Response Types
export interface ApiResponse<T = any> {
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