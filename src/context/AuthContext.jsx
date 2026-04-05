import { createContext, useContext, useState } from 'react'
import { API_BASE_URL as API_URL } from '../api.js'
import { api } from '../api.js'

const AuthContext = createContext(null)

function readStoredUser() {
  const token = localStorage.getItem('pillpal_token')
  const savedUser = localStorage.getItem('pillpal_user')
  if (!token || !savedUser) return null
  try {
    return JSON.parse(savedUser)
  } catch {
    localStorage.removeItem('pillpal_user')
    localStorage.removeItem('pillpal_token')
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser]           = useState(() => readStoredUser())
  const [onboarded, setOnboarded] = useState(() => {
    const u = readStoredUser()
    // Treat existing stored sessions as onboarded so we don't show the flow on page refresh
    return u ? (u.onboarded ?? true) : false
  })
  const [onboardedLoading, setOnboardedLoading] = useState(false)

  async function login(credential) {
    const res = await fetch(`${API_URL}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ credential }),
    })
    if (!res.ok) throw new Error('Login failed')
    const data = await res.json()
    if (data.token) localStorage.setItem('pillpal_token', data.token)
    if (data.user)  localStorage.setItem('pillpal_user', JSON.stringify(data.user))
    setUser(data.user)

    // Check onboarding status from backend
    setOnboardedLoading(true)
    try {
      const me = await api.get('/api/user/me')
      const isOnboarded = me.onboarded === true
      setOnboarded(isOnboarded)
      // Update cached user with latest onboarded flag
      const updated = { ...data.user, onboarded: isOnboarded }
      localStorage.setItem('pillpal_user', JSON.stringify(updated))
      setUser(updated)
    } catch {
      // If the endpoint fails, default to showing onboarding so they can set up
      setOnboarded(false)
    } finally {
      setOnboardedLoading(false)
    }

    return data.user
  }

  async function logout() {
    localStorage.removeItem('pillpal_token')
    localStorage.removeItem('pillpal_user')
    await fetch(`${API_URL}/auth/logout`, { method: 'POST', credentials: 'include' }).catch(() => {})
    setUser(null)
    setOnboarded(false)
  }

  function markOnboarded() {
    setOnboarded(true)
    if (user) {
      const updated = { ...user, onboarded: true }
      localStorage.setItem('pillpal_user', JSON.stringify(updated))
      setUser(updated)
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, onboarded, onboardedLoading, markOnboarded }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
