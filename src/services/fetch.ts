interface RequestOptions<T> {
  arg?: T
  method?: 'GET' | 'POST'
  headers?: Record<string, string>
  timeout?: number
}

interface SSEOptions<T> {
  arg: T
  onMessage: (data: any) => void
  onError?: (error: any) => void
}

// Base API configuration
export const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? '' 
  : 'https://www.2100wbtc.com:8080'

export async function fetchApi<TResponse, TRequest = any>(
  url: string, 
  { arg, method = 'POST', headers, timeout = 60000 }: RequestOptions<TRequest>
): Promise<TResponse> {
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'X-Token': localStorage.getItem('token') || '',
    'X-Email': localStorage.getItem('email') || '',
  }

  let finalUrl = API_BASE_URL + url
  const requestOptions: RequestInit & { timeout?: number } = {
    method,
    mode: 'cors',
    headers: {
      ...defaultHeaders,
      ...headers
    },
    timeout // 设置超时时间为 60 秒
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
    // 如果是 FormData 类型，不要设置 Content-Type，让浏览器自动处理
    if (arg instanceof FormData) {
      if (requestOptions.headers) {
        delete (requestOptions.headers as any)['Content-Type'];
      }
      requestOptions.body = arg;
    } else {
      requestOptions.body = JSON.stringify(arg);
    }
  }

  const response = await fetch(finalUrl, requestOptions)

  console.log('response :>> ', response);

  // if (!response.ok) {
  //   throw new Error('Network response was not ok')
  // }

  const data = await response.json()

  if (data.code === 401) {
    window.location.href = '/sign-in'
  }

  return data
}

export async function fetchSSE<TRequest>(
  url: string,
  { arg, onMessage, onError }: SSEOptions<TRequest>
) {
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'X-Token': localStorage.getItem('token') || '',
    'X-Email': localStorage.getItem('email') || '',
  }

  const finalUrl = API_BASE_URL + url
  const response = await fetch(finalUrl, {
    method: 'POST',
    headers: defaultHeaders,
    body: JSON.stringify(arg)
  })

  if (!response.ok) {
    throw new Error('Network response was not ok')
  }

  const reader = response.body?.getReader()
  const decoder = new TextDecoder()

  if (!reader) {
    throw new Error('Failed to get response reader')
  }

  try {
    while (true) {
      const { done, value } = await reader.read()
      
      if (done) {
        break
      }

      // Decode the received chunk
      const chunk = decoder.decode(value)
      
      // Split the chunk into lines and process each line
      const lines = chunk.split('\n')
      for (const line of lines) {
        if (line.startsWith('data:')) {
          try {
            const data = JSON.parse(line.slice(5))
            onMessage(data)
          } catch (error) {
            console.error('Error parsing SSE data:', error)
          }
        }
      }
    }
  } catch (error) {
    console.error('SSE Error:', error)
    onError?.(error)
  } finally {
    reader.cancel()
  }
}