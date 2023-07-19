import axios from 'axios'

import AsyncStorage from '@react-native-async-storage/async-storage'
import { BASE_URL } from '../app/config'

const defaultOptions = {
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
}

const axiosInstance = axios.create(defaultOptions)

// Set the AUTH token for any request
axiosInstance.interceptors.request.use(async (config) => {
  const userInfo = await AsyncStorage.getItem('userData')
  const parsedUserInfo = JSON.parse(userInfo)
  config.headers.Authorization = `Bearer ${parsedUserInfo.access_token}`

  return config
})

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log('axiosInstance.interceptors.response.use', {
      error: JSON.stringify(error),
    })
    if (error?.response?.status === 401) {
      console.log('error')
    } else {
      return Promise.reject(error)
    }
  }
)

export default axiosInstance
