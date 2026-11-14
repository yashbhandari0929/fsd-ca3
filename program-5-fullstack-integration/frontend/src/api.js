/**
 * API Service for Full Stack Integration
 * Communicates with the Express & Sequelize backend
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function handleResponse(response) {
  if (!response.ok) {
    let errorMsg = `HTTP Error ${response.status}: ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData.error) errorMsg = errorData.error;
    } catch {
      // ignore
    }
    throw new Error(errorMsg);
  }
  return response.json();
}

export async function getProducts(params = {}) {
  const query = new URLSearchParams();
  if (params.search) query.append('search', params.search);
  if (params.category && params.category !== 'ALL') query.append('category', params.category);
  if (params.stockLevel && params.stockLevel !== 'ALL') query.append('stockLevel', params.stockLevel);
  if (params.sortBy) query.append('sortBy', params.sortBy);

  const url = `${API_BASE}/products?${query.toString()}`;
  const res = await fetch(url);
  return handleResponse(res);
}

export async function getInventoryStats() {
  const res = await fetch(`${API_BASE}/products/stats`);
  return handleResponse(res);
}

export async function createProduct(payload) {
  const res = await fetch(`${API_BASE}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return handleResponse(res);
}

export async function updateProduct(id, payload) {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return handleResponse(res);
}

export async function deleteProduct(id) {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'DELETE'
  });
  return handleResponse(res);
}

