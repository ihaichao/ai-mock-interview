interface RequestOptions<T> {
  arg?: T
  method?: 'GET' | 'POST'
  headers?: Record<string, string>
}

// Base API configuration
const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? '' 
  : 'https://www.2100wbtc.com:8080'

export async function fetchApi<TResponse, TRequest = any>(
  url: string, 
  { arg, method = 'POST', headers }: RequestOptions<TRequest>
): Promise<TResponse> {
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'X-Token': localStorage.getItem('token') || '',
    'X-Email': localStorage.getItem('email') || '',
  }

  let finalUrl = API_BASE_URL + url
  const requestOptions: RequestInit = {
    method,
    mode: 'cors',
    headers: {
      ...defaultHeaders,
      ...headers
    }
  }

  // 如果是 GET 请求，将参数添加到 URL 上
  if (method === 'GET' && arg) {
    const queryParams = new URLSearchParams()
    Object.entries(arg).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString())
      }
    })
    const queryString = queryParams.toString()
    if (queryString) {
      finalUrl += `?${queryString}`
    }
  } else if (method === 'POST' && arg) {
    // POST 请求将参数放在 body 中
    requestOptions.body = JSON.stringify(arg)
  }

  const response = await fetch(finalUrl, requestOptions)

  if (!response.ok) {
    throw new Error('Network response was not ok')
  }

  const data = await response.json()

  if (data.code === 401) {
    window.location.href = '/sign-in'
  }

  return data
}