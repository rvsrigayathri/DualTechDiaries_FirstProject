import { useState, useEffect } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import DashboardPage from './pages/DashboardPage'
import HomePage from './pages/HomePage'
import { clearStoredBackendId } from './api/resume'

function AppContent() {
  const { user, isAuthenticated, loading } = useAuth()

  // Routing based on hash (works seamlessly on Vercel without server rewrites)
  const getRouteFromHash = () => {
    const hash = window.location.hash || ''
    if (hash.startsWith('#/register')) return 'register'
    if (hash.startsWith('#/forgot-password')) return 'forgot-password'
    if (hash.startsWith('#/builder')) return 'builder'
    if (hash.startsWith('#/dashboard')) return 'dashboard'
    if (hash.startsWith('#/login')) return 'login'
    return isAuthenticated ? 'dashboard' : 'login'
  }

  const [route, setRoute] = useState(getRouteFromHash)
  const [activeResumeId, setActiveResumeId] = useState(null)
  const [mobileTab, setMobileTab] = useState('form')

  // Parse resume ID from hash query params if present, e.g. #/builder?id=12
  const checkHashParams = () => {
    const hash = window.location.hash || ''
    const match = hash.match(/\?id=(\d+)/)
    if (match) {
      setActiveResumeId(Number(match[1]))
    }
  }

  // Hash change listener
  useEffect(() => {
    const handleHashChange = () => {
      setRoute(getRouteFromHash())
      checkHashParams()
    }
    window.addEventListener('hashchange', handleHashChange)
    checkHashParams()
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [isAuthenticated])

  // Navigation helper
  const navigate = (destination, params = {}) => {
    if (destination === 'builder') {
      if (params.id) {
        setActiveResumeId(params.id)
        window.location.hash = `#/builder?id=${params.id}`
      } else {
        setActiveResumeId(null)
        window.location.hash = '#/builder'
      }
      if (params.preview) {
        setMobileTab('preview')
      } else {
        setMobileTab('form')
      }
    } else {
      window.location.hash = `#/${destination}`
    }
    setRoute(destination)
  }

  // Handle protected route redirects
  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated && (route === 'dashboard' || route === 'builder')) {
        window.location.hash = '#/login'
        setRoute('login')
      } else if (isAuthenticated && (route === 'login' || route === 'register')) {
        window.location.hash = '#/dashboard'
        setRoute('dashboard')
      }
    }
  }, [isAuthenticated, loading, route])

  // Loading state during initial session verification
  if (loading) {
    return (
      <div className="auth-splash-loader">
        <div className="auth-splash-card">
          <div className="auth-brand-badge">📄 ResumeCraft</div>
          <div className="spinner" />
          <p>Verifying secure session…</p>
        </div>
      </div>
    )
  }

  // Unauthenticated routes
  if (!isAuthenticated) {
    if (route === 'register') {
      return <RegisterPage onNavigate={navigate} />
    }
    if (route === 'forgot-password') {
      return <ForgotPasswordPage onNavigate={navigate} />
    }
    return <LoginPage onNavigate={navigate} />
  }

  // Authenticated routes
  if (route === 'dashboard') {
    return (
      <DashboardPage
        onNavigate={navigate}
        onLoadResume={(id, preview = false) => navigate('builder', { id, preview })}
        onCreateNew={() => {
          clearStoredBackendId()
          setActiveResumeId(null)
          localStorage.removeItem('resumecraft_draft_v2')
          navigate('builder')
        }}
      />
    )
  }

  // Resume Builder route (HomePage)
  return (
    <HomePage
      onGoDashboard={() => navigate('dashboard')}
      resumeIdToLoad={activeResumeId}
      initialMobileTab={mobileTab}
    />
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
