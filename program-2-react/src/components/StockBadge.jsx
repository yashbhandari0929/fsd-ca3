import React from 'react';

export default function StockBadge({ quantity, threshold }) {
  if (quantity === 0) {
    return (
      <span className="badge-pill badge-out-of-stock">
        <span className="dot"></span> Out of Stock
      </span>
    );
  }

  if (quantity <= threshold) {
    return (
      <span className="badge-pill badge-low-stock">
        <span className="dot"></span> Low ({quantity}/{threshold})
      </span>
    );
  }

  return (
    <span className="badge-pill badge-in-stock">
      <span className="dot"></span> In Stock
    </span>
  );
}

