interface RequestOptions<T> {
  arg: T
}

export async function fetchApi<TResponse, TRequest = any>(
  url: string, 
  { arg }: RequestOptions<TRequest>
): Promise<TResponse> {
  const response = await fetch(url, {
    method: 'POST',
    // credentials: 'include',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      'X-Token': localStorage.getItem('token') || '',
      'X-Email': localStorage.getItem('email') || '',
    },
    body: JSON.stringify(arg)
  })

  if (!response.ok) {
    throw new Error('Network response was not ok')
  }

  return response.json()
} 