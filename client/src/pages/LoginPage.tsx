import { useState } from 'react'
import { Link } from 'react-router-dom'
import { LogIn } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import PageTransition from '../components/Common/PageTransition'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await login(form.email, form.password)
    } catch {
      setError('Invalid email or password')
    }
  }

  return (
    <PageTransition>
      <div className="auth-page">
        <div className="auth-container" style={{ maxWidth: 420 }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ width: 56, height: 56, borderRadius: 12, background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
              <LogIn size={26} color="white" />
            </div>
            <h1 style={{ fontSize: 22 }}>Welcome Back</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 4 }}>Sign in to your Ambassador account</p>
          </div>
          <form className="form-wrap" onSubmit={handleSubmit}>
            <div>
              <label>Email</label>
              <input type="email" className="form-input" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div>
              <label>Password</label>
              <input type="password" className="form-input" placeholder="••••••" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            </div>
            {error && <p style={{ color: 'var(--red)', fontSize: 13, marginTop: -4 }}>{error}</p>}
            <button type="submit" className="btn btn-lg" style={{ width: '100%', marginTop: 8 }}>Sign In</button>
          </form>
          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--text-muted)' }}>
            Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>Register</Link>
          </p>
          <p style={{ textAlign: 'center', marginTop: 8, fontSize: 13, color: 'var(--text-muted)' }}>
            <Link to="/admin" style={{ color: 'var(--red)' }}>Admin Login</Link>
          </p>
        </div>
      </div>
    </PageTransition>
  )
}
