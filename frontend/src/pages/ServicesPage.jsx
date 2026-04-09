import { useNavigate } from 'react-router-dom';
import './ServicesPage.css';

const services = [
  { icon: '⚡', name: 'Electrical', category: 'electrical', desc: 'Fan repair, wiring, switches, MCB, inverter, and all electrical work.', price: 'From ₹280/hr', jobs: '1.2k+', color: '#FEF3C7', accent: '#F59E0B' },
  { icon: '🔧', name: 'Plumbing', category: 'plumbing', desc: 'Pipe leaks, tap repair, drain cleaning, bathroom fittings, water heater.', price: 'From ₹300/hr', jobs: '850+', color: '#DBEAFE', accent: '#3B82F6' },
  { icon: '❄️', name: 'AC Repair', category: 'ac-repair', desc: 'AC service, gas refill, cooling issues, installation of split & window AC units.', price: 'From ₹450/hr', jobs: '2.1k+', color: '#E0F2FE', accent: '#0EA5E9' },
  { icon: '🪚', name: 'Carpentry', category: 'carpentry', desc: 'Furniture repair, door fixing, cabinet work, wood polishing, and custom woodwork.', price: 'From ₹400/hr', jobs: '440+', color: '#FEF9C3', accent: '#CA8A04' },
  { icon: '🧹', name: 'Cleaning', category: 'cleaning', desc: 'Home deep cleaning, sofa cleaning, kitchen cleaning, bathroom sanitization.', price: 'From ₹220/hr', jobs: '3.5k+', color: '#DCFCE7', accent: '#16A34A' },
  { icon: '🛡️', name: 'CCTV & Security', category: 'cctv-installation', desc: 'IP camera installation, DVR/NVR setup, remote views, and biometric systems.', price: 'From ₹550/hr', jobs: '210+', color: '#F3E8FF', accent: '#9333EA' },
  { icon: '💧', name: 'RO & Water', category: 'ro-service', desc: 'RO water filter service, filter change, TDS check, and new installations.', price: 'From ₹300/hr', jobs: '920+', color: '#E0F2FE', accent: '#0284C7' },
  { icon: '💇', name: 'Salon at Home', category: 'salon-at-home', desc: 'Professional haircuts, facials, waxing, manicure and skin care at home.', price: 'From ₹550/hr', jobs: '1.8k+', color: '#FCE7F3', accent: '#DB2777' },
  { icon: '🌿', name: 'Gardening', category: 'gardening', desc: 'Lawn mowing, pruning, vertical gardens, pest control, and plant care.', price: 'From ₹200/hr', jobs: '340+', color: '#F0FDF4', accent: '#15803D' },
  { icon: '🎨', name: 'Painting', category: 'painting', desc: 'Wall painting, texture paint, waterproofing, exterior and interior painting.', price: 'From ₹380/hr', jobs: '150+', color: '#FFF1F2', accent: '#F43F5E' },
  { icon: '📱', name: 'Appliance Repair', category: 'appliance-repair', desc: 'Washing machine, fridge, geyser, microwave, mixer grinder repair services.', price: 'From ₹380/hr', jobs: '1.1k+', color: '#F5F3FF', accent: '#7C3AED' },
  { icon: '🐛', name: 'Pest Control', category: 'pest-control', desc: 'Cockroach, termite, rat, mosquito, and ant control with safe treatments.', price: 'From ₹600/hr', jobs: '520+', color: '#FEF2F2', accent: '#EF4444' },
];

const features = [
  { icon: '✅', title: 'Verified Professionals', desc: 'All workers are background-checked and verified before onboarding.' },
  { icon: '🤖', title: 'AI-Powered Booking', desc: 'Our Gemini AI agent finds the best available worker instantly.' },
  { icon: '💰', title: 'Transparent Pricing', desc: 'No hidden charges. Clear estimates upfront before you confirm.' },
  { icon: '⭐', title: 'Rated & Reviewed', desc: 'Choose from top-rated workers with real customer reviews.' },
];

export default function ServicesPage() {
  const navigate = useNavigate();
  return (
    <div className="services-page fade-in">
      <div className="services-hero">
        <h1>All Home Services</h1>
        <p>12+ Categories · 25+ Verified Experts · 12 Major Cities across India</p>
      </div>

      <div className="services-full-grid">
        {services.map(s => (
          <div key={s.category} className="service-full-card" onClick={() => navigate(`/workers?category=${s.category}`)}>
            <div className="sfc-top" style={{ background: s.color }}>
              <div className="sfc-icon" style={{ color: s.accent }}>{s.icon}</div>
              <div className="sfc-jobs" style={{ color: s.accent }}>{s.jobs} jobs done</div>
            </div>
            <div className="sfc-body">
              <h3>{s.name}</h3>
              <p>{s.desc}</p>
              <div className="sfc-footer">
                <span className="sfc-price" style={{ color: s.accent }}>{s.price}</span>
                <button className="btn btn-primary btn-sm" style={{ background: s.accent, boxShadow: 'none' }}>
                  Find Workers →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="services-features">
        <h2 style={{ textAlign:'center', marginBottom: 32 }}>Why Choose Fixora AI?</h2>
        <div className="features-grid">
          {features.map(f => (
            <div key={f.title} className="feature-card">
              <div className="feature-icon">{f.icon}</div>
              <h4>{f.title}</h4>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
