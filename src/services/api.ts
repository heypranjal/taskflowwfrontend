import axios from 'axios'
import { supabase } from '@/lib/supabase'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

export const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use(async (config) => {
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (r) => r,
  (error) => {
    if (error.response?.data?.message) {
      error.friendlyMessage = error.response.data.message
    } else if (error.response?.status === 401) {
      error.friendlyMessage = 'Your session has expired. Please sign in again.'
    } else {
      error.friendlyMessage = 'Unable to reach the server.'
    }
    return Promise.reject(error)
  },
)
