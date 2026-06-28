import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer>
      <div className="content">
        <div className="footer-left">
          <img src="/Logo.png" alt="YSJ" />
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
            <a href="mailto:ysciencejournal@gmail.com" className="social">
              <i className="fa-solid fa-envelope"></i>ysciencejournal@gmail.com
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
