import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Toast from './components/Toast';
import { useToast } from './hooks/useToast';

import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import ChatPage from './pages/ChatPage';
import ServicesPage from './pages/ServicesPage';
import WorkersPage from './pages/WorkersPage';
import WorkerProfilePage from './pages/WorkerProfilePage';
import BookingsPage from './pages/BookingsPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg-base)' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>⚡</div>
        <div className="spinner" style={{ width: 32, height: 32, borderWidth: 3, margin: '0 auto' }} />
      </div>
    </div>
  );
  if (!user) return <Navigate to="/auth" replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
}

function AppLayout({ children }) {
  return (
    <div className="page-wrapper">
      <Sidebar />
      <main className="main-content">{children}</main>
    </div>
  );
}

function AppRoutes() {
  const { user } = useAuth();
  const { toast } = useToast();
  const location = useLocation();

  // Full-page routes (no sidebar)
  const noSidebarRoutes = ['/', '/auth', '/auth/google/success'];
  const isFullPage = noSidebarRoutes.includes(location.pathname) || location.pathname.startsWith('/auth');

  return (
    <>
      <Toast toast={toast} />
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/auth/google/success" element={<AuthPage />} />

        {/* Protected with sidebar */}
        <Route path="/dashboard" element={<ProtectedRoute><AppLayout><DashboardPage /></AppLayout></ProtectedRoute>} />
        <Route path="/chat" element={<ProtectedRoute><AppLayout><ChatPage /></AppLayout></ProtectedRoute>} />
        <Route path="/services" element={<ProtectedRoute><AppLayout><ServicesPage /></AppLayout></ProtectedRoute>} />
        <Route path="/workers" element={<ProtectedRoute><AppLayout><WorkersPage /></AppLayout></ProtectedRoute>} />
        <Route path="/workers/:id" element={<ProtectedRoute><AppLayout><WorkerProfilePage /></AppLayout></ProtectedRoute>} />
        <Route path="/bookings" element={<ProtectedRoute><AppLayout><BookingsPage /></AppLayout></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><AppLayout><ProfilePage /></AppLayout></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute adminOnly><AppLayout><AdminPage /></AppLayout></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to={user ? '/dashboard' : '/'} replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
