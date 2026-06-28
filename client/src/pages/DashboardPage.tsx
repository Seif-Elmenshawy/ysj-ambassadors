import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Users, CheckCircle, Clock, XCircle, Award, Copy, ExternalLink, Target, Zap, Trophy } from 'lucide-react'
import api from '../api/client'
import { useAuth } from '../context/AuthContext'
import PageTransition from '../components/Common/PageTransition'

function getTier(refs: number) {
  if (refs >= 30) return { label: 'Platinum', color: '#E5E4E2', icon: '💎' }
  if (refs >= 15) return { label: 'Gold', color: '#FFD700', icon: '🥇' }
  if (refs >= 5) return { label: 'Silver', color: '#C0C0C0', icon: '🥈' }
  return { label: 'Bronze', color: '#CD7F32', icon: '🥉' }
}

export default function DashboardPage() {
  const { user } = useAuth()

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['referralStats'],
    queryFn: () => api.get('/referrals/stats').then((r) => r.data),
  })

  const { data: referrals, isLoading: referralsLoading } = useQuery({
    queryKey: ['referrals'],
    queryFn: () => api.get('/referrals').then((r) => r.data),
  })

  const { data: myTasks, isLoading: tasksLoading } = useQuery({
    queryKey: ['myTasks'],
    queryFn: () => api.get('/referrals/tasks').then((r) => r.data),
  })

  const { data: leaderboard } = useQuery({
    queryKey: ['ambassadorLeaderboard'],
    queryFn: () => api.get('/ambassadors/leaderboard').then((r) => r.data),
  })

  const copyCode = () => {
    if (user?.referralCode) {
      navigator.clipboard.writeText(user.referralCode)
    }
  }

  if (statsLoading || referralsLoading) {
    return (
      <PageTransition>
        <div className="loading" style={{ position: 'relative', height: '60vh' }}>
          <div className="loader"><span>YSJ</span></div>
        </div>
      </PageTransition>
    )
  }

  const tier = getTier(stats?.total ?? 0)
  const activeTasks = myTasks?.filter((t: any) => !t.completed && new Date(t.expiresAt) > new Date()) ?? []
  const completedTasks = myTasks?.filter((t: any) => t.completed) ?? []

  return (
    <PageTransition>
      <div style={{ padding: '120px 5% 60px', maxWidth: 1200, margin: 'auto' }}>
        <div className="page-header">
          <h1>Welcome, {user?.name}</h1>
          <p>Your Ambassador Dashboard — track referrals, tasks, and rewards.</p>
        </div>

        <div className="code-box" style={{ marginBottom: 36 }}>
          <div>
            <p className="code-label">Your Referral Code</p>
            <span className="code-value">{user?.referralCode}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{
              padding: '8px 20px', borderRadius: 24, fontSize: 14, fontWeight: 700,
              background: tier.color + '20', color: tier.color, border: `2px solid ${tier.color}`,
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <span style={{ fontSize: 18 }}>{tier.icon}</span> {tier.label}
            </span>
            <button onClick={copyCode} className="btn btn-sm" style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Copy size={16} /> Copy
            </button>
          </div>
        </div>

        <div className="grid-4" style={{ marginBottom: 40 }}>
          {[
            { label: 'Total Referrals', value: stats?.total ?? 0, icon: Users, color: '#1F2937' },
            { label: 'Pending', value: stats?.pending ?? 0, icon: Clock, color: '#F59E0B' },
            { label: 'Approved', value: stats?.approved ?? 0, icon: CheckCircle, color: '#059669' },
            { label: 'Rejected', value: stats?.rejected ?? 0, icon: XCircle, color: '#d13c3c' },
            { label: 'Rewards Earned', value: stats?.rewards ?? 0, icon: Award, color: '#F59E0B' },
            { label: 'Score', value: stats?.score ?? 0, icon: Zap, color: '#8B5CF6' },
          ].map((card) => (
            <div key={card.label} className="stat-card">
              <card.icon size={28} color={card.color} style={{ marginBottom: 10 }} />
              <p className="stat-value" style={{ color: card.color }}>{card.value}</p>
              <p className="stat-label">{card.label}</p>
            </div>
          ))}
        </div>

        {!tasksLoading && activeTasks.length > 0 && (
          <div style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 22, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Target size={20} color="#d13c3c" /> Active Tasks
            </h2>
            <div style={{ display: 'grid', gap: 16 }}>
              {activeTasks.map((at: any) => {
                const pct = at.taskId ? Math.min(100, Math.round((at.progress / at.taskId.targetReferrals) * 100)) : 0
                const daysLeft = at.taskId ? Math.max(0, Math.ceil((new Date(at.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))) : 0
                return (
                  <div key={at._id} className="task-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
                      <div>
                        <strong style={{ fontSize: 16 }}>{at.taskId?.title}</strong>
                        {at.taskId?.description && <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 2 }}>{at.taskId.description}</p>}
                      </div>
                      <div style={{ textAlign: 'right', fontSize: 13, color: 'var(--text-muted)' }}>
                        <div>{daysLeft}d remaining</div>
                        <div style={{ color: '#8B5CF6', fontWeight: 600, marginTop: 2 }}>+{at.taskId?.score} pts</div>
                      </div>
                    </div>
                    <div style={{ marginBottom: 6, fontSize: 14, color: 'var(--text-primary)' }}>
                      {at.progress} / {at.taskId?.targetReferrals} referrals
                    </div>
                    <div className="progress-track">
                      <div className={`progress-fill ${pct >= 100 ? 'green' : pct >= 50 ? 'orange' : ''}`} style={{ width: `${pct}%` }} />
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{pct}% complete</div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {!tasksLoading && completedTasks.length > 0 && (
          <div style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 22, marginBottom: 20 }}>Completed Tasks</h2>
            <div style={{ display: 'grid', gap: 10 }}>
              {completedTasks.map((at: any) => (
                <div key={at._id} className="task-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', background: '#f0fdf4', borderColor: '#bbf7d0' }}>
                  <div>
                    <strong>{at.taskId?.title}</strong>
                    {at.completedAt && <span style={{ color: 'var(--text-muted)', marginLeft: 10, fontSize: 13 }}>{new Date(at.completedAt).toLocaleDateString()}</span>}
                  </div>
                  <span className="badge badge-success" style={{ fontWeight: 600, fontSize: 13 }}>+{at.scoreEarned} pts</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: 22 }}>Your Referrals</h2>
          <Link to="/profile" className="btn btn-sm">
            <ExternalLink size={16} /> Add Referral
          </Link>
        </div>

        <div className="table-wrap" style={{ marginBottom: leaderboard?.length ? 40 : 0 }}>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {referrals?.length === 0 && (
                <tr><td colSpan={4}><div className="empty-state"><Users size={40} /><h3>No referrals yet</h3><p>Start sharing your referral code to track your first referral.</p></div></td></tr>
              )}
              {referrals?.map((ref: any) => (
                <tr key={ref._id}>
                  <td style={{ fontWeight: 500 }}>{ref.referredName}</td>
                  <td>{ref.referredEmail}</td>
                  <td>
                    <span className={`badge ${ref.status === 'approved' ? 'badge-success' : ref.status === 'rejected' ? 'badge-danger' : 'badge-warning'}`}>
                      {ref.status}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-muted)' }}>{new Date(ref.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {leaderboard && leaderboard.length > 0 && (
          <div>
            <h2 style={{ fontSize: 22, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Trophy size={20} color="#F59E0B" /> Leaderboard
            </h2>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Name</th>
                    <th>Country</th>
                    <th>Referrals</th>
                    <th>Tier</th>
                    <th>Rewards</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((amb: any, i: number) => {
                    const t = getTier(amb.totalReferrals)
                    const isYou = amb.email === user?.email
                    return (
                      <tr key={amb._id} style={{ background: isYou ? '#f0fdf4' : 'transparent', fontWeight: isYou ? 600 : 'normal' }}>
                        <td style={{ fontWeight: 700 }}>#{i + 1}</td>
                        <td>{amb.name} {isYou && <span className="badge badge-success" style={{ fontSize: 10 }}>YOU</span>}</td>
                        <td>{amb.country || '—'}</td>
                        <td>{amb.totalReferrals}</td>
                        <td>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <span>{t.icon}</span>
                            <span className="badge badge-neutral" style={{ background: t.color + '20', color: t.color, border: `1px solid ${t.color}` }}>
                              {t.label}
                            </span>
                          </span>
                        </td>
                        <td>{amb.rewards}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  )
}
