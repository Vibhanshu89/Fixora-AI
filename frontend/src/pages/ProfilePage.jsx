import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './ProfilePage.css';

export default function ProfilePage() {
  const { user, fetchMe } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', city: user?.city || '', phone: user?.phone || '', address: user?.address || '' });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [saving, setSaving] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [pwMsg, setPwMsg] = useState('');

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true); setMsg('');
    try {
      await axios.put('/api/auth/profile', form);
      await fetchMe();
      setMsg('✅ Profile updated successfully!');
    } catch (err) {
      setMsg('❌ ' + (err.response?.data?.message || 'Update failed'));
    } finally { setSaving(false); }
  };

  return (
    <div className="profile-page fade-in">
      <h1 className="profile-title">My Profile</h1>

      <div className="profile-grid">
        {/* Avatar Card */}
        <div className="profile-avatar-card">
          <div className="avatar avatar-xl" style={{ margin: '0 auto 16px' }}>
            {user?.avatar
              ? <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
              : user?.name?.[0]?.toUpperCase()}
          </div>
          <h3 style={{ textAlign: 'center' }}>{user?.name}</h3>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{user?.email}</p>
          <div className="profile-meta">
            <div className="profile-meta-item">
              <span className="pm-icon">📍</span>
              <span>{user?.city || 'City not set'}</span>
            </div>
            <div className="profile-meta-item">
              <span className="pm-icon">👤</span>
              <span style={{ textTransform: 'capitalize' }}>{user?.role}</span>
            </div>
            {user?.googleId && (
              <div className="profile-meta-item">
                <span className="pm-icon">🔗</span>
                <span>Google Account</span>
              </div>
            )}
          </div>
        </div>

        {/* Edit Form */}
        <div className="profile-form-card">
          <h3 className="profile-card-title">Personal Information</h3>
          {msg && <div className={`profile-msg ${msg.startsWith('✅') ? 'success' : 'error'}`}>{msg}</div>}
          <form onSubmit={handleUpdate} className="profile-form">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input className="form-input" type="tel" placeholder="+91 XXXXXXXXXX" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">City</label>
              <input className="form-input" placeholder="Delhi, Mumbai..." value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Default Service Address</label>
              <textarea className="form-input" rows={2} placeholder="House no, Street, Area..." value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
            </div>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Stats Card */}
        <div className="profile-stats-card">
          <h3 className="profile-card-title">Account Stats</h3>
          <div className="profile-stats">
            {[
              { icon: '📋', label: 'Total Bookings', value: user?.totalBookings || 0 },
              { icon: '🤖', label: 'AI Sessions', value: '—' },
              { icon: '⭐', label: 'Avg Rating Given', value: '—' },
            ].map(s => (
              <div key={s.label} className="profile-stat">
                <span className="ps-icon">{s.icon}</span>
                <div>
                  <p className="ps-value">{s.value}</p>
                  <p className="ps-label">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="profile-account-info">
            <h4>Account Details</h4>
            <div className="pai-row"><span>Email</span><span>{user?.email}</span></div>
            <div className="pai-row"><span>Role</span><span style={{ textTransform: 'capitalize' }}>{user?.role}</span></div>
            <div className="pai-row"><span>Auth</span><span>{user?.googleId ? '🔗 Google OAuth' : '🔑 Email/Password'}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
