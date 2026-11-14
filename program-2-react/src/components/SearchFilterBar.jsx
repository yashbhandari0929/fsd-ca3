import React from 'react';
import { CATEGORIES } from '../data/initialData';

export default function SearchFilterBar({
  searchTerm,
  setSearchTerm,
  category,
  setCategory,
  stockLevel,
  setStockLevel,
  sortBy,
  setSortBy,
  onReset
}) {
  return (
    <div className="filter-bar">
      <div className="filter-left">
        <input
          type="text"
          className="search-input"
          placeholder="Search by name, SKU, vendor..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="ALL">All Categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select value={stockLevel} onChange={(e) => setStockLevel(e.target.value)}>
          <option value="ALL">All Stock Levels</option>
          <option value="IN_STOCK">In Stock</option>
          <option value="LOW_STOCK">Low Stock</option>
          <option value="OUT_OF_STOCK">Out of Stock</option>
        </select>
      </div>

      <div className="filter-right">
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="name_asc">Name (A-Z)</option>
          <option value="name_desc">Name (Z-A)</option>
          <option value="price_desc">Price (High to Low)</option>
          <option value="price_asc">Price (Low to High)</option>
          <option value="qty_desc">Stock Quantity (High)</option>
          <option value="qty_asc">Stock Quantity (Low)</option>
        </select>

        {onReset && (
          <button className="btn btn-secondary" onClick={onReset} title="Reset filters">
            Reset Filters
          </button>
        )}
      </div>
    </div>
  );
}

