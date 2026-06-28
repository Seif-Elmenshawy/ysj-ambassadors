import { useState, useEffect, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Users, CheckCircle, XCircle, Trash2, Plus, Edit3, LogOut, LayoutDashboard, ExternalLink, Target, Trophy, Award, Clock, Shield, AlertTriangle } from 'lucide-react'
import adminApi from '../api/adminClient'
import PageTransition from '../components/Common/PageTransition'

function getTier(refs: number) {
  if (refs >= 30) return { label: 'Platinum', color: '#E5E4E2', icon: '💎' }
  if (refs >= 15) return { label: 'Gold', color: '#FFD700', icon: '🥇' }
  if (refs >= 5) return { label: 'Silver', color: '#C0C0C0', icon: '🥈' }
  return { label: 'Bronze', color: '#CD7F32', icon: '🥉' }
}

type PageTab = 'dashboard' | 'referrals' | 'ambassadors' | 'tasks' | 'leaderboard'

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const [tab, setTab] = useState<PageTab>('dashboard')
  const [rateLimitCountdown, setRateLimitCountdown] = useState(0)
  const queryClient = useQueryClient()

  const [showTaskForm, setShowTaskForm] = useState(false)
  const [editTaskId, setEditTaskId] = useState<string | null>(null)
  const [taskTitle, setTaskTitle] = useState('')
  const [taskDesc, setTaskDesc] = useState('')
  const [taskTarget, setTaskTarget] = useState('')
  const [taskDays, setTaskDays] = useState('')
  const [taskScore, setTaskScore] = useState('')

  useEffect(() => {
    adminApi.get('/me')
      .then(() => { setAuthenticated(true); localStorage.setItem('adminLoggedIn', 'true') })
      .catch(() => { setAuthenticated(false); localStorage.removeItem('adminLoggedIn') })
  }, [])

  useEffect(() => {
    if (rateLimitCountdown > 0) {
      const t = setTimeout(() => setRateLimitCountdown(rateLimitCountdown - 1), 1000)
      return () => clearTimeout(t)
    }
  }, [rateLimitCountdown])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    setLoginLoading(true)
    try {
      await adminApi.post('/login', { email, password })
      setAuthenticated(true)
      localStorage.setItem('adminLoggedIn', 'true')
    } catch (err: any) {
      if (err.response?.status === 429) {
        const retry = err.response.data.retryAfter || 60
        setRateLimitCountdown(retry)
        setLoginError(`Too many attempts. Try again in ${retry} seconds.`)
      } else {
        setLoginError('Invalid admin credentials')
      }
    } finally {
      setLoginLoading(false)
    }
  }

  const logout = async () => {
    try { await adminApi.post('/logout') } catch {}
    setAuthenticated(false)
    localStorage.removeItem('adminLoggedIn')
    queryClient.clear()
  }

  const { data: adminDashboard } = useQuery({
    queryKey: ['adminDashboard', authenticated],
    queryFn: () => adminApi.get('/dashboard').then((r) => r.data),
    enabled: authenticated === true,
  })

  const { data: allReferrals, refetch: refetchReferrals } = useQuery({
    queryKey: ['adminReferrals', authenticated],
    queryFn: () => adminApi.get('/referrals').then((r) => r.data),
    enabled: authenticated === true,
  })

  const { data: allAmbassadors } = useQuery({
    queryKey: ['adminAmbassadors', authenticated],
    queryFn: () => adminApi.get('/ambassadors').then((r) => r.data),
    enabled: authenticated === true,
  })

  const { data: allTasks } = useQuery({
    queryKey: ['adminTasks', authenticated],
    queryFn: () => adminApi.get('/tasks').then((r) => r.data),
    enabled: authenticated === true,
  })

  const { data: leaderboard } = useQuery({
    queryKey: ['adminLeaderboard', authenticated],
    queryFn: () => adminApi.get('/leaderboard').then((r) => r.data),
    enabled: authenticated === true,
  })

  const approveMutation = useMutation({
    mutationFn: (id: string) => adminApi.patch(`/referrals/${id}/approve`),
    onSuccess: () => { refetchReferrals(); queryClient.invalidateQueries({ queryKey: ['adminDashboard'] }) },
  })

  const rejectMutation = useMutation({
    mutationFn: (id: string) => adminApi.patch(`/referrals/${id}/reject`),
    onSuccess: () => { refetchReferrals(); queryClient.invalidateQueries({ queryKey: ['adminDashboard'] }) },
  })

  const deleteAmbMutation = useMutation({
    mutationFn: (id: string) => adminApi.delete(`/ambassadors/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['adminAmbassadors'] }),
  })

  const createTaskMutation = useMutation({
    mutationFn: (data: any) => {
      if (editTaskId) return adminApi.patch(`/tasks/${editTaskId}`, data)
      return adminApi.post('/tasks', data)
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['adminTasks'] }); resetTaskForm() },
  })

  const deleteTaskMutation = useMutation({
    mutationFn: (id: string) => adminApi.delete(`/tasks/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['adminTasks'] }),
  })

  const resetTaskForm = () => {
    setShowTaskForm(false); setEditTaskId(null); setTaskTitle(''); setTaskDesc(''); setTaskTarget(''); setTaskDays(''); setTaskScore('')
  }

  const openEditTask = (t: any) => {
    setShowTaskForm(true); setEditTaskId(t._id)
    setTaskTitle(t.title); setTaskDesc(t.description || ''); setTaskTarget(String(t.targetReferrals)); setTaskDays(String(t.daysToComplete)); setTaskScore(String(t.score))
  }

  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createTaskMutation.mutate({ title: taskTitle, description: taskDesc, targetReferrals: Number(taskTarget), daysToComplete: Number(taskDays), score: Number(taskScore) })
  }

  if (authenticated === null) {
    return (
      <PageTransition>
        <div className="loading" style={{ position: 'relative', height: '100vh' }}>
          <div className="loader"><span>YSJ</span></div>
        </div>
      </PageTransition>
    )
  }

  if (!authenticated) {
    return (
      <PageTransition>
        <div className="auth-page">
          <div className="auth-container" style={{ maxWidth: 420 }}>
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <div style={{ width: 56, height: 56, borderRadius: 12, background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                <Shield size={28} color="white" />
              </div>
              <h1 style={{ fontSize: 22 }}>Admin Panel</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 4 }}>Sign in to manage the YSJ Ambassador Program</p>
            </div>
            <form className="form-wrap" onSubmit={handleLogin}>
              <div>
                <label>Email</label>
                <input type="email" className="form-input" placeholder="admin@ysj.org" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus />
              </div>
              <div>
                <label>Password</label>
                <input type="password" className="form-input" placeholder="••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              {loginError && (
                <p style={{ color: 'var(--red)', fontSize: 13, marginTop: -4, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <AlertTriangle size={14} /> {loginError}
                </p>
              )}
              <button type="submit" className="btn btn-lg" style={{ width: '100%', marginTop: 8 }} disabled={loginLoading || rateLimitCountdown > 0}>
                {loginLoading ? 'Verifying...' : rateLimitCountdown > 0 ? `Wait ${rateLimitCountdown}s` : 'Sign In'}
              </button>
            </form>
          </div>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div style={{ padding: '120px 5% 60px', maxWidth: 1200, margin: 'auto' }}>
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1>Admin Panel</h1>
            <p style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Shield size={14} color="#059669" /> Secured session — Manage ambassadors, referrals, tasks, and leaderboard.</p>
          </div>
          <button onClick={logout} className="btn btn-outline btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <LogOut size={16} /> Logout
          </button>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
          {[
            { key: 'dashboard' as PageTab, label: 'Dashboard', icon: LayoutDashboard },
            { key: 'referrals' as PageTab, label: 'Referrals', icon: ExternalLink },
            { key: 'ambassadors' as PageTab, label: 'Ambassadors', icon: Users },
            { key: 'tasks' as PageTab, label: 'Tasks', icon: Target },
            { key: 'leaderboard' as PageTab, label: 'Leaderboard', icon: Trophy },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`btn btn-sm ${tab === t.key ? '' : 'btn-outline'}`}
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <t.icon size={16} /> {t.label}
            </button>
          ))}
        </div>

        {tab === 'dashboard' && (
          <div>
            <h2 style={{ fontSize: 22, marginBottom: 24 }}>Overview</h2>
            <div className="grid-3">
              <div className="stat-card">
                <Users size={28} color="#1F2937" style={{ marginBottom: 10 }} />
                <p className="stat-value">{adminDashboard?.totalAmbassadors ?? 0}</p>
                <p className="stat-label">Total Ambassadors</p>
              </div>
              <div className="stat-card">
                <ExternalLink size={28} color="#059669" style={{ marginBottom: 10 }} />
                <p className="stat-value" style={{ color: '#059669' }}>{adminDashboard?.totalReferrals ?? 0}</p>
                <p className="stat-label">Total Referrals</p>
              </div>
              <div className="stat-card">
                <Clock size={28} color="#F59E0B" style={{ marginBottom: 10 }} />
                <p className="stat-value" style={{ color: '#F59E0B' }}>{adminDashboard?.pendingReferrals ?? 0}</p>
                <p className="stat-label">Pending Referrals</p>
              </div>
            </div>
            {adminDashboard?.topAmbassadors?.length > 0 && (
              <div style={{ marginTop: 32 }}>
                <h2 style={{ fontSize: 18, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Award size={18} color="#F59E0B" /> Top Ambassadors
                </h2>
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Rank</th>
                        <th>Name</th>
                        <th>Country</th>
                        <th>Organization</th>
                        <th>Referrals</th>
                        <th>Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {adminDashboard.topAmbassadors.map((amb: any, i: number) => (
                        <tr key={amb._id}>
                          <td style={{ fontWeight: 700 }}>#{i + 1}</td>
                          <td style={{ fontWeight: 500 }}>{amb.name}</td>
                          <td>{amb.country || '—'}</td>
                          <td style={{ fontSize: 13 }}>{amb.organization || '—'}</td>
                          <td>{amb.totalReferrals}</td>
                          <td>{amb.score ?? 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {tab === 'referrals' && (
          <div>
            <h2 style={{ fontSize: 22, marginBottom: 24 }}>All Referrals</h2>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Ambassador</th>
                    <th>Referred</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allReferrals?.length === 0 && (
                    <tr><td colSpan={6}><div className="empty-state"><ExternalLink size={40} /><h3>No referrals</h3></div></td></tr>
                  )}
                  {allReferrals?.map((ref: any) => (
                    <tr key={ref._id}>
                      <td style={{ fontWeight: 500 }}>{ref.ambassadorId?.name || 'Unknown'}</td>
                      <td>{ref.referredName}</td>
                      <td>{ref.referredEmail}</td>
                      <td>
                        <span className={`badge ${ref.status === 'approved' ? 'badge-success' : ref.status === 'rejected' ? 'badge-danger' : 'badge-warning'}`}>
                          {ref.status}
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-muted)' }}>{new Date(ref.createdAt).toLocaleDateString()}</td>
                      <td>
                        {ref.status === 'pending' && (
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button onClick={() => approveMutation.mutate(ref._id)} className="btn btn-sm btn-outline" style={{ color: '#059669', borderColor: '#059669' }}>
                              <CheckCircle size={14} /> Approve
                            </button>
                            <button onClick={() => rejectMutation.mutate(ref._id)} className="btn btn-sm btn-outline" style={{ color: '#d13c3c', borderColor: '#d13c3c' }}>
                              <XCircle size={14} /> Reject
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'ambassadors' && (
          <div>
            <h2 style={{ fontSize: 22, marginBottom: 24 }}>All Ambassadors</h2>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Country</th>
                    <th>Organization</th>
                    <th>Referrals</th>
                    <th>Score</th>
                    <th>Tier</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allAmbassadors?.map((amb: any) => {
                    const t = getTier(amb.totalReferrals)
                    return (
                      <tr key={amb._id}>
                        <td style={{ fontWeight: 500 }}>{amb.name}</td>
                        <td>{amb.email}</td>
                        <td>{amb.country || '—'}</td>
                        <td style={{ fontSize: 13 }}>{amb.organization || '—'}</td>
                        <td>{amb.totalReferrals}</td>
                        <td>{amb.score ?? 0}</td>
                        <td>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <span>{t.icon}</span>
                            <span className="badge badge-neutral" style={{ background: t.color + '20', color: t.color }}>{t.label}</span>
                          </span>
                        </td>
                        <td>
                          <button onClick={() => { if (window.confirm('Delete this ambassador and all their data?')) deleteAmbMutation.mutate(amb._id) }} className="btn btn-sm btn-outline" style={{ color: '#d13c3c', borderColor: '#d13c3c' }}>
                            <Trash2 size={14} /> Delete
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'tasks' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: 22 }}>Tasks</h2>
              <button onClick={() => { resetTaskForm(); setShowTaskForm(!showTaskForm) }} className="btn btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Plus size={16} /> {showTaskForm ? 'Cancel' : 'New Task'}
              </button>
            </div>

            {showTaskForm && (
              <form className="form-wrap" onSubmit={handleTaskSubmit} style={{ marginBottom: 32, padding: 24, border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
                <h3 style={{ marginBottom: 16, fontSize: 16 }}>{editTaskId ? 'Edit Task' : 'Create New Task'}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label>Title</label>
                    <input className="form-input" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} required />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label>Description</label>
                    <textarea className="form-input" style={{ minHeight: 60, resize: 'vertical' }} value={taskDesc} onChange={(e) => setTaskDesc(e.target.value)} />
                  </div>
                  <div>
                    <label>Target Referrals</label>
                    <input type="number" className="form-input" value={taskTarget} onChange={(e) => setTaskTarget(e.target.value)} required min={1} />
                  </div>
                  <div>
                    <label>Days to Complete</label>
                    <input type="number" className="form-input" value={taskDays} onChange={(e) => setTaskDays(e.target.value)} required min={1} />
                  </div>
                  <div>
                    <label>Score</label>
                    <input type="number" className="form-input" value={taskScore} onChange={(e) => setTaskScore(e.target.value)} required min={1} />
                  </div>
                </div>
                <button type="submit" className="btn" style={{ marginTop: 16 }}>{editTaskId ? 'Update Task' : 'Create Task'}</button>
              </form>
            )}

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Target</th>
                    <th>Days</th>
                    <th>Score</th>
                    <th>Active</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allTasks?.length === 0 && (
                    <tr><td colSpan={6}><div className="empty-state"><Target size={40} /><h3>No tasks yet</h3></div></td></tr>
                  )}
                  {allTasks?.map((t: any) => (
                    <tr key={t._id}>
                      <td style={{ fontWeight: 500 }}>{t.title}</td>
                      <td>{t.targetReferrals}</td>
                      <td>{t.daysToComplete}</td>
                      <td style={{ color: '#8B5CF6', fontWeight: 600 }}>+{t.score}</td>
                      <td>
                        <span className={`badge ${t.isActive ? 'badge-success' : 'badge-danger'}`}>{t.isActive ? 'Active' : 'Inactive'}</span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button onClick={() => openEditTask(t)} className="btn btn-sm btn-outline">
                            <Edit3 size={14} /> Edit
                          </button>
                          <button onClick={() => { if (window.confirm('Delete this task?')) deleteTaskMutation.mutate(t._id) }} className="btn btn-sm btn-outline" style={{ color: '#d13c3c', borderColor: '#d13c3c' }}>
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'leaderboard' && (
          <div>
            <h2 style={{ fontSize: 22, marginBottom: 24 }}>Full Leaderboard</h2>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Name</th>
                    <th>Country</th>
                    <th>Organization</th>
                    <th>Referrals</th>
                    <th>Score</th>
                    <th>Tier</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard?.length === 0 && (
                    <tr><td colSpan={7}><div className="empty-state"><Trophy size={40} /><h3>No ambassadors yet</h3></div></td></tr>
                  )}
                  {leaderboard?.map((amb: any, i: number) => {
                    const t = getTier(amb.totalReferrals)
                    return (
                      <tr key={amb._id}>
                        <td style={{ fontWeight: 700 }}>#{i + 1}</td>
                        <td style={{ fontWeight: 500 }}>{amb.name}</td>
                        <td>{amb.country || '—'}</td>
                        <td style={{ fontSize: 13 }}>{amb.organization || '—'}</td>
                        <td>{amb.totalReferrals}</td>
                        <td style={{ fontWeight: 600 }}>{amb.score ?? 0}</td>
                        <td>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <span>{t.icon}</span>
                            <span className="badge badge-neutral" style={{ background: t.color + '20', color: t.color }}>{t.label}</span>
                          </span>
                        </td>
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
