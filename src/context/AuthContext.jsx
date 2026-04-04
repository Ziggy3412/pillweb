import { createContext, useContext, useState } from 'react'
import { API_BASE_URL as API_URL } from '../api.js'

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
  const [user, setUser] = useState(() => readStoredUser())

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
    if (data.user) localStorage.setItem('pillpal_user', JSON.stringify(data.user))
    setUser(data.user)
    return data.user
  }

  async function logout() {
    localStorage.removeItem('pillpal_token')
    localStorage.removeItem('pillpal_user')
    await fetch(`${API_URL}/auth/logout`, { method: 'POST', credentials: 'include' }).catch(() => {})
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
