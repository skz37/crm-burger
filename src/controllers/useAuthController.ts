import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function useAuthController() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')

  useEffect(() => {
    if (localStorage.getItem('crm_auth') === 'true') {
      setIsAuthenticated(true)
    }
    setIsCheckingAuth(false)
  }, [])

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (username === 'admin' && password === 'admin0') {
      router.push('/dashboard')
    } else if (username === 'user' && password === 'sherif0') {
      setIsAuthenticated(true)
      localStorage.setItem('crm_auth', 'true')
      setLoginError('')
    } else {
      setLoginError('Identifiants incorrects')
    }
  }

  function handleLogout() {
    setIsAuthenticated(false)
    localStorage.removeItem('crm_auth')
  }

  return {
    isAuthenticated,
    isCheckingAuth,
    username,
    setUsername,
    password,
    setPassword,
    loginError,
    handleLogin,
    handleLogout
  }
}
