import React from 'react';

export default function StatCard({ title, value, icon, meta, colorClass }) {
  return (
    <div className="stat-card">
      <div className="stat-top">
        <span className="stat-title">{title}</span>
        <span className="stat-icon">{icon}</span>
      </div>
      <div className={`stat-value ${colorClass || ''}`}>{value}</div>
      {meta && <div className="stat-meta">{meta}</div>}
    </div>
  );
}

