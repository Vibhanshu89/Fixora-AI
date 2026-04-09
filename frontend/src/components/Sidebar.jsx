import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const navItems = [
  { icon: '🏠', label: 'Dashboard', path: '/dashboard' },
  { icon: '🤖', label: 'AI Assistant', path: '/chat' },
  { icon: '🔧', label: 'Services', path: '/services' },
  { icon: '👷', label: 'Workers', path: '/workers' },
  { icon: '📋', label: 'My Bookings', path: '/bookings' },
  { icon: '👤', label: 'Profile', path: '/profile' },
];

export default function Sidebar() {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Link to="/dashboard" className="sidebar-logo">
          <div className="sidebar-logo-icon">⚡</div>
          <span className="sidebar-logo-text">Fixora <em>AI</em></span>
        </Link>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(({ icon, label, path }) => (
          <Link
            key={path}
            to={path}
            className={`sidebar-link ${pathname === path ? 'active' : ''}`}
          >
            <span className="sidebar-icon">{icon}</span>
            <span className="sidebar-label">{label}</span>
            {pathname === path && <span className="sidebar-active-dot" />}
          </Link>
        ))}
        {user?.role === 'admin' && (
          <Link
            to="/admin"
            className={`sidebar-link ${pathname === '/admin' ? 'active' : ''}`}
          >
            <span className="sidebar-icon">🛡️</span>
            <span className="sidebar-label">Admin Panel</span>
            {pathname === '/admin' && <span className="sidebar-active-dot" />}
          </Link>
        )}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="avatar avatar-sm">
            {user?.avatar
              ? <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
              : user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="sidebar-user-info">
            <p className="sidebar-user-name">{user?.name}</p>
            <p className="sidebar-user-role">{user?.role}</p>
          </div>
        </div>
        <button className="sidebar-logout" onClick={handleLogout} title="Logout">⬆️</button>
      </div>
    </aside>
  );
}
