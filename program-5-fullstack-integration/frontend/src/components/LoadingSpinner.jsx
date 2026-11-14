import React from 'react';

export default function LoadingSpinner({ message = 'Loading inventory data from backend database...' }) {
  return (
    <div className="loading-box">
      <div className="spinner"></div>
      <p style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 500 }}>{message}</p>
    </div>
  );
}

