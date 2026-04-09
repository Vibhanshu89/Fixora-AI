import './AgentThinkingPanel.css';

const toolLabels = {
  defineService: { icon: '🔍', label: 'Analyzing Problem' },
  findWorker: { icon: '🗺️', label: 'Finding Workers' },
  checkAvailability: { icon: '📅', label: 'Checking Availability' },
  createBooking: { icon: '✅', label: 'Creating Booking' },
  getBookingStatus: { icon: '📋', label: 'Fetching Status' },
};

export default function AgentThinkingPanel({ steps, isThinking }) {
  return (
    <div className="agent-panel">
      <div className="agent-panel-header">
        <div className="agent-panel-icon">🤖</div>
        <div>
          <h4 className="agent-panel-title">Agent Activity</h4>
          <p className="agent-panel-sub">Real-time AI reasoning</p>
        </div>
        {isThinking && <div className="agent-thinking-dot" />}
      </div>

      <div className="agent-steps">
        {steps.length === 0 && !isThinking && (
          <div className="agent-empty">
            <span>💡</span>
            <p>Agent steps will appear here as AI works on your request.</p>
          </div>
        )}

        {isThinking && (
          <div className="agent-step thinking">
            <div className="agent-step-icon">🧠</div>
            <div className="agent-step-content">
              <p className="agent-step-label">Thinking...</p>
              <div className="agent-dots">
                <span /><span /><span />
              </div>
            </div>
          </div>
        )}

        {steps.map((step, i) => {
          const toolInfo = toolLabels[step.tool] || { icon: '⚙️', label: step.tool };
          return (
            <div key={i} className={`agent-step ${step.type}`}>
              <div className="agent-step-icon">{toolInfo.icon}</div>
              <div className="agent-step-content">
                <p className="agent-step-label">{toolInfo.label}</p>
                {step.detail && <p className="agent-step-detail">{step.detail}</p>}
                {step.type === 'result' && (
                  <span className="badge badge-success" style={{ marginTop: 4 }}>Completed</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
