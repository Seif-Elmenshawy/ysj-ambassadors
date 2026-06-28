import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer>
      <div className="content">
        <div className="footer-left">
          <svg width="70" height="70" viewBox="0 0 60 60" fill="none">
            <rect width="60" height="60" rx="14" fill="#d13c3c" />
            <text x="30" y="36" textAnchor="middle" fill="white" fontSize="22" fontWeight="800" fontFamily="Poppins">YSJ</text>
          </svg>
          <h2>Youth Science Journal</h2>
          <p>Ambassador Program — Empowering young researchers worldwide.</p>
        </div>
        <div className="footer-right">
          <h2><strong>Website Managers: </strong>Kerlos Maged | Seif Elmeneshawy | Mohammed Assem</h2>
          <div className="socials">
            <a href="https://www.facebook.com/YouthScienceJournall" className="social" target="_blank" rel="noopener noreferrer">
              <i className="fa-brands fa-facebook"></i>Facebook
            </a>
            <a href="https://www.instagram.com/ysciencejournal" className="social" target="_blank" rel="noopener noreferrer">
              <i className="fa-brands fa-instagram"></i>Instagram
            </a>
            <a href="https://www.linkedin.com/company/ysj/" className="social" target="_blank" rel="noopener noreferrer">
              <i className="fa-brands fa-linkedin"></i>LinkedIn
            </a>
          </div>
          <Link to="/admin" style={{ color: '#5a5a5a', fontSize: 13, display: 'block', textAlign: 'center', marginTop: 20 }}>
            Admin Panel
          </Link>
        </div>
      </div>
      <h6 className="copy">© 2020-{new Date().getFullYear()} All Rights reserved | Youth Science Journal</h6>
    </footer>
  )
}
