import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LandingPage.css';

const services = [
  { icon: '⚡', name: 'Electrical', desc: 'Fan, wiring, switches & audits' },
  { icon: '🔧', name: 'Plumbing', desc: 'Pipe leaks, taps, RO water filter' },
  { icon: '❄️', name: 'AC Repair', desc: 'AC service, gas refill, installation' },
  { icon: '🪚', name: 'Carpentry', desc: 'Furniture, doors, modular kitchen' },
  { icon: '🧹', name: 'Cleaning', desc: 'Deep clean, sofa, carpet sanitization' },
  { icon: '💇', name: 'Salon at Home', desc: 'Haircut, facial, waxing at home' },
  { icon: '🛡️', name: 'Security', desc: 'CCTV, biometrics, alarm systems' },
  { icon: '🌿', name: 'Gardening', desc: 'Lawn care, pruning, plant health' },
];

const steps = [
  { num: '01', icon: '💬', title: 'Describe Your Problem', desc: "Just type what's broken — in English or Hinglish. Our AI understands it all." },
  { num: '02', icon: '🤖', title: 'AI Analyzes & Finds Help', desc: 'Fixora AI identifies the service, finds top-rated nearby technicians instantly.' },
  { num: '03', icon: '📅', title: 'Confirm & Get Booked', desc: 'Review the worker details, confirm, and the AI books it for you automatically.' },
];

const testimonials = [
  { name: 'Priya Sharma', city: 'Delhi', text: 'I just typed "AC not cooling" and within seconds the AI found a technician and booked it! Absolutely magical.', rating: 5 },
  { name: 'Rahul Verma', city: 'Mumbai', text: 'Best service booking experience ever. Fixora AI understood my broken English and still got the job done.', rating: 5 },
  { name: 'Anita Gupta', city: 'Bangalore', text: 'The AI Assistant is incredibly smart. It remembered my address and suggested the best-rated worker automatically.', rating: 5 },
];

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="landing">
      {/* Navbar */}
      <nav className="landing-nav">
        <div className="container landing-nav-inner">
          <div className="landing-logo">
            <div className="landing-logo-icon">⚡</div>
            <span>Fixora <em>AI</em></span>
          </div>
          <div className="landing-nav-links">
            <a href="#services">Services</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#testimonials">Reviews</a>
          </div>
          <div className="landing-nav-actions">
            {user ? (
              <Link to="/dashboard" className="btn btn-primary btn-sm">Go to Dashboard</Link>
            ) : (
              <>
                <Link to="/auth" className="btn btn-secondary btn-sm">Login</Link>
                <Link to="/auth?tab=register" className="btn btn-primary btn-sm">Get Started Free</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="landing-hero">
        <div className="hero-bg-blob blob1" />
        <div className="hero-bg-blob blob2" />
        <div className="container hero-content">
          <div className="hero-badge">
            <span>🚀</span> India's First Agentic AI Service Assistant
          </div>
          <h1 className="hero-title">
            Just Say It,<br />
            <span className="hero-title-gradient">Fixora AI Will Fix It</span>
          </h1>
          <p className="hero-desc">
            Describe any home repair problem in plain English or Hinglish.
            Our AI Agent automatically understands, finds the best technician nearby, and books the service — all in one conversation.
          </p>
          <div className="hero-actions">
            <Link to={user ? '/chat' : '/auth'} className="btn btn-primary btn-lg">
              🤖 Try AI Assistant Free
            </Link>
            <a href="#how-it-works" className="btn btn-secondary btn-lg">See How It Works</a>
          </div>
          <div className="hero-stats">
            <div className="hero-stat"><strong>25+</strong><span>Verified Workers</span></div>
            <div className="hero-stat-divider" />
            <div className="hero-stat"><strong>12</strong><span>Cities Covered</span></div>
            <div className="hero-stat-divider" />
            <div className="hero-stat"><strong>12</strong><span>Service Categories</span></div>
            <div className="hero-stat-divider" />
            <div className="hero-stat"><strong>100%</strong><span>AI Managed</span></div>
          </div>
        </div>

        {/* Floating chat demo */}
        <div className="container">
          <div className="hero-chat-demo">
            <div className="demo-header">
              <div className="demo-dot red" /><div className="demo-dot yellow" /><div className="demo-dot green" />
              <span>Fixora AI Chat</span>
            </div>
            <div className="demo-messages">
              <div className="demo-msg user">My fan is not working, please fix it today</div>
              <div className="demo-thinking">
                <span className="demo-thinking-step">🔍 Identifying service: <strong>Electrical / Fan Repair</strong></span>
                <span className="demo-thinking-step">🗺️ Finding workers near <strong>Delhi</strong>...</span>
                <span className="demo-thinking-step">✅ Found: <strong>Raju Kumar</strong> ⭐ 4.8 | ₹300/hr</span>
              </div>
              <div className="demo-msg ai">
                Great news! I found <strong>Raju Kumar</strong> ⭐ 4.8, available tomorrow at 10:00 AM for ₹300/hr.
                Shall I confirm the booking?
              </div>
              <div className="demo-msg user">Yes, book it!</div>
              <div className="demo-msg ai">✅ Booking confirmed! Raju Kumar will arrive tomorrow at 10:00 AM. Booking ID: <strong>#FX204891</strong></div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="landing-section" id="services">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">What We Fix</span>
            <h2>12 Services, Multi-City Experts</h2>
            <p>From a broken fan to a salon session — Fixora AI covers it all.</p>
          </div>
          <div className="services-grid">
            {services.map((s) => (
              <div key={s.name} className="service-card">
                <div className="service-card-icon">{s.icon}</div>
                <h4>{s.name}</h4>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="landing-section landing-section-alt" id="how-it-works">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">The Process</span>
            <h2>How Fixora AI Works</h2>
            <p>Powered by Gemini AI — the most intelligent way to book home services.</p>
          </div>
          <div className="steps-grid">
            {steps.map((s) => (
              <div key={s.num} className="step-card">
                <div className="step-num">{s.num}</div>
                <div className="step-icon">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="landing-section" id="testimonials">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Happy Customers</span>
            <h2>People Love Fixora AI</h2>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((t) => (
              <div key={t.name} className="testimonial-card">
                <div className="stars">{'⭐'.repeat(t.rating)}</div>
                <p className="testimonial-text">"{t.text}"</p>
                <div className="testimonial-author">
                  <div className="avatar avatar-sm">{t.name[0]}</div>
                  <div>
                    <p className="testimonial-name">{t.name}</p>
                    <p className="testimonial-city">{t.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="landing-cta">
        <div className="container">
          <div className="cta-card">
            <h2>Ready to Fix Something?</h2>
            <p>Join thousands of happy customers. Let Fixora AI handle your home repairs.</p>
            <Link to={user ? '/chat' : '/auth'} className="btn btn-primary btn-lg">
              🚀 Get Started — It's Free
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container">
          <div className="landing-logo">
            <div className="landing-logo-icon" style={{ width: 32, height: 32, fontSize: '1rem' }}>⚡</div>
            <span>Fixora <em>AI</em></span>
          </div>
          <p>© 2024 Fixora AI — Built with MERN + Google Gemini</p>
        </div>
      </footer>
    </div>
  );
}
