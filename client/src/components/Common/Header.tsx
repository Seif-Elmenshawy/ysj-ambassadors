import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LogOut, User, LayoutDashboard, LogIn, UserPlus } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const { user, token, logout } = useAuth()

  const isActive = (path: string) => location.pathname === path ? 'nav__link active-page' : 'nav__link'

  return (
    <header className="header">
      <nav className="nav container">
        <div className="nav__data">
          <Link to="/" className="nav__logo">
            <svg width="55" height="55" viewBox="0 0 60 60" fill="none">
              <rect width="60" height="60" rx="14" fill="#d13c3c" />
              <text x="30" y="36" textAnchor="middle" fill="white" fontSize="22" fontWeight="800" fontFamily="Poppins">YSJ</text>
            </svg>
            <span style={{ color: '#000', fontWeight: 600, fontSize: '1rem' }}>Ambassadors</span>
          </Link>

          <div className={`nav__toggle ${menuOpen ? 'show-icon' : ''}`} id="nav-toggle"
               onClick={() => setMenuOpen(!menuOpen)} style={{ cursor: 'pointer', position: 'relative', width: 32, height: 32 }}>
            <i className="fa-solid fa-bars nav__burger" style={{ position: 'absolute', fontSize: 25 }}></i>
            <i className="fa-solid fa-xmark nav__close" style={{ position: 'absolute', fontSize: 25 }}></i>
          </div>
        </div>

        <div className={`nav__menu ${menuOpen ? 'show-menu' : ''}`} id="nav-menu">
          <ul className="nav__list">
            {token ? (
              <>
                <li><Link to="/dashboard" className={isActive('/dashboard')} onClick={() => setMenuOpen(false)}>
                  <LayoutDashboard size={16} style={{ marginRight: 6 }} /> Dashboard
                </Link></li>
                <li><Link to="/profile" className={isActive('/profile')} onClick={() => setMenuOpen(false)}>
                  <User size={16} style={{ marginRight: 6 }} /> Profile
                </Link></li>
                <li>
                  <button onClick={() => { logout(); setMenuOpen(false) }}
                    className="nav__link" style={{ background: 'none', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left', fontSize: 'inherit', fontWeight: 'inherit', color: 'inherit' }}>
                    <LogOut size={16} style={{ marginRight: 6 }} /> Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li><Link to="/login" className={isActive('/login')} onClick={() => setMenuOpen(false)}>
                  <LogIn size={16} style={{ marginRight: 6 }} /> Login
                </Link></li>
                <li><Link to="/register" className={isActive('/register')} onClick={() => setMenuOpen(false)}>
                  <UserPlus size={16} style={{ marginRight: 6 }} /> Register
                </Link></li>
              </>
            )}
          </ul>
        </div>
      </nav>
    </header>
  )
}
