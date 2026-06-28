import axios from 'axios'

const adminApi = axios.create({
  baseURL: '/api/admin',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

adminApi.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('adminLoggedIn')
      window.location.href = '/admin'
    }
    return Promise.reject(err)
  },
)

export default adminApi
