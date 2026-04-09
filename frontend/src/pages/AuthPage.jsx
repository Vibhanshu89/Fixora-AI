import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './AuthPage.css';

export default function AuthPage() {
  const [params] = useSearchParams();
  const [tab, setTab] = useState(params.get('tab') === 'register' ? 'register' : 'login');
  const [form, setForm] = useState({ name: '', email: '', password: '', city: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, user } = useAuth();
  const navigate = useNavigate();

  // Handle Google OAuth redirect
  useEffect(() => {
    const token = params.get('token');
    if (token) {
      const userData = {
        id: params.get('id'), name: params.get('name'),
        email: params.get('email'), avatar: params.get('avatar'),
        role: params.get('role'),
      };
      login(userData, token);
      navigate('/dashboard');
    }
  }, []);

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user]);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const endpoint = tab === 'login' ? '/api/auth/login' : '/api/auth/register';
      const { data } = await axios.post(endpoint, form);
      login(data.user, data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    const API_BASE_URL = import.meta.env.VITE_API_URL || '';
    window.location.href = `${API_BASE_URL}/api/auth/google`;
  };

  return (
    <div className="auth-page">
      <div className="auth-bg-blob" />
      <div className="auth-left">
        <Link to="/" className="auth-brand">
          <div className="landing-logo-icon">⚡</div>
          <span style={{ fontFamily: 'Space Grotesk', fontSize: '1.3rem', fontWeight: 700 }}>
            Fixora <em style={{ color: 'var(--primary)', fontStyle: 'normal' }}>AI</em>
          </span>
        </Link>
        <div className="auth-left-content">
          <h1>India's AI-Powered<br />Home Service Platform</h1>
          <p>Describe your problem, and let our intelligent agent find experts and book services in seconds.</p>
          <div className="auth-features">
            {['🤖 Agentic AI understands your problem', '🔧 Verified technicians across India', '📅 Instant booking, zero calls', '⭐ Trusted by thousands of homes'].map(f => (
              <div key={f} className="auth-feature">{f}</div>
            ))}
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-tabs">
            <button className={`auth-tab ${tab === 'login' ? 'active' : ''}`} onClick={() => setTab('login')}>Sign In</button>
            <button className={`auth-tab ${tab === 'register' ? 'active' : ''}`} onClick={() => setTab('register')}>Create Account</button>
          </div>

          <h2 className="auth-title">
            {tab === 'login' ? 'Welcome Back 👋' : 'Join Fixora AI 🚀'}
          </h2>
          <p className="auth-sub">
            {tab === 'login' ? 'Sign in to your account to continue.' : 'Create your free account today.'}
          </p>

          <button className="google-btn" onClick={handleGoogle}>
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            Continue with Google
          </button>

          <div className="divider-text">or continue with email</div>

          {error && <div className="auth-error">⚠️ {error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            {tab === 'register' && (
              <>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input className="form-input" name="name" placeholder="John Doe" value={form.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input className="form-input" name="city" placeholder="Delhi, Mumbai, Bangalore..." value={form.city} onChange={handleChange} />
                </div>
              </>
            )}
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input className="form-input" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" name="password" type="password" placeholder="Min. 6 characters" value={form.password} onChange={handleChange} required />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? <span className="spinner" /> : tab === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <p className="auth-footer-text">
            {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button className="auth-link-btn" onClick={() => setTab(tab === 'login' ? 'register' : 'login')}>
              {tab === 'login' ? 'Sign up free' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
