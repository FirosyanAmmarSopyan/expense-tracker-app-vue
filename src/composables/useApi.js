import axios from 'axios'
import { useRouter } from 'vue-router'

export const useApi = () => {
  const router = useRouter()
  const $api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
  })

  const getToken = () => localStorage.getItem('access_token')
  const getRefreshToken = () => localStorage.getItem('refresh_token')

  const refreshToken = async () => {
    try {
      const refreshToken = getRefreshToken()
      if (!refreshToken) {
        throw new Error('No refresh token available')
      }

      const response = await $api.post('/auth/refresh', {
        refreshToken
      })

      const { access_token, refresh_token } = response.data
      localStorage.setItem('access_token', access_token)
      localStorage.setItem('refresh_token', refresh_token)

      return access_token
    } catch (error) {
      // If refresh token fails, redirect to login
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      router.push('/login')
      throw error
    }
  }

  // Add request interceptor
  $api.interceptors.request.use(
    (config) => {
      const token = getToken()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  // Add response interceptor
  $api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config

      // If error is 401 and we haven't retried yet
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true

        try {
          const newToken = await refreshToken()
          originalRequest.headers.Authorization = `Bearer ${newToken}`
          return $api(originalRequest)
        } catch (refreshError) {
          return Promise.reject(refreshError)
        }
      }

      return Promise.reject(error)
    }
  )

  const get = async (url, params = {}) => {
    try {
      const response = await $api.get(url, { params })
      return response
    } catch (error) {
      throw error
    }
  }

  const post = async (url, data = {}) => {
    try {
      const response = await $api.post(url, data)
      return response
    } catch (error) {
      throw error
    }
  }

  const put = async (url, data = {}) => {
    try {
      const response = await $api.put(url, data)
      return response
    } catch (error) {
      throw error
    }
  }

  const patch = async (url, data = {}) => {
    try {
      const response = await $api.patch(url, data)
      return response
    } catch (error) {
      throw error
    }
  }

  const del = async (url, data = {}) => {
    try {
      const response = await $api.delete(url, { data })
      return response
    } catch (error) {
      throw error
    }
  }

  const helloFn = () => {}
  return {
    helloFn,
    get,
    post,
    put,
    del,
    patch
  }
}
