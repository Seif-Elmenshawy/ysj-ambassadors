import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import api from '../api/client'

interface User {
  _id: string
  name: string
  email: string
  phone?: string
  country?: string
  state?: string
  city?: string
  organization?: string
  bio?: string
  avatar?: string
  referralCode?: string
  totalReferrals?: number
  rewards?: number
  score?: number
}

interface AuthContextType {
  user: User | null
  token: string | null
  role: string | null
  login: (email: string, password: string) => Promise<void>
  setUser: (user: User | null) => void
  register: (name: string, email: string, password: string, phone?: string, country?: string, state?: string, city?: string, organization?: string, bio?: string) => Promise<void>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [role, setRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    const storedRole = localStorage.getItem('role')
    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
      setRole(storedRole)
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password })
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    localStorage.setItem('role', 'ambassador')
    setToken(data.token)
    setUser(data.user)
    setRole('ambassador')
  }

  const register = async (name: string, email: string, password: string, phone?: string, country?: string, state?: string, city?: string, organization?: string, bio?: string) => {
    const { data } = await api.post('/auth/register', { name, email, password, phone, country, state, city, organization, bio })
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    localStorage.setItem('role', 'ambassador')
    setToken(data.token)
    setUser(data.user)
    setRole('ambassador')
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('role')
    setToken(null)
    setUser(null)
    setRole(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, role, login, register, logout, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
