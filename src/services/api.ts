import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

export const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.response.use(
  (r) => r,
  (error) => {
    if (error.response?.data?.message) {
      error.friendlyMessage = error.response.data.message
    } else {
      error.friendlyMessage = 'Unable to reach the server.'
    }
    return Promise.reject(error)
  },
)
