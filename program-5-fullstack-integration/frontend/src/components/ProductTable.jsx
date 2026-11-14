import React from 'react';

export default function ProductTable({ products, onEdit, onDelete }) {
  if (!products || products.length === 0) {
    return (
      <div style={{ padding: '3.5rem', textAlign: 'center', color: '#64748b' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📦</div>
        <p style={{ fontWeight: 600, fontSize: '1.1rem' }}>No inventory products found in database</p>
        <p style={{ fontSize: '0.85rem' }}>Add a product or adjust your search filter criteria.</p>
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
            <th className="text-center">Quantity</th>
            <th className="text-right">Total Valuation</th>
            <th className="text-center">Status</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((item) => {
            const valuation = (item.quantity * item.unitPrice).toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD'
            });
            const unitPrice = Number(item.unitPrice).toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD'
            });

            let badgeClass = 'badge-in-stock';
            let badgeLabel = 'In Stock';
            if (item.quantity === 0) {
              badgeClass = 'badge-out-of-stock';
              badgeLabel = 'Out of Stock';
            } else if (item.quantity <= item.minThreshold) {
              badgeClass = 'badge-low-stock';
              badgeLabel = `Low (${item.quantity}/${item.minThreshold})`;
            }

            return (
              <tr key={item.id}>
                <td>
                  <span className="sku-tag">{item.sku}</span>
                </td>
                <td>
                  <div style={{ fontWeight: 600, color: '#0f172a' }}>{item.name}</div>
                  <small style={{ color: '#64748b', fontSize: '0.725rem' }}>DB ID: #{item.id}</small>
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
                  <span className={`badge-pill ${badgeClass}`}>
                    <span className="dot"></span> {badgeLabel}
                  </span>
                </td>
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
                      onClick={() => onDelete(item.id, item.name)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

