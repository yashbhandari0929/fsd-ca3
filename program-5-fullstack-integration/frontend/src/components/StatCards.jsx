import React from 'react';

export default function StatCards({ stats }) {
  if (!stats) return null;

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-head">
          <span className="stat-label">Total SKUs</span>
          <span className="stat-icon">📦</span>
        </div>
        <div className="stat-value">{stats.totalProducts || 0}</div>
        <div className="stat-meta">{stats.categories?.length || 0} Product Categories</div>
      </div>

      <div className="stat-card">
        <div className="stat-head">
          <span className="stat-label">Database Valuation</span>
          <span className="stat-icon">💰</span>
        </div>
        <div className="stat-value">
          {(stats.totalValuation || 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
        </div>
        <div className="stat-meta">Live calculated from DB records</div>
      </div>

      <div className="stat-card">
        <div className="stat-head">
          <span className="stat-label">Low Stock</span>
          <span className="stat-icon">⚠️</span>
        </div>
        <div className="stat-value text-amber">{stats.lowStockCount || 0}</div>
        <div className="stat-meta">Items &le; Safety threshold</div>
      </div>

      <div className="stat-card">
        <div className="stat-head">
          <span className="stat-label">Out of Stock</span>
          <span className="stat-icon">🚫</span>
        </div>
        <div className="stat-value text-rose">{stats.outOfStockCount || 0}</div>
        <div className="stat-meta">Zero inventory remaining</div>
      </div>
    </div>
  );
}

