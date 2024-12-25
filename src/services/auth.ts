import { fetchApi } from './fetch'
import { CreateAccountRequest, CreateAccountResponse, LoginResponse } from './types'

export const createAccount = fetchApi<CreateAccountResponse, CreateAccountRequest>
export const login = fetchApi<LoginResponse, CreateAccountRequest> 