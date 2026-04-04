import { useState, useEffect, useCallback, startTransition } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { api } from '../api.js'

const cacheKey = (userId) => `pillpal_pills_${userId}`

export function usePills() {
  const { user } = useAuth()
  const [pills, setPills] = useState([])

  const fetchPills = useCallback(async (userId) => {
    try {
      const data = await api.get('/api/pills')
      setPills(data)
      localStorage.setItem(cacheKey(userId), JSON.stringify(data))
    } catch (err) {
      console.error('[pills] fetch failed:', err)
    }
  }, [])

  useEffect(() => {
    startTransition(() => {
      if (!user?.id) {
        setPills([])
        return
      }
      try {
        const cached = localStorage.getItem(cacheKey(user.id))
        if (cached) setPills(JSON.parse(cached))
      } catch {
        /* ignore corrupt cache */
      }
      fetchPills(user.id)
    })
  }, [user?.id, fetchPills])

  function addPill(pill) {
    setPills((prev) => {
      const next = [...prev, pill]
      if (user?.id) localStorage.setItem(cacheKey(user.id), JSON.stringify(next))
      return next
    })
  }

  async function deletePill(id) {
    await api.delete(`/api/pills/${id}`)
    setPills((prev) => {
      const next = prev.filter((p) => p.id !== id)
      if (user?.id) localStorage.setItem(cacheKey(user.id), JSON.stringify(next))
      return next
    })
  }

  function updatePill(updated) {
    setPills((prev) => {
      const next = prev.map((p) => (p.id === updated.id ? updated : p))
      if (user?.id) localStorage.setItem(cacheKey(user.id), JSON.stringify(next))
      return next
    })
  }

  const refresh = useCallback(() => {
    if (user?.id) fetchPills(user.id)
  }, [user, fetchPills])

  return { pills, addPill, deletePill, updatePill, refresh }
}
