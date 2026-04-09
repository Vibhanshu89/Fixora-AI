import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import './WorkersPage.css';

const categoryLabels = {
  electrical: { label: 'Electrical', icon: '⚡' },
  plumbing: { label: 'Plumbing', icon: '🔧' },
  'ac-repair': { label: 'AC Repair', icon: '❄️' },
  carpentry: { label: 'Carpentry', icon: '🪚' },
  cleaning: { label: 'Cleaning', icon: '🧹' },
  painting: { label: 'Painting', icon: '🎨' },
  'appliance-repair': { label: 'Appliances', icon: '📱' },
  'pest-control': { label: 'Pest Control', icon: '🐛' },
  'cctv-installation': { label: 'CCTV', icon: '🛡️' },
  'ro-service': { label: 'RO Service', icon: '💧' },
  'salon-at-home': { label: 'Salon', icon: '💇' },
  gardening: { label: 'Gardening', icon: '🌿' },
};

const cities = ['All', 'Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Lucknow', 'Pune', 'Chennai', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Chandigarh', 'Noida', 'Gurgaon'];

function StarRating({ rating }) {
  return (
    <div className="worker-stars">
      {'★'.repeat(Math.floor(rating))}{'☆'.repeat(5 - Math.floor(rating))}
      <span>{rating.toFixed(1)}</span>
    </div>
  );
}

export default function WorkersPage() {
  const [params] = useSearchParams();
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(params.get('category') || '');
  const [city, setCity] = useState('All');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const q = new URLSearchParams();
    if (category) q.set('category', category);
    if (city !== 'All') q.set('city', city);
    axios.get(`/api/workers?${q.toString()}`)
      .then(({ data }) => setWorkers(data.workers || []))
      .finally(() => setLoading(false));
  }, [category, city]);

  const filtered = workers.filter(w =>
    w.name.toLowerCase().includes(search.toLowerCase()) ||
    w.skills.some(s => s.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="workers-page fade-in">
      <div className="workers-header">
        <div>
          <h1>Find Expert Technicians</h1>
          <p>Browse {workers.length} verified professionals across India</p>
        </div>
      </div>

      {/* Filters */}
      <div className="workers-filters">
        <input className="form-input workers-search" placeholder="🔍  Search by name or skill..." value={search} onChange={e => setSearch(e.target.value)} />
        <div className="filter-chips">
          <button className={`filter-chip ${category === '' ? 'active' : ''}`} onClick={() => setCategory('')}>All</button>
          {Object.entries(categoryLabels).map(([key, { label, icon }]) => (
            <button key={key} className={`filter-chip ${category === key ? 'active' : ''}`} onClick={() => setCategory(key)}>
              {icon} {label}
            </button>
          ))}
        </div>
        <div className="city-filters">
          {cities.map(c => (
            <button key={c} className={`city-chip ${city === c ? 'active' : ''}`} onClick={() => setCity(c)}>{c}</button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="workers-loading"><div className="spinner" style={{ width: 40, height: 40, borderWidth: 4 }} /></div>
      ) : filtered.length === 0 ? (
        <div className="workers-empty"><span>👷</span><p>No workers found matching your filters.</p></div>
      ) : (
        <div className="workers-grid">
          {filtered.map(w => (
            <div key={w._id} className="worker-card" onClick={() => navigate(`/workers/${w._id}`)}>
              <div className="worker-card-top">
                <div className="worker-avatar">{w.name[0]}</div>
                <div className="worker-card-info">
                  <h4 className="worker-name">{w.name}</h4>
                  <div className="worker-category-badge">
                    {categoryLabels[w.category]?.icon} {categoryLabels[w.category]?.label}
                  </div>
                  <StarRating rating={w.rating} />
                </div>
                <div className={`availability-dot ${w.isAvailable ? 'available' : ''}`} title={w.isAvailable ? 'Available' : 'Busy'} />
              </div>
              <div className="worker-skills">
                {w.skills.slice(0, 3).map(s => <span key={s} className="skill-chip">{s}</span>)}
              </div>
              <div className="worker-card-footer">
                <div className="worker-meta">
                  <span>📍 {w.city}</span>
                  <span>💼 {w.experience} yrs</span>
                  <span>✅ {w.totalJobs} jobs</span>
                </div>
                <div className="worker-price">₹{w.pricePerHour}<small>/hr</small></div>
              </div>
              <button className="btn btn-primary btn-sm worker-book-btn">View Profile →</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
