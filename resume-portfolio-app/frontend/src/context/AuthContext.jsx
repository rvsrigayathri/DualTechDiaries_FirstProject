import { createContext, useContext, useState, useEffect } from 'react'
import {
  getAuthToken,
  setAuthToken,
  clearAuthToken,
  getStoredUser,
  setStoredUser,
  clearStoredUser,
  loginUser,
  registerUser,
  fetchCurrentUser,
  requestPasswordReset,
  resetPassword
} from '../api/auth'
import { clearStoredBackendId } from '../api/resume'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser())
  const [token, setToken] = useState(() => getAuthToken())
  const [loading, setLoading] = useState(true)

  // Verify stored session on app load
  useEffect(() => {
    async function verifySession() {
      const existingToken = getAuthToken()
      if (existingToken) {
        try {
          const freshUser = await fetchCurrentUser(existingToken)
          if (freshUser) {
            setUser(freshUser)
            setStoredUser(freshUser)
          } else {
            setUser(null)
            setToken(null)
            clearAuthToken()
            clearStoredUser()
          }
        } catch {
          // If network is offline, keep stored user state
        }
      }
      setLoading(false)
    }
    verifySession()
  }, [])

  const login = async (email, password, remember = true) => {
    const data = await loginUser({ email, password })
    if (data.token && data.user) {
      setToken(data.token)
      setUser(data.user)
      setAuthToken(data.token, remember)
      setStoredUser(data.user, remember)
    }
    return data
  }

  const register = async (fullName, email, password, confirmPassword) => {
    const data = await registerUser({ fullName, email, password, confirmPassword })
    if (data.token && data.user) {
      setToken(data.token)
      setUser(data.user)
      setAuthToken(data.token, true)
      setStoredUser(data.user, true)
    }
    return data
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    clearAuthToken()
    clearStoredUser()
    clearStoredBackendId()
    localStorage.removeItem('resumecraft_draft_v2')
    window.location.hash = '#/login'
  }

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    login,
    register,
    logout,
    requestForgotPassword: requestPasswordReset,
    performPasswordReset: resetPassword
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
