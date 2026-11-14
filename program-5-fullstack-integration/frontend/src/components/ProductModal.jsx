import React, { useState, useEffect } from 'react';

const CATEGORIES = [
  "Electronics",
  "Computers",
  "Accessories",
  "Networking",
  "Storage",
  "Office Supplies"
];

export default function ProductModal({ isOpen, onClose, onSave, editingProduct, isSubmitting }) {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: CATEGORIES[0],
    quantity: 1,
    unitPrice: 10.0,
    supplier: '',
    minThreshold: 5
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name,
        sku: editingProduct.sku,
        category: editingProduct.category,
        quantity: editingProduct.quantity,
        unitPrice: editingProduct.unitPrice,
        supplier: editingProduct.supplier,
        minThreshold: editingProduct.minThreshold
      });
    } else {
      setFormData({
        name: '',
        sku: '',
        category: CATEGORIES[0],
        quantity: 1,
        unitPrice: 19.99,
        supplier: '',
        minThreshold: 5
      });
    }
    setErrors({});
  }, [editingProduct, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.name.trim() || formData.name.trim().length < 3) {
      errs.name = 'Product name must have at least 3 characters.';
    }
    if (!formData.sku.trim() || !/^[A-Z0-9\-_]{3,20}$/i.test(formData.sku.trim())) {
      errs.sku = 'Valid alphanumeric SKU required (3-20 chars).';
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
    onSave({
      ...formData,
      quantity: Number(formData.quantity),
      unitPrice: Number(parseFloat(formData.unitPrice).toFixed(2)),
      minThreshold: Number(formData.minThreshold)
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3>
            {editingProduct ? `Edit Database Record: ${editingProduct.sku}` : 'Persist New Product to Database'}
          </h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group col-span-2">
              <label>Product Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Dell UltraSharp 27-inch 4K Monitor"
              />
              {errors.name && <span className="form-error">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label>SKU Code *</label>
              <input
                type="text"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value.toUpperCase() })}
                placeholder="e.g. MON-DEL-4K"
              />
              {errors.sku && <span className="form-error">{errors.sku}</span>}
            </div>

            <div className="form-group">
              <label>Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Quantity *</label>
              <input
                type="number"
                min="0"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              />
              {errors.quantity && <span className="form-error">{errors.quantity}</span>}
            </div>

            <div className="form-group">
              <label>Unit Price ($) *</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={formData.unitPrice}
                onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
              />
              {errors.unitPrice && <span className="form-error">{errors.unitPrice}</span>}
            </div>

            <div className="form-group">
              <label>Supplier / Vendor *</label>
              <input
                type="text"
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                placeholder="e.g. Dell Direct India"
              />
              {errors.supplier && <span className="form-error">{errors.supplier}</span>}
            </div>

            <div className="form-group">
              <label>Low Stock Alert Threshold *</label>
              <input
                type="number"
                min="1"
                value={formData.minThreshold}
                onChange={(e) => setFormData({ ...formData, minThreshold: e.target.value })}
              />
              {errors.minThreshold && <span className="form-error">{errors.minThreshold}</span>}
            </div>
          </div>

          <div className="modal-foot">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : editingProduct ? 'Commit Changes' : 'Persist to Database'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

