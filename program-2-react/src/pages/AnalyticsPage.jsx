import React from 'react';
import StatCard from '../components/StatCard';

export default function AnalyticsPage({ products }) {
  const totalValuation = products.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const totalQuantity = products.reduce((sum, item) => sum + item.quantity, 0);

  // Group by category
  const categoryStats = {};
  products.forEach((p) => {
    if (!categoryStats[p.category]) {
      categoryStats[p.category] = { count: 0, quantity: 0, valuation: 0 };
    }
    categoryStats[p.category].count += 1;
    categoryStats[p.category].quantity += p.quantity;
    categoryStats[p.category].valuation += p.quantity * p.unitPrice;
  });

  const categories = Object.keys(categoryStats).map((cat) => ({
    name: cat,
    ...categoryStats[cat],
    percentage: totalValuation > 0 ? ((categoryStats[cat].valuation / totalValuation) * 100).toFixed(1) : 0
  }));

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Inventory Valuation & Analytics</h1>
          <p className="page-desc">Asset distribution, category breakdown, and capital allocation metrics.</p>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard
          title="Portfolio Capital"
          value={totalValuation.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
          icon="💵"
          meta="Gross inventory capital"
        />
        <StatCard
          title="Total Physical Units"
          value={totalQuantity}
          icon="📦"
          meta="Units across all SKUs"
        />
        <StatCard
          title="Average SKU Valuation"
          value={
            products.length > 0
              ? (totalValuation / products.length).toLocaleString('en-US', { style: 'currency', currency: 'USD' })
              : '$0.00'
          }
          icon="📊"
          meta="Mean value per product"
        />
        <StatCard
          title="Active Categories"
          value={categories.length}
          icon="📑"
          meta="Catalog classification"
        />
      </div>

      <div className="card chart-card">
        <div className="card-header">
          <h3 className="card-title">Category Valuation & Allocation Breakdown</h3>
        </div>
        <div className="card-body">
          {categories.map((c) => (
            <div key={c.name} className="breakdown-row">
              <div style={{ width: '180px' }}>
                <strong>{c.name}</strong>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  {c.count} SKUs &bull; {c.quantity} units
                </div>
              </div>

              <div className="progress-bar-container">
                <div className="progress-bar-fill" style={{ width: `${Math.min(c.percentage, 100)}%` }}></div>
              </div>

              <div style={{ width: '140px', textAlign: 'right' }}>
                <div className="font-mono font-bold" style={{ color: '#0f172a' }}>
                  {c.valuation.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: 600 }}>
                  {c.percentage}% of Total
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

