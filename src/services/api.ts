// Base API configuration
const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? '' 
  : 'https://www.2100wbtc.com:8080'

export const API_ROUTES = {
  CREATE_ACCOUNT: `${API_BASE_URL}/mockInterview/createAccount`,
  LOGIN: `${API_BASE_URL}/mockInterview/login`,
  // Add other API routes here
} as const