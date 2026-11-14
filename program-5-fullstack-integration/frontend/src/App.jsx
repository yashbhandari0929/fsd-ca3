import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import StatCards from './components/StatCards';
import ProductTable from './components/ProductTable';
import ProductModal from './components/ProductModal';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorBanner from './components/ErrorBanner';
import { getProducts, getInventoryStats, createProduct, updateProduct, deleteProduct } from './api';

export default function App() {
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('ALL');
  const [stockLevel, setStockLevel] = useState('ALL');
  const [sortBy, setSortBy] = useState('name_asc');

  // Modal & Toast
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [prodRes, statRes] = await Promise.all([
        getProducts({ search: searchTerm, category, stockLevel, sortBy }),
        getInventoryStats()
      ]);

      setProducts(prodRes.data || []);
      setStats(statRes.stats || null);
      setIsConnected(true);
    } catch (err) {
      console.error('Failed to load backend data:', err);
      setError(err.message || 'Unable to connect to Express backend.');
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, category, stockLevel, sortBy]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSaveProduct = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, formData);
        showToast(`Successfully updated ${formData.sku} in database.`);
      } else {
        await createProduct(formData);
        showToast(`Successfully created new SKU ${formData.sku} in database.`);
      }
      handleCloseModal();
      await loadData();
    } catch (err) {
      alert(`Database Operation Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Permanently delete "${name}" from database?`)) return;
    try {
      await deleteProduct(id);
      showToast(`Removed product #${id} from database.`);
      await loadData();
    } catch (err) {
      alert(`Deletion Error: ${err.message}`);
    }
  };

  return (
    <div>
      <Navbar onRefresh={loadData} isConnected={isConnected} />

      <main className="main-layout">
        <div className="top-bar">
          <div>
            <h1 className="page-title">Enterprise Database Inventory</h1>
            <p className="page-desc">
              Integrated React SPA with Express REST API and Sequelize ORM Relational Persistence.
            </p>
          </div>
          <button className="btn btn-primary" onClick={handleOpenAddModal}>
            + Add New Database Item
          </button>
        </div>

        {error && <ErrorBanner message={error} onRetry={loadData} />}

        <StatCards stats={stats} />

        <div className="card">
          <div className="toolbar">
            <div className="toolbar-left">
              <input
                type="text"
                className="input-search"
                placeholder="Search database (Name, SKU, Vendor)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="ALL">All Categories</option>
                {stats?.categories?.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <select value={stockLevel} onChange={(e) => setStockLevel(e.target.value)}>
                <option value="ALL">All Stock Levels</option>
                <option value="IN_STOCK">In Stock</option>
                <option value="LOW_STOCK">Low Stock</option>
                <option value="OUT_OF_STOCK">Out of Stock</option>
              </select>
            </div>

            <div className="toolbar-right">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="name_asc">Name (A-Z)</option>
                <option value="name_desc">Name (Z-A)</option>
                <option value="price_desc">Price (High to Low)</option>
                <option value="price_asc">Price (Low to High)</option>
                <option value="qty_desc">Quantity (High to Low)</option>
                <option value="qty_asc">Quantity (Low to High)</option>
              </select>

              <button className="btn btn-secondary" onClick={loadData} title="Refresh records">
                Refresh
              </button>
            </div>
          </div>

          <div style={{ padding: '0.65rem 1.5rem', backgroundColor: '#fff', borderBottom: '1px solid #e2e8f0', fontSize: '0.8rem', color: '#64748b' }}>
            Database records matching filter: <strong>{products.length}</strong>
          </div>

          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <ProductTable
              products={products}
              onEdit={handleOpenEditModal}
              onDelete={handleDeleteProduct}
            />
          )}
        </div>
      </main>

      <ProductModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveProduct}
        editingProduct={editingProduct}
        isSubmitting={isSubmitting}
      />

      {toast && <div className="toast-notice">{toast}</div>}
    </div>
  );
}

