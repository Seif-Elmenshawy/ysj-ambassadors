import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { GraduationCap, Share2, Award, Users, BookOpen } from 'lucide-react'

export default function HomePage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <section className="hero-section">
        <div className="hero-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <BookOpen size={20} color="#d13c3c" />
            <span style={{ color: '#d13c3c', fontWeight: 600, fontSize: 14, textTransform: 'uppercase', letterSpacing: 1.5 }}>
              Youth Science Journal
            </span>
          </div>
          <h1>
            YSJ <span style={{ color: '#d13c3c' }}>Ambassador</span> Program
          </h1>
          <p className="hero-tagline">
            Join the Youth Science Journal Ambassador Program and help us build a global community
            of young researchers. Share your passion for science, refer fellow researchers, and earn rewards for every approved sign-up.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="btn btn-lg">Become an Ambassador</Link>
            <Link to="/login" className="btn btn-outline btn-lg">Sign In</Link>
          </div>
        </div>
        <div className="hero-visual">
          <svg width="340" height="340" viewBox="0 0 400 400">
            <defs>
              <linearGradient id="heroBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#d13c3c" stopOpacity="0.06" />
                <stop offset="100%" stopColor="#1F2937" stopOpacity="0.02" />
              </linearGradient>
              <linearGradient id="heroRing" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#d13c3c" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#d13c3c" stopOpacity="0.05" />
              </linearGradient>
            </defs>
            <circle cx="200" cy="200" r="185" fill="url(#heroBg)" />
            <circle cx="200" cy="200" r="160" fill="none" stroke="url(#heroRing)" strokeWidth="2" strokeDasharray="8 6" />
            <circle cx="200" cy="155" r="70" fill="#d13c3c" opacity="0.06" />
            <text x="200" y="172" textAnchor="middle" fill="#d13c3c" fontSize="72" fontWeight="800" fontFamily="'Baloo Paaji 2', sans-serif">YSJ</text>
            <text x="200" y="240" textAnchor="middle" fill="#555" fontSize="18" fontFamily="Poppins" fontWeight="500" letterSpacing="2">Ambassadors</text>
            <text x="148" y="285" textAnchor="middle" fill="#d13c3c" fontSize="22" opacity="0.25">🔬</text>
            <text x="252" y="285" textAnchor="middle" fill="#1F2937" fontSize="22" opacity="0.2">📖</text>
          </svg>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 20 }}>
        <div className="divider" />
        <h2 className="section-title">How It Works</h2>
        <p className="section-subtitle">
          Four simple steps to becoming a YSJ Ambassador and making an impact in the research community.
        </p>
        <div className="grid-4">
          {[
            { icon: GraduationCap, title: 'Register', desc: 'Create your ambassador account in seconds and join a network of young researchers.' },
            { icon: Share2, title: 'Share Your Code', desc: 'Get a unique referral link to share with fellow researchers and students.' },
            { icon: Users, title: 'Refer Researchers', desc: 'Invite others to join YSJ programs using your personalized referral code.' },
            { icon: Award, title: 'Earn Rewards', desc: 'Track your referrals and earn rewards for each approved sign-up to the program.' },
          ].map((item, i) => (
            <div key={i} className="feature-card">
              <div className="feature-icon">
                <item.icon size={26} />
              </div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section stats-row" style={{ maxWidth: 1000 }}>
        {[
          { num: '500+', desc: 'Active Ambassadors' },
          { num: '50+', desc: 'Countries Reached' },
          { num: '2,000+', desc: 'Referrals Tracked' },
          { num: '98%', desc: 'Satisfaction Rate' },
        ].map((s, i) => (
          <div key={i} className="stat-item">
            <div className="stat-num">{s.num}</div>
            <div className="stat-desc">{s.desc}</div>
          </div>
        ))}
      </section>
    </motion.div>
  )
}
