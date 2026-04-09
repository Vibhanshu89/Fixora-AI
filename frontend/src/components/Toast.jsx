import './Toast.css';

export default function Toast({ toast }) {
  if (!toast) return null;
  const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
  return (
    <div className={`toast toast-${toast.type}`}>
      <span className="toast-icon">{icons[toast.type] || 'ℹ️'}</span>
      <span className="toast-message">{toast.message}</span>
    </div>
  );
}
