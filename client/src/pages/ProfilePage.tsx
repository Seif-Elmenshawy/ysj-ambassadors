import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { User, Copy, CheckCircle, MapPin, Building2, BookOpen } from 'lucide-react'
import api from '../api/client'
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

export default function ProfilePage() {
  const { user, setUser } = useAuth()
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    country: user?.country || '',
    state: user?.state || '',
    city: user?.city || '',
    organization: user?.organization || '',
    bio: user?.bio || '',
  })
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const updateMutation = useMutation({
    mutationFn: (data: any) => api.put('/ambassadors/profile', data),
    onSuccess: (res) => {
      setUser(res.data)
      setSuccess('Profile updated successfully')
      setTimeout(() => setSuccess(''), 3000)
    },
    onError: () => setError('Failed to update profile'),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    updateMutation.mutate(form)
  }

  const copyCode = () => {
    if (user?.referralCode) {
      navigator.clipboard.writeText(user.referralCode)
      setSuccess('Referral code copied!')
      setTimeout(() => setSuccess(''), 2000)
    }
  }

  const set = (key: string, val: string) => setForm({ ...form, [key]: val })

  return (
    <PageTransition>
      <div style={{ padding: '120px 5% 60px', maxWidth: 1000, margin: 'auto' }}>
        <div className="page-header">
          <h1>My Profile</h1>
          <p>Manage your personal information and ambassador details.</p>
        </div>

        <div style={{ display: 'grid', gap: 32, gridTemplateColumns: '1fr 1.5fr' }}>
          <div>
            <div className="card" style={{ textAlign: 'center', padding: 32 }}>
              <div style={{
                width: 88, height: 88, borderRadius: '50%', background: 'var(--surface)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '3px solid var(--red)', margin: '0 auto 16px',
              }}>
                <User size={40} color="var(--red)" />
              </div>
              <h2 style={{ fontSize: 20, marginBottom: 4 }}>{user?.name}</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 4 }}>{user?.email}</p>
              {user?.phone && <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>{user.phone}</p>}

              <div style={{ margin: '20px 0', textAlign: 'left', fontSize: 14, color: 'var(--text-muted)' }}>
                {user?.country && <p style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}><MapPin size={14} /> {[user.country, user.state, user.city].filter(Boolean).join(', ')}</p>}
                {user?.organization && <p style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}><Building2 size={14} /> {user.organization}</p>}
                {user?.bio && <p style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}><BookOpen size={14} style={{ marginTop: 2 }} /> {user.bio}</p>}
              </div>

              <div className="code-box" style={{ padding: 20 }}>
                <p className="code-label">Referral Code</p>
                <span className="code-value" style={{ fontSize: 22 }}>{user?.referralCode}</span>
                <button onClick={copyCode} className="btn btn-sm" style={{ marginTop: 12, background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <Copy size={16} /> Copy Code
                </button>
              </div>
            </div>
          </div>

          <div>
            <form className="form-wrap" onSubmit={handleSubmit}>
              <h3 style={{ fontSize: 16, marginBottom: 16 }}>Edit Information</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label>Full Name</label>
                  <input type="text" className="form-input" value={form.name} onChange={(e) => set('name', e.target.value)} required />
                </div>
                <div>
                  <label>Email</label>
                  <input type="email" className="form-input" value={user?.email || ''} disabled style={{ opacity: 0.6 }} />
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Email cannot be changed</p>
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
                <div style={{ gridColumn: '1 / -1' }}>
                  <label>Bio</label>
                  <textarea className="form-input" style={{ minHeight: 80, resize: 'vertical' }} placeholder="Tell us about yourself..." value={form.bio} onChange={(e) => set('bio', e.target.value)} />
                </div>
              </div>
              {error && <p style={{ color: 'var(--red)', fontSize: 13, marginTop: 8 }}>{error}</p>}
              {success && <p style={{ color: '#059669', fontSize: 13, marginTop: 8, display: 'flex', alignItems: 'center', gap: 4 }}><CheckCircle size={14} /> {success}</p>}
              <button type="submit" className="btn" style={{ marginTop: 16 }}>
                {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
