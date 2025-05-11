import axios, { AxiosError } from 'axios'
import type { AxiosRequestConfig } from 'axios'

export const customInstance = async <T>(config: AxiosRequestConfig): Promise<T> => {
  const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000',
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true, // Important for cookies
  })

  // Add a response interceptor for error handling
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      // Handle 401 errors (unauthorized)
      if (error.response?.status === 401) {
        // You can add custom logic here, like redirecting to login
        console.error('Unauthorized access')
      }
      return Promise.reject(error)
    }
  )

  const { data } = await axiosInstance(config)
  return data
} 