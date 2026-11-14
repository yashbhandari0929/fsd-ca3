import React from 'react';
import { Link } from 'react-router-dom';
import StatCard from '../components/StatCard';
import InventoryTable from '../components/InventoryTable';

export default function DashboardPage({ products, onEdit, onDelete }) {
  const totalValuation = products.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const lowStockCount = products.filter((i) => i.quantity > 0 && i.quantity <= i.minThreshold).length;
  const outOfStockCount = products.filter((i) => i.quantity === 0).length;
  const categoriesCount = new Set(products.map((i) => i.category)).size;

  const lowStockItems = products.filter((i) => i.quantity <= i.minThreshold);
  const recentProducts = [...products].slice(0, 5);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Executive Inventory Summary</h1>
          <p className="page-desc">Real-time status overview of enterprise inventory assets and valuation.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/inventory" className="btn btn-secondary">
            View Full Catalog
          </Link>
          <Link to="/add" className="btn btn-primary">
            + Add New Product
          </Link>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard
          title="Total SKUs"
          value={products.length}
          icon="📦"
          meta={`${categoriesCount} Active Categories`}
        />
        <StatCard
          title="Total Portfolio Valuation"
          value={totalValuation.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
          icon="💰"
          meta="Sum of active inventory assets"
        />
        <StatCard
          title="Low Stock Items"
          value={lowStockCount}
          icon="⚠️"
          colorClass="text-amber"
          meta="Items requiring reordering"
        />
        <StatCard
          title="Out of Stock"
          value={outOfStockCount}
          icon="🚫"
          colorClass="text-rose"
          meta="Zero quantity remaining"
        />
      </div>

      {lowStockItems.length > 0 && (
        <div className="card" style={{ borderLeft: '4px solid #d97706' }}>
          <div className="card-header">
            <h3 className="card-title">⚠️ Priority Reorder Alerts ({lowStockItems.length})</h3>
            <span style={{ fontSize: '0.8rem', color: '#d97706', fontWeight: 600 }}>Action Required</span>
          </div>
          <InventoryTable
            products={lowStockItems}
            onEdit={onEdit}
            onDelete={onDelete}
            showActions={true}
          />
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Recently Updated Inventory Items</h3>
          <Link to="/inventory" style={{ fontSize: '0.875rem', color: '#2563eb', textDecoration: 'none', fontWeight: 600 }}>
            Browse All &rarr;
          </Link>
        </div>
        <InventoryTable
          products={recentProducts}
          onEdit={onEdit}
          onDelete={onDelete}
          showActions={true}
        />
      </div>
    </div>
  );
}

