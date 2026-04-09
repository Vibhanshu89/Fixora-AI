import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './DashboardPage.css';

const quickActions = [
  { icon: '⚡', label: 'Electrical', category: 'electrical' },
  { icon: '🔧', label: 'Plumbing', category: 'plumbing' },
  { icon: '❄️', label: 'AC Repair', category: 'ac-repair' },
  { icon: '💇', label: 'Salon', category: 'salon-at-home' },
  { icon: '🛡️', label: 'CCTV', category: 'cctv-installation' },
  { icon: '💧', label: 'RO Service', category: 'ro-service' },
  { icon: '🌿', label: 'Gardening', category: 'gardening' },
  { icon: '🧹', label: 'Cleaning', category: 'cleaning' },
];

const statusColors = {
  confirmed: 'badge-primary',
  pending: 'badge-warning',
  'in-progress': 'badge-warning',
  completed: 'badge-success',
  cancelled: 'badge-danger',
};

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  useEffect(() => {
    axios.get('/api/bookings/my').then(({ data }) => {
      setBookings(data.bookings?.slice(0, 4) || []);
    }).finally(() => setLoading(false));
  }, []);

  const stats = [
    { label: 'Total Bookings', value: bookings.length, icon: '📋', color: 'var(--primary)' },
    { label: 'Completed', value: bookings.filter(b => b.status === 'completed').length, icon: '✅', color: 'var(--accent)' },
    { label: 'Upcoming', value: bookings.filter(b => b.status === 'confirmed').length, icon: '📅', color: 'var(--secondary)' },
    { label: 'AI Sessions', value: '—', icon: '🤖', color: '#8B5CF6' },
  ];

  return (
    <div className="dashboard fade-in">
      {/* Header */}
      <div className="dash-header">
        <div>
          <p className="dash-greeting">{greeting} 👋</p>
          <h1 className="dash-title">Welcome back, <span>{user?.name?.split(' ')[0]}</span>!</h1>
          <p className="dash-sub">What needs fixing today? Let the AI handle it.</p>
        </div>
        <Link to="/chat" className="btn btn-primary btn-lg">
          🤖 Ask AI Assistant
        </Link>
      </div>

      {/* Stats */}
      <div className="dash-stats">
        {stats.map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-icon" style={{ background: `${s.color}20`, color: s.color }}>{s.icon}</div>
            <div>
              <p className="stat-value">{s.value}</p>
              <p className="stat-label">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* AI CTA Banner */}
      <div className="dash-ai-banner">
        <div className="dash-ai-banner-left">
          <div className="dash-ai-icon">🤖</div>
          <div>
            <h3>AI Assistant is Ready</h3>
            <p>Just describe your problem in plain English. The AI will find the best technician and book it automatically.</p>
          </div>
        </div>
        <Link to="/chat" className="btn btn-primary">Start AI Chat →</Link>
      </div>

      {/* Quick Actions */}
      <div className="dash-section">
        <h3 className="dash-section-title">Quick Book by Category</h3>
        <div className="quick-actions">
          {quickActions.map(a => (
            <button key={a.category} className="quick-action-btn"
              onClick={() => navigate(`/workers?category=${a.category}`)}>
              <span className="qa-icon">{a.icon}</span>
              <span className="qa-label">{a.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="dash-section">
        <div className="dash-section-header">
          <h3 className="dash-section-title">Recent Bookings</h3>
          <Link to="/bookings" className="dash-see-all">See All →</Link>
        </div>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><div className="spinner" /></div>
        ) : bookings.length === 0 ? (
          <div className="dash-empty">
            <span>📋</span>
            <p>No bookings yet. <Link to="/chat">Try AI Assistant</Link> to book your first service!</p>
          </div>
        ) : (
          <div className="bookings-list">
            {bookings.map(b => (
              <div key={b._id} className="booking-item">
                <div className="booking-item-icon">🔧</div>
                <div className="booking-item-info">
                  <p className="booking-item-service">{b.service}</p>
                  <p className="booking-item-worker">👷 {b.workerId?.name} · {b.city}</p>
                  <p className="booking-item-date">📅 {new Date(b.scheduledAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                <div className="booking-item-right">
                  <span className={`badge ${statusColors[b.status]}`}>{b.status}</span>
                  <p className="booking-item-price">₹{b.estimatedPrice?.toFixed(0)}</p>
                  <p className="booking-item-ref"># {b.bookingRef}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
