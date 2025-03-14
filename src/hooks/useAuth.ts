import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface AuthState {
  isAuthenticated: boolean
  email: string | null
  token: string | null
  loading: boolean
}

export function useAuth(requireAuth: boolean = false, redirectPath: string = '/sign-in') {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    email: null,
    token: null,
    loading: true
  })
  
  const router = useRouter()

  useEffect(() => {
    // 在客户端检查 localStorage
    if (typeof window !== 'undefined') {
      const email = localStorage.getItem('email')
      const token = localStorage.getItem('token')
      
      const isAuthenticated = Boolean(email && token)
      
      setAuthState({
        isAuthenticated,
        email,
        token,
        loading: false
      })
      
      // 如果需要认证但用户未登录，则重定向
      if (requireAuth && !isAuthenticated) {
        router.push(redirectPath)
      }
    }
  }, [requireAuth, redirectPath, router])

  // 登录函数
  const login = (email: string, token: string) => {
    localStorage.setItem('email', email)
    localStorage.setItem('token', token)
    
    setAuthState({
      isAuthenticated: true,
      email,
      token,
      loading: false
    })
  }

  // 登出函数
  const logout = () => {
    localStorage.removeItem('email')
    localStorage.removeItem('token')
    
    setAuthState({
      isAuthenticated: false,
      email: null,
      token: null,
      loading: false
    })
    
    router.push('/sign-in')
  }

  return {
    ...authState,
    login,
    logout
  }
} 