interface RequestOptions<T> {
  arg: T
}

export async function fetchApi<TResponse, TRequest = any>(
  url: string, 
  { arg }: RequestOptions<TRequest>
): Promise<TResponse> {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(arg)
  })

  if (!response.ok) {
    throw new Error('Network response was not ok')
  }

  return response.json()
} 