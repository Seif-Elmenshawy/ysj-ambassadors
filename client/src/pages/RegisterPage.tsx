import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserPlus } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import PageTransition from '../components/Common/PageTransition'

const countries = [
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan',
  'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi',
  'Cabo Verde', 'Cambodia', 'Cameroon', 'Canada', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic',
  'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic',
  'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia',
  'Fiji', 'Finland', 'France',
  'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana',
  'Haiti', 'Honduras', 'Hungary',
  'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy',
  'Jamaica', 'Japan', 'Jordan',
  'Kazakhstan', 'Kenya', 'Kiribati', 'Kuwait', 'Kyrgyzstan',
  'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg',
  'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar',
  'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 'North Macedonia', 'Norway',
  'Oman',
  'Pakistan', 'Palau', 'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal',
  'Qatar',
  'Romania', 'Russia', 'Rwanda',
  'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Korea', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria',
  'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu',
  'Uganda', 'Ukraine', 'UAE', 'United Kingdom', 'USA', 'Uruguay', 'Uzbekistan',
  'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam',
  'Yemen',
  'Zambia', 'Zimbabwe',
  'Other'
]

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '',
    country: '', state: '', city: '', organization: '', bio: '',
  })
  const [error, setError] = useState('')
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await register(form.name, form.email, form.password, form.phone,
        form.country, form.state, form.city, form.organization, form.bio)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Registration failed')
    }
  }

  const set = (key: string, val: string) => setForm({ ...form, [key]: val })

  return (
    <PageTransition>
      <div className="auth-page">
        <div className="auth-container" style={{ maxWidth: 600 }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ width: 56, height: 56, borderRadius: 12, background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
              <UserPlus size={26} color="white" />
            </div>
            <h1 style={{ fontSize: 22 }}>Become an Ambassador</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 4 }}>Join the Youth Science Journal Ambassador Program</p>
          </div>
          <form className="form-wrap" onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label>Full Name <span style={{ color: 'var(--red)' }}>*</span></label>
                <input type="text" className="form-input" placeholder="Dr. Ahmed Ali" value={form.name} onChange={(e) => set('name', e.target.value)} required />
              </div>
              <div>
                <label>Email <span style={{ color: 'var(--red)' }}>*</span></label>
                <input type="email" className="form-input" placeholder="ahmed@example.com" value={form.email} onChange={(e) => set('email', e.target.value)} required />
              </div>
              <div>
                <label>Password <span style={{ color: 'var(--red)' }}>*</span></label>
                <input type="password" className="form-input" placeholder="Min 6 characters" value={form.password} onChange={(e) => set('password', e.target.value)} required minLength={6} />
              </div>
              <div>
                <label>Phone</label>
                <input type="tel" className="form-input" placeholder="+20 100 000 0000" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
              </div>
              <div>
                <label>Country</label>
                <select className="form-input" value={form.country} onChange={(e) => set('country', e.target.value)}>
                  <option value="">Select country</option>
                  {countries.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label>State / Province</label>
                <input type="text" className="form-input" placeholder="e.g. Cairo Governorate" value={form.state} onChange={(e) => set('state', e.target.value)} />
              </div>
              <div>
                <label>City</label>
                <input type="text" className="form-input" placeholder="e.g. Cairo" value={form.city} onChange={(e) => set('city', e.target.value)} />
              </div>
              <div>
                <label>Organization</label>
                <input type="text" className="form-input" placeholder="University / School" value={form.organization} onChange={(e) => set('organization', e.target.value)} />
              </div>
            </div>
            <div style={{ marginTop: 16 }}>
              <label>Bio (optional)</label>
              <textarea className="form-input" style={{ minHeight: 80, resize: 'vertical' }} placeholder="Tell us about yourself, your research interests, and why you want to be an ambassador..." value={form.bio} onChange={(e) => set('bio', e.target.value)} />
            </div>
            {error && <p style={{ color: 'var(--red)', fontSize: 13, marginTop: 8 }}>{error}</p>}
            <button type="submit" className="btn btn-lg" style={{ width: '100%', marginTop: 16 }}>Create Account</button>
          </form>
          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--text-muted)' }}>
            Already registered? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign In</Link>
          </p>
        </div>
      </div>
    </PageTransition>
  )
}
