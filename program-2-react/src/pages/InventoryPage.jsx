import React, { useState, useMemo } from 'react';
import SearchFilterBar from '../components/SearchFilterBar';
import InventoryTable from '../components/InventoryTable';

export default function InventoryPage({ products, onEdit, onDelete, onOpenModal }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('ALL');
  const [stockLevel, setStockLevel] = useState('ALL');
  const [sortBy, setSortBy] = useState('name_asc');

  const filteredProducts = useMemo(() => {
    return products
      .filter((item) => {
        const matchesSearch =
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.supplier.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCat = category === 'ALL' || item.category === category;

        let matchesStock = true;
        if (stockLevel === 'IN_STOCK') matchesStock = item.quantity > item.minThreshold;
        if (stockLevel === 'LOW_STOCK') matchesStock = item.quantity > 0 && item.quantity <= item.minThreshold;
        if (stockLevel === 'OUT_OF_STOCK') matchesStock = item.quantity === 0;

        return matchesSearch && matchesCat && matchesStock;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'name_asc': return a.name.localeCompare(b.name);
          case 'name_desc': return b.name.localeCompare(a.name);
          case 'price_asc': return a.unitPrice - b.unitPrice;
          case 'price_desc': return b.unitPrice - a.unitPrice;
          case 'qty_asc': return a.quantity - b.quantity;
          case 'qty_desc': return b.quantity - a.quantity;
          default: return 0;
        }
      });
  }, [products, searchTerm, category, stockLevel, sortBy]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setCategory('ALL');
    setStockLevel('ALL');
    setSortBy('name_asc');
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Inventory Master Catalog</h1>
          <p className="page-desc">Comprehensive database listing with multi-field search and real-time filtering.</p>
        </div>
        <button className="btn btn-primary" onClick={() => onOpenModal()}>
          + Add New Product
        </button>
      </div>

      <div className="card">
        <SearchFilterBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          category={category}
          setCategory={setCategory}
          stockLevel={stockLevel}
          setStockLevel={setStockLevel}
          sortBy={sortBy}
          setSortBy={setSortBy}
          onReset={handleResetFilters}
        />

        <div style={{ padding: '0.75rem 1.5rem', backgroundColor: '#fff', borderBottom: '1px solid #e2e8f0', fontSize: '0.8rem', color: '#64748b' }}>
          Showing <strong>{filteredProducts.length}</strong> of <strong>{products.length}</strong> inventory products
        </div>

        <InventoryTable
          products={filteredProducts}
          onEdit={onEdit}
          onDelete={onDelete}
          showActions={true}
        />
      </div>
    </div>
  );
}

