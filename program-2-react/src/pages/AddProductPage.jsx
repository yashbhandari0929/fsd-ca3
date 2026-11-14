import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CATEGORIES } from '../data/initialData';

export default function AddProductPage({ onAddProduct }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: CATEGORIES[0],
    quantity: 1,
    unitPrice: 19.99,
    supplier: '',
    minThreshold: 5
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!formData.name.trim() || formData.name.trim().length < 3) {
      errs.name = 'Product name must have at least 3 characters.';
    }
    if (!formData.sku.trim() || !/^[A-Z0-9\-_]{3,20}$/i.test(formData.sku.trim())) {
      errs.sku = 'Valid alphanumeric SKU required (3-20 chars).';
    }
    if (!formData.category) {
      errs.category = 'Please select a valid category.';
    }
    if (isNaN(formData.quantity) || formData.quantity < 0) {
      errs.quantity = 'Quantity must be zero or a positive integer.';
    }
    if (isNaN(formData.unitPrice) || formData.unitPrice <= 0) {
      errs.unitPrice = 'Price must be greater than $0.00.';
    }
    if (!formData.supplier.trim()) {
      errs.supplier = 'Supplier / Vendor name is required.';
    }
    if (isNaN(formData.minThreshold) || formData.minThreshold < 1) {
      errs.minThreshold = 'Minimum threshold must be at least 1 unit.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onAddProduct({
      ...formData,
      quantity: Number(formData.quantity),
      unitPrice: Number(parseFloat(formData.unitPrice).toFixed(2)),
      minThreshold: Number(formData.minThreshold)
    });

    navigate('/inventory');
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Register New Inventory Product</h1>
          <p className="page-desc">Add a new SKU into the React state store and synchronize with persistent storage.</p>
        </div>
      </div>

      <div className="card" style={{ maxWidth: '800px' }}>
        <div className="card-header">
          <h3 className="card-title">Product Specification Details</h3>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-field col-span-2">
              <label>Product Name *</label>
              <input
                type="text"
                placeholder="e.g. Dell UltraSharp 27-inch 4K Monitor"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>

            <div className="form-field">
              <label>SKU Code *</label>
              <input
                type="text"
                placeholder="e.g. MON-DEL-4K"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value.toUpperCase() })}
              />
              {errors.sku && <span className="field-error">{errors.sku}</span>}
            </div>

            <div className="form-field">
              <label>Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {errors.category && <span className="field-error">{errors.category}</span>}
            </div>

            <div className="form-field">
              <label>Initial Quantity *</label>
              <input
                type="number"
                min="0"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              />
              {errors.quantity && <span className="field-error">{errors.quantity}</span>}
            </div>

            <div className="form-field">
              <label>Unit Price ($) *</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={formData.unitPrice}
                onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
              />
              {errors.unitPrice && <span className="field-error">{errors.unitPrice}</span>}
            </div>

            <div className="form-field">
              <label>Supplier / Vendor *</label>
              <input
                type="text"
                placeholder="e.g. Dell Direct India"
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
              />
              {errors.supplier && <span className="field-error">{errors.supplier}</span>}
            </div>

            <div className="form-field">
              <label>Low Stock Alert Threshold *</label>
              <input
                type="number"
                min="1"
                value={formData.minThreshold}
                onChange={(e) => setFormData({ ...formData, minThreshold: e.target.value })}
              />
              {errors.minThreshold && <span className="field-error">{errors.minThreshold}</span>}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/inventory')}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save & Register Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

