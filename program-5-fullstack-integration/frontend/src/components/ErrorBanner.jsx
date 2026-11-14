import React from 'react';

export default function ErrorBanner({ message, onRetry }) {
  if (!message) return null;

  return (
    <div className="error-banner">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <span style={{ fontSize: '1.25rem' }}>⚠️</span>
        <div>
          <strong>Backend Error:</strong> {message}
        </div>
      </div>
      {onRetry && (
        <button className="btn btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }} onClick={onRetry}>
          Retry Connection
        </button>
      )}
    </div>
  );
}

