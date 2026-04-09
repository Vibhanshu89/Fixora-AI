import { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminPage.css';

const statusColors = { pending:'#F59E0B', confirmed:'#5B2EFF', 'in-progress':'#3B82F6', completed:'#00A882', cancelled:'#EF4444' };

export default function AdminPage() {
  const [tab, setTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [workers, setWorkers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newWorker, setNewWorker] = useState({ name:'',phone:'',category:'electrical',city:'',pricePerHour:300,experience:1,skills:'',bio:'' });
  const [wLoading, setWLoading] = useState(false);
  const [wMsg, setWMsg] = useState('');

  useEffect(() => {
    Promise.all([
      axios.get('/api/bookings/admin/stats'),
      axios.get('/api/workers'),
      axios.get('/api/bookings/admin/all'),
    ]).then(([s, w, b]) => {
      setStats(s.data); setWorkers(w.data.workers || []); setBookings(b.data.bookings || []);
    }).finally(() => setLoading(false));
  }, []);

  const handleAddWorker = async (e) => {
    e.preventDefault(); setWLoading(true); setWMsg('');
    try {
      const payload = { ...newWorker, skills: newWorker.skills.split(',').map(s => s.trim()).filter(Boolean), email: `${newWorker.name.toLowerCase().replace(/\s/g,'.')}@fixora.ai` };
      const { data } = await axios.post('/api/workers', payload);
      setWorkers(prev => [data.worker, ...prev]);
      setWMsg('✅ Worker added successfully!');
      setNewWorker({ name:'',phone:'',category:'electrical',city:'',pricePerHour:300,experience:1,skills:'',bio:'' });
    } catch (err) {
      setWMsg('❌ ' + (err.response?.data?.message || 'Failed to add worker'));
    } finally { setWLoading(false); }
  };

  const toggleAvailability = async (id, current) => {
    await axios.put(`/api/workers/${id}`, { isAvailable: !current });
    setWorkers(prev => prev.map(w => w._id === id ? { ...w, isAvailable: !current } : w));
  };

  const updateBookingStatus = async (id, status) => {
    await axios.patch(`/api/bookings/${id}/status`, { status });
    setBookings(prev => prev.map(b => b._id === id ? { ...b, status } : b));
  };

  if (loading) return <div style={{ display:'flex', justifyContent:'center', padding:80 }}><div className="spinner" style={{ width:40,height:40,borderWidth:4 }} /></div>;

  return (
    <div className="admin-page fade-in">
      <div className="admin-header">
        <div>
          <h1>🛡️ Admin Panel</h1>
          <p>Manage workers, bookings, and monitor platform activity</p>
        </div>
        <span className="badge badge-primary">Admin Access</span>
      </div>

      <div className="admin-tabs">
        {['overview','workers','bookings','add-worker'].map(t => (
          <button key={t} className={`admin-tab ${tab===t?'active':''}`} onClick={() => setTab(t)}>
            {t==='overview'?'📊 Overview':t==='workers'?'👷 Workers':t==='bookings'?'📋 Bookings':'➕ Add Worker'}
          </button>
        ))}
      </div>

      {/* Overview */}
      {tab === 'overview' && (
        <div className="admin-overview">
          <div className="admin-stats-grid">
            {[
              { label:'Total Bookings', value: stats?.totalBookings, icon:'📋', color:'var(--primary)' },
              { label:'Confirmed', value: stats?.confirmed, icon:'✅', color:'#5B2EFF' },
              { label:'Completed', value: stats?.completed, icon:'🎉', color:'var(--accent)' },
              { label:'Total Users', value: stats?.totalUsers, icon:'👥', color:'#3B82F6' },
              { label:'Workers', value: stats?.totalWorkers, icon:'👷', color:'var(--secondary)' },
              { label:'Est. Revenue', value: `₹${(stats?.totalRevenue||0).toFixed(0)}`, icon:'💰', color:'#10B981' },
            ].map(s => (
              <div key={s.label} className="admin-stat-card">
                <div className="admin-stat-icon" style={{ color: s.color, background: `${s.color}18` }}>{s.icon}</div>
                <div>
                  <p className="admin-stat-val">{s.value}</p>
                  <p className="admin-stat-label">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="admin-recent">
            <h3>Recent Bookings (Last 5)</h3>
            <table className="admin-table">
              <thead><tr><th>Ref</th><th>Service</th><th>User</th><th>Worker</th><th>Status</th><th>Price</th></tr></thead>
              <tbody>
                {bookings.slice(0,5).map(b => (
                  <tr key={b._id}>
                    <td><code>{b.bookingRef}</code></td>
                    <td>{b.service}</td>
                    <td>{b.userId?.name || '—'}</td>
                    <td>{b.workerId?.name || '—'}</td>
                    <td><span className="admin-status-dot" style={{ background: statusColors[b.status] }} />{b.status}</td>
                    <td>₹{b.estimatedPrice?.toFixed(0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Workers */}
      {tab === 'workers' && (
        <div className="admin-table-card">
          <h3>All Workers ({workers.length})</h3>
          <table className="admin-table">
            <thead><tr><th>Name</th><th>Category</th><th>City</th><th>Rating</th><th>Jobs</th><th>Price/hr</th><th>Available</th></tr></thead>
            <tbody>
              {workers.map(w => (
                <tr key={w._id}>
                  <td><strong>{w.name}</strong></td>
                  <td><span className="badge badge-primary" style={{ fontSize:'0.72rem' }}>{w.category}</span></td>
                  <td>{w.city}</td>
                  <td>⭐ {w.rating}</td>
                  <td>{w.totalJobs}</td>
                  <td>₹{w.pricePerHour}</td>
                  <td>
                    <button className={`toggle-btn ${w.isAvailable ? 'on' : 'off'}`} onClick={() => toggleAvailability(w._id, w.isAvailable)}>
                      {w.isAvailable ? '● Online' : '● Offline'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Bookings */}
      {tab === 'bookings' && (
        <div className="admin-table-card">
          <h3>All Bookings ({bookings.length})</h3>
          <table className="admin-table">
            <thead><tr><th>Ref</th><th>Service</th><th>User</th><th>Worker</th><th>City</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b._id}>
                  <td><code style={{ fontSize:'0.78rem' }}>{b.bookingRef}</code></td>
                  <td>{b.service}</td>
                  <td>{b.userId?.name || '—'}</td>
                  <td>{b.workerId?.name || '—'}</td>
                  <td>{b.city}</td>
                  <td><span className="admin-status-dot" style={{ background: statusColors[b.status] }} />{b.status}</td>
                  <td>
                    <select className="status-select" value={b.status} onChange={e => updateBookingStatus(b._id, e.target.value)}>
                      {['pending','confirmed','in-progress','completed','cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Worker */}
      {tab === 'add-worker' && (
        <div className="admin-form-card">
          <h3>Add New Worker</h3>
          {wMsg && <div className={`profile-msg ${wMsg.startsWith('✅')?'success':'error'}`} style={{ marginBottom:16 }}>{wMsg}</div>}
          <form onSubmit={handleAddWorker} className="admin-form">
            <div className="admin-form-grid">
              <div className="form-group"><label className="form-label">Full Name *</label><input className="form-input" value={newWorker.name} onChange={e => setNewWorker(p=>({...p,name:e.target.value}))} required /></div>
              <div className="form-group"><label className="form-label">Phone *</label><input className="form-input" value={newWorker.phone} onChange={e => setNewWorker(p=>({...p,phone:e.target.value}))} required /></div>
              <div className="form-group"><label className="form-label">Category *</label>
                <select className="form-input" value={newWorker.category} onChange={e => setNewWorker(p=>({...p,category:e.target.value}))}>
                  {['electrical','plumbing','ac-repair','carpentry','cleaning','painting','appliance-repair','pest-control'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group"><label className="form-label">City *</label><input className="form-input" value={newWorker.city} onChange={e => setNewWorker(p=>({...p,city:e.target.value}))} required /></div>
              <div className="form-group"><label className="form-label">Price/Hour (₹)</label><input className="form-input" type="number" min={100} value={newWorker.pricePerHour} onChange={e => setNewWorker(p=>({...p,pricePerHour:+e.target.value}))} /></div>
              <div className="form-group"><label className="form-label">Experience (Years)</label><input className="form-input" type="number" min={0} value={newWorker.experience} onChange={e => setNewWorker(p=>({...p,experience:+e.target.value}))} /></div>
            </div>
            <div className="form-group"><label className="form-label">Skills (comma separated)</label><input className="form-input" placeholder="Fan Repair, Wiring, Switch Board" value={newWorker.skills} onChange={e => setNewWorker(p=>({...p,skills:e.target.value}))} /></div>
            <div className="form-group"><label className="form-label">Bio</label><textarea className="form-input" rows={2} value={newWorker.bio} onChange={e => setNewWorker(p=>({...p,bio:e.target.value}))} /></div>
            <button type="submit" className="btn btn-primary" disabled={wLoading}>
              {wLoading ? <span className="spinner" style={{ width:18,height:18,borderWidth:2 }} /> : '➕ Add Worker'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
