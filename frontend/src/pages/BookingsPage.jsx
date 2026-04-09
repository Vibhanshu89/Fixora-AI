import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './BookingsPage.css';

const statusConfig = {
  pending:     { label: 'Pending',     color: '#F59E0B', bg: '#FEF3C7', icon: '⏳' },
  confirmed:   { label: 'Confirmed',   color: '#5B2EFF', bg: '#EDE9FF', icon: '✅' },
  'in-progress': { label: 'In Progress', color: '#3B82F6', bg: '#EFF6FF', icon: '🔧' },
  completed:   { label: 'Completed',   color: '#00A882', bg: '#D1FAF0', icon: '🎉' },
  cancelled:   { label: 'Cancelled',   color: '#EF4444', bg: '#FEE2E2', icon: '❌' },
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    axios.get('/api/bookings/my').then(({ data }) => setBookings(data.bookings || [])).finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

  return (
    <div className="bookings-page fade-in">
      <div className="bookings-header">
        <div>
          <h1>My Bookings</h1>
          <p>Track all your service bookings in one place</p>
        </div>
        <Link to="/chat" className="btn btn-primary">+ New Booking via AI</Link>
      </div>

      <div className="bookings-filter-tabs">
        {['all','confirmed','in-progress','completed','cancelled'].map(f => (
          <button key={f} className={`filter-tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
            {f === 'all' ? `All (${bookings.length})` : `${statusConfig[f]?.icon} ${statusConfig[f]?.label}`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="bookings-loading"><div className="spinner" style={{ width:40,height:40,borderWidth:4 }} /></div>
      ) : filtered.length === 0 ? (
        <div className="bookings-empty">
          <span>📋</span>
          <h3>No bookings found</h3>
          <p>Use the AI Assistant to book your first service!</p>
          <Link to="/chat" className="btn btn-primary" style={{ marginTop:16 }}>🤖 Try AI Assistant</Link>
        </div>
      ) : (
        <div className="bookings-timeline">
          {filtered.map(b => {
            const s = statusConfig[b.status] || statusConfig.pending;
            return (
              <div key={b._id} className="booking-card">
                <div className="booking-card-status-bar" style={{ background: s.bg }}>
                  <span className="booking-status-icon">{s.icon}</span>
                  <span className="booking-status-text" style={{ color: s.color }}>{s.label}</span>
                  <span className="booking-ref"># {b.bookingRef}</span>
                </div>
                <div className="booking-card-body">
                  <div className="booking-service-info">
                    <h4 className="booking-service-name">{b.service}</h4>
                    <p className="booking-category">{b.category}</p>
                  </div>
                  <div className="booking-details-grid">
                    <div className="booking-detail">
                      <span className="bd-label">Technician</span>
                      <span className="bd-value">👷 {b.workerId?.name || 'N/A'}</span>
                    </div>
                    <div className="booking-detail">
                      <span className="bd-label">Phone</span>
                      <span className="bd-value">📞 {b.workerId?.phone || 'N/A'}</span>
                    </div>
                    <div className="booking-detail">
                      <span className="bd-label">Scheduled</span>
                      <span className="bd-value">📅 {new Date(b.scheduledAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})} at {new Date(b.scheduledAt).toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})}</span>
                    </div>
                    <div className="booking-detail">
                      <span className="bd-label">Address</span>
                      <span className="bd-value">📍 {b.address}, {b.city}</span>
                    </div>
                    <div className="booking-detail">
                      <span className="bd-label">Booked On</span>
                      <span className="bd-value">{new Date(b.createdAt).toLocaleDateString('en-IN')}</span>
                    </div>
                    <div className="booking-detail">
                      <span className="bd-label">Est. Price</span>
                      <span className="bd-value booking-price">₹{b.estimatedPrice?.toFixed(0)}</span>
                    </div>
                  </div>
                  {b.aiGenerated && (
                    <div className="booking-ai-badge"><span>🤖</span> Booked via AI Assistant</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
