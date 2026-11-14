import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProductFormModal from './components/ProductFormModal';
import DashboardPage from './pages/DashboardPage';
import InventoryPage from './pages/InventoryPage';
import AddProductPage from './pages/AddProductPage';
import AnalyticsPage from './pages/AnalyticsPage';
import AboutPage from './pages/AboutPage';
import { initialProducts } from './data/initialData';

const STORAGE_KEY = 'apex_inventory_react_store_v1';

export default function App() {
  const [products, setProducts] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : initialProducts;
    } catch (e) {
      console.error('Failed to read from localStorage:', e);
      return initialProducts;
    }
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [toast, setToast] = useState(null);

  // Sync state changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch (e) {
      console.error('Failed to sync to localStorage:', e);
    }
  }, [products]);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

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

  const handleSaveProduct = (productData) => {
    if (productData.id) {
      // Update
      setProducts((prev) =>
        prev.map((item) =>
          item.id === productData.id ? { ...productData, lastUpdated: new Date().toISOString() } : item
        )
      );
      showToast(`Updated product "${productData.name}"`);
    } else {
      // Add new
      const newItem = {
        ...productData,
        id: 'PRD-' + (Date.now().toString().slice(-6)),
        lastUpdated: new Date().toISOString()
      };
      setProducts((prev) => [newItem, ...prev]);
      showToast(`Added new product "${newItem.name}"`);
    }
    handleCloseModal();
  };

  const handleDeleteProduct = (id) => {
    const item = products.find((p) => p.id === id);
    if (window.confirm(`Delete product "${item?.name}" (${item?.sku})?`)) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      showToast(`Deleted ${item?.sku}`);
    }
  };

  return (
    <Router>
      <Navbar />

      <main>
        <Routes>
          <Route
            path="/"
            element={
              <DashboardPage
                products={products}
                onEdit={handleOpenEditModal}
                onDelete={handleDeleteProduct}
              />
            }
          />
          <Route
            path="/inventory"
            element={
              <InventoryPage
                products={products}
                onEdit={handleOpenEditModal}
                onDelete={handleDeleteProduct}
                onOpenModal={handleOpenAddModal}
              />
            }
          />
          <Route
            path="/add"
            element={<AddProductPage onAddProduct={handleSaveProduct} />}
          />
          <Route
            path="/analytics"
            element={<AnalyticsPage products={products} />}
          />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </main>

      <ProductFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveProduct}
        editingProduct={editingProduct}
      />

      {toast && <div className="toast-msg">{toast}</div>}
    </Router>
  );
}

