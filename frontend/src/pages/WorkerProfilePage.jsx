import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './WorkerProfilePage.css';

const categoryLabels = { electrical:'Electrical',plumbing:'Plumbing','ac-repair':'AC Repair',carpentry:'Carpentry',cleaning:'Cleaning',painting:'Painting','appliance-repair':'Appliances','pest-control':'Pest Control' };

export default function WorkerProfilePage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState({ address: user?.address || '', city: user?.city || '', date: '', time: '10:00', notes: '' });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    axios.get(`/api/workers/${id}`).then(({ data }) => setWorker(data.worker)).finally(() => setLoading(false));
  }, [id]);

  const handleBook = async (e) => {
    e.preventDefault();
    if (!booking.address || !booking.city || !booking.date) return;
    setBookingLoading(true);
    try {
      const scheduledAt = new Date(`${booking.date}T${booking.time}`).toISOString();
      const { data } = await axios.post('/api/chat', {
        message: `Book ${worker.category} service with worker ${worker.name} (ID: ${worker._id}) at ${booking.address}, ${booking.city} on ${booking.date} at ${booking.time}. Notes: ${booking.notes || 'None'}`,
        sessionId: `direct_${Date.now()}`,
        city: booking.city,
        pendingContext: { workerId: worker._id, scheduledAt, address: booking.address, city: booking.city, service: categoryLabels[worker.category], category: worker.category },
      });
      setBookingSuccess(data.message);
      setShowModal(false);
    } catch (err) {
      alert('Booking failed. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <div style={{ display:'flex', justifyContent:'center', padding:80 }}><div className="spinner" style={{ width:40,height:40,borderWidth:4 }} /></div>;
  if (!worker) return <div className="worker-not-found"><h2>Worker not found</h2><button className="btn btn-primary" onClick={() => navigate('/workers')}>Back to Workers</button></div>;

  const stars = Math.round(worker.rating);
  return (
    <div className="worker-profile fade-in">
      {bookingSuccess && (
        <div className="booking-success-banner">
          <span>✅</span> {bookingSuccess}
          <button onClick={() => navigate('/bookings')} className="btn btn-primary btn-sm" style={{ marginLeft: 16 }}>View Booking</button>
        </div>
      )}

      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>

      <div className="wp-hero">
        <div className="wp-avatar">{worker.name[0]}</div>
        <div className="wp-info">
          <div className="wp-badges">
            {worker.isVerified && <span className="badge badge-success">✅ Verified</span>}
            {worker.isAvailable ? <span className="badge badge-success">● Available</span> : <span className="badge badge-secondary">● Busy</span>}
            <span className="badge badge-primary">{categoryLabels[worker.category]}</span>
          </div>
          <h1 className="wp-name">{worker.name}</h1>
          <div className="wp-stars">{'★'.repeat(stars)}{'☆'.repeat(5-stars)} <span>{worker.rating.toFixed(1)} ({worker.totalJobs} jobs)</span></div>
          <p className="wp-bio">{worker.bio}</p>
          <div className="wp-quick-stats">
            <div className="wp-stat"><strong>{worker.experience}</strong><span>Years Exp.</span></div>
            <div className="wp-stat"><strong>{worker.totalJobs}+</strong><span>Jobs Done</span></div>
            <div className="wp-stat"><strong>₹{worker.pricePerHour}</strong><span>Per Hour</span></div>
            <div className="wp-stat"><strong>{worker.city}</strong><span>City</span></div>
          </div>
        </div>
        <div className="wp-book-box">
          <p className="wp-price">₹{worker.pricePerHour}<small>/hr</small></p>
          <p className="wp-est">Est. ₹{(worker.pricePerHour * 1.5).toFixed(0)} for typical service</p>
          <button className="btn btn-primary" style={{ width:'100%' }} onClick={() => setShowModal(true)} disabled={!worker.isAvailable}>
            {worker.isAvailable ? '📅 Book This Worker' : '⏳ Currently Busy'}
          </button>
          <button className="btn btn-secondary btn-sm" style={{ width:'100%',marginTop:8 }} onClick={() => navigate('/chat')}>
            🤖 Book via AI Assistant
          </button>
          <div className="wp-contact"><a href={`tel:${worker.phone}`}>📞 {worker.phone}</a></div>
        </div>
      </div>

      <div className="wp-body">
        <div className="wp-skills-section">
          <h3>Skills & Expertise</h3>
          <div className="wp-skills">
            {worker.skills.map(s => <span key={s} className="skill-chip-lg">{s}</span>)}
          </div>
        </div>

        {/* Reviews */}
        <div className="wp-reviews-section">
          <h3>Customer Reviews</h3>
          {worker.reviews?.length === 0 ? (
            <div className="wp-no-reviews">No reviews yet. Be the first to review!</div>
          ) : (
            <div className="wp-reviews">
              {(worker.reviews || []).map((r, i) => (
                <div key={i} className="wp-review-card">
                  <div className="review-header">
                    <div className="avatar avatar-sm">{r.userName?.[0]}</div>
                    <div><p className="review-name">{r.userName}</p><div className="stars" style={{ fontSize:'0.8rem' }}>{'★'.repeat(r.rating)}</div></div>
                  </div>
                  <p className="review-text">{r.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Book {worker.name}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleBook} className="modal-form">
              <div className="form-group">
                <label className="form-label">Service Address</label>
                <input className="form-input" placeholder="Full address" value={booking.address} onChange={e => setBooking(b => ({...b, address: e.target.value}))} required />
              </div>
              <div className="form-group">
                <label className="form-label">City</label>
                <input className="form-input" placeholder="City" value={booking.city} onChange={e => setBooking(b => ({...b, city: e.target.value}))} required />
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div className="form-group">
                  <label className="form-label">Date</label>
                  <input className="form-input" type="date" value={booking.date} min={new Date().toISOString().split('T')[0]} onChange={e => setBooking(b => ({...b, date: e.target.value}))} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Time</label>
                  <input className="form-input" type="time" value={booking.time} onChange={e => setBooking(b => ({...b, time: e.target.value}))} required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Additional Notes (optional)</label>
                <textarea className="form-input" rows={2} placeholder="Describe your problem briefly..." value={booking.notes} onChange={e => setBooking(b => ({...b, notes: e.target.value}))} />
              </div>
              <div className="modal-price-box">
                <div><p>Estimated Cost</p><p className="modal-price-val">₹{(worker.pricePerHour * 1.5).toFixed(0)}</p></div>
                <div><p>Worker</p><p style={{ fontWeight:600 }}>{worker.name}</p></div>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width:'100%' }} disabled={bookingLoading}>
                {bookingLoading ? <><span className="spinner" style={{ width:18,height:18,borderWidth:2 }} /> Booking...</> : '✅ Confirm Booking'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
