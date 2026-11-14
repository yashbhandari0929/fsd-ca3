import React from 'react';
import StockBadge from './StockBadge';

export default function InventoryTable({ products, onEdit, onDelete, showActions = true }) {
  if (!products || products.length === 0) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
        <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>No products found matching the criteria.</p>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table>
        <thead>
          <tr>
            <th>SKU</th>
            <th>Product Name</th>
            <th>Category</th>
            <th>Supplier</th>
            <th className="text-right">Unit Price</th>
            <th className="text-center">Stock Level</th>
            <th className="text-right">Total Valuation</th>
            <th className="text-center">Status</th>
            {showActions && <th className="text-center">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {products.map((item) => {
            const valuation = (item.quantity * item.unitPrice).toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD'
            });
            const unitPrice = item.unitPrice.toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD'
            });

            return (
              <tr key={item.id}>
                <td>
                  <span className="sku-badge">{item.sku}</span>
                </td>
                <td>
                  <strong style={{ color: '#0f172a' }}>{item.name}</strong>
                  <div style={{ fontSize: '0.725rem', color: '#64748b' }}>{item.id}</div>
                </td>
                <td>
                  <span style={{ fontSize: '0.8rem', backgroundColor: '#f1f5f9', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                    {item.category}
                  </span>
                </td>
                <td>{item.supplier}</td>
                <td className="text-right font-mono">{unitPrice}</td>
                <td className="text-center font-bold">{item.quantity}</td>
                <td className="text-right font-mono font-bold">{valuation}</td>
                <td className="text-center">
                  <StockBadge quantity={item.quantity} threshold={item.minThreshold} />
                </td>
                {showActions && (
                  <td className="text-center">
                    <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                      <button
                        className="btn btn-secondary"
                        style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                        onClick={() => onEdit(item)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger"
                        style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                        onClick={() => onDelete(item.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

