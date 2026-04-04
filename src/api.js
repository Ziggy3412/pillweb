import { API_URL } from './config.js'

/** Single source of truth for the backend base URL. Change this (or VITE_API_URL in .env) to point to a different backend. */
export const API_BASE_URL = API_URL

async function request(method, path, body) {
  const token = localStorage.getItem('pillpal_token')
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `HTTP ${res.status}`)
  }

  if (res.status === 204) return null
  return res.json()
}

export const api = {
  get: (path) => request('GET', path),
  post: (path, body) => request('POST', path, body),
  delete: (path) => request('DELETE', path),
}
