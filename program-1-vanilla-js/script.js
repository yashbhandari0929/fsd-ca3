/**
 * Program 1: Browser-Based Enterprise Inventory Management
 * Student: Yash Prasanna Bhandari (Roll No: 08, Div: D11ADA, Sem V)
 * Course: Full Stack Development (FSD) CA3
 */

// Application State
const STORAGE_KEY = 'apex_inventory_store_v1';
let inventory = [];
let editingProductId = null;

// DOM Elements
const inventoryTableBody = document.getElementById('inventoryTableBody');
const emptyState = document.getElementById('emptyState');
const recordCounter = document.getElementById('recordCounter');

// Stats Elements
const statTotalItems = document.getElementById('statTotalItems');
const statTotalValue = document.getElementById('statTotalValue');
const statLowStock = document.getElementById('statLowStock');
const statOutOfStock = document.getElementById('statOutOfStock');
const statCategoriesCount = document.getElementById('statCategoriesCount');

// Toolbar Elements
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const stockFilter = document.getElementById('stockFilter');
const sortBy = document.getElementById('sortBy');

// Buttons
const btnOpenAddModal = document.getElementById('btnOpenAddModal');
const btnFetchData = document.getElementById('btnFetchData');
const btnSimulatePost = document.getElementById('btnSimulatePost');
const btnExportJson = document.getElementById('btnExportJson');
const btnResetData = document.getElementById('btnResetData');
const btnEmptyReset = document.getElementById('btnEmptyReset');

// Modal Elements
const productModal = document.getElementById('productModal');
const modalTitle = document.getElementById('modalTitle');
const productForm = document.getElementById('productForm');
const btnModalClose = document.getElementById('btnModalClose');
const btnModalCancel = document.getElementById('btnModalCancel');

// Form Input Elements
const inputId = document.getElementById('productId');
const inputName = document.getElementById('productName');
const inputSku = document.getElementById('productSku');
const inputCategory = document.getElementById('productCategory');
const inputQty = document.getElementById('productQuantity');
const inputPrice = document.getElementById('productUnitPrice');
const inputSupplier = document.getElementById('productSupplier');
const inputThreshold = document.getElementById('productThreshold');

// Inspector Elements
const inspectorMethodBadge = document.getElementById('inspectorMethodBadge');
const inspectorStatusText = document.getElementById('inspectorStatusText');
const inspectorStatusCode = document.getElementById('inspectorStatusCode');
const inspectorRequest = document.getElementById('inspectorRequest');
const inspectorResponse = document.getElementById('inspectorResponse');

// Toast Container
const toastContainer = document.getElementById('toastContainer');

// ==========================================
// Initialization
// ==========================================
document.addEventListener('DOMContentLoaded', async () => {
  setupEventListeners();
  loadFromStorage();
  
  // If localStorage empty, automatically fetch sample data
  if (!inventory || inventory.length === 0) {
    await fetchSampleData();
  } else {
    populateCategoryDropdown();
    renderTable();
    updateStatistics();
  }
});

function setupEventListeners() {
  // Modal handlers
  btnOpenAddModal.addEventListener('click', () => openModal());
  btnModalClose.addEventListener('click', closeModal);
  btnModalCancel.addEventListener('click', closeModal);
  productForm.addEventListener('submit', handleFormSubmit);

  // Search & Filtering handlers
  searchInput.addEventListener('input', () => renderTable());
  categoryFilter.addEventListener('change', () => renderTable());
  stockFilter.addEventListener('change', () => renderTable());
  sortBy.addEventListener('change', () => renderTable());

  // Action Buttons
  btnFetchData.addEventListener('click', () => fetchSampleData(true));
  btnSimulatePost.addEventListener('click', simulateCloudSync);
  btnExportJson.addEventListener('click', exportInventoryToJson);
  btnResetData.addEventListener('click', resetAllData);
  btnEmptyReset.addEventListener('click', clearFilters);

  // Close modal when clicking on backdrop
  productModal.addEventListener('click', (e) => {
    if (e.target === productModal) closeModal();
  });
}

// ==========================================
// Storage Operations
// ==========================================
function saveToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(inventory));
  } catch (err) {
    console.error('Failed to write to localStorage:', err);
    showToast('Failed to save to local storage: Storage quota exceeded', 'error');
  }
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    inventory = raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed to parse localStorage:', err);
    inventory = [];
  }
}

// ==========================================
// Fetch API & HTTP Demonstrations (GET / POST)
// ==========================================
/**
 * Demonstrates GET request with Fetch API & async/await
 */
async function fetchSampleData(isUserInitiated = false) {
  inspectorMethodBadge.textContent = 'GET';
  inspectorMethodBadge.className = 'badge badge-info';
  inspectorStatusText.textContent = 'Executing GET ./sample-data.json ...';
  
  const startTime = performance.now();
  const requestInfo = {
    method: 'GET',
    url: './sample-data.json',
    headers: {
      'Accept': 'application/json',
      'X-Requested-By': 'ApexInventory-VanillaJS'
    },
    timestamp: new Date().toISOString()
  };
  inspectorRequest.textContent = JSON.stringify(requestInfo, null, 2);

  try {
    const response = await fetch('./sample-data.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    const duration = (performance.now() - startTime).toFixed(1);

    inventory = data;
    saveToStorage();
    populateCategoryDropdown();
    renderTable();
    updateStatistics();

    // Update Inspector
    inspectorStatusCode.textContent = response.status;
    inspectorStatusText.textContent = `200 OK (${duration}ms) - Retrieved ${data.length} records`;
    inspectorResponse.textContent = JSON.stringify(data, null, 2);

    if (isUserInitiated) {
      showToast(`Successfully loaded ${data.length} sample products via Fetch API`, 'success');
    }
  } catch (err) {
    console.error('Fetch GET error:', err);
    inspectorStatusCode.textContent = 'ERR';
    inspectorStatusText.textContent = `Fetch Failed: ${err.message}`;
    inspectorResponse.textContent = JSON.stringify({ error: err.message }, null, 2);
    showToast(`Fetch API Error: ${err.message}`, 'error');
  }
}

/**
 * Demonstrates POST request simulation with Fetch API & async/await
 */
async function simulateCloudSync() {
  if (inventory.length === 0) {
    showToast('Inventory is empty. Add products before syncing.', 'error');
    return;
  }

  inspectorMethodBadge.textContent = 'POST';
  inspectorMethodBadge.className = 'badge badge-info';
  inspectorStatusText.textContent = 'Simulating POST to https://api.apex-inventory.local/v1/sync ...';

  const payload = {
    batchId: 'BATCH-' + Date.now(),
    studentRoll: '08',
    submittedBy: 'Yash Prasanna Bhandari',
    division: 'D11ADA',
    itemCount: inventory.length,
    totalValuation: inventory.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0),
    items: inventory,
    syncTimestamp: new Date().toISOString()
  };

  const requestInfo = {
    method: 'POST',
    endpoint: '/api/v1/sync/inventory',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer sim_jwt_token_fsd_ca3'
    },
    body: payload
  };

  inspectorRequest.textContent = JSON.stringify(requestInfo, null, 2);

  try {
    // Simulate network latency with async promise
    await new Promise(resolve => setTimeout(resolve, 450));

    const simulatedResponse = {
      status: 201,
      message: 'Cloud database synchronized successfully',
      batchId: payload.batchId,
      processedCount: payload.itemCount,
      valuationLogged: payload.totalValuation,
      auditRef: 'AUDIT-' + Math.floor(Math.random() * 900000 + 100000),
      timestamp: new Date().toISOString()
    };

    inspectorStatusCode.textContent = '201 Created';
    inspectorStatusText.textContent = `201 Created - Synchronized ${payload.itemCount} items`;
    inspectorResponse.textContent = JSON.stringify(simulatedResponse, null, 2);

    showToast('POST Sync Successful: Batch ' + payload.batchId + ' committed', 'success');
  } catch (err) {
    showToast('POST Sync simulation error', 'error');
  }
}

// ==========================================
// Rendering & DOM Manipulation
// ==========================================
function renderTable() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const selectedCat = categoryFilter.value;
  const selectedStock = stockFilter.value;
  const sortOption = sortBy.value;

  // Filter products
  let filtered = inventory.filter(item => {
    // Search
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm) ||
      item.sku.toLowerCase().includes(searchTerm) ||
      item.supplier.toLowerCase().includes(searchTerm);

    // Category
    const matchesCat = (selectedCat === 'ALL') || (item.category === selectedCat);

    // Stock level
    let matchesStock = true;
    if (selectedStock === 'IN_STOCK') {
      matchesStock = item.quantity > item.minThreshold;
    } else if (selectedStock === 'LOW_STOCK') {
      matchesStock = item.quantity > 0 && item.quantity <= item.minThreshold;
    } else if (selectedStock === 'OUT_OF_STOCK') {
      matchesStock = item.quantity === 0;
    }

    return matchesSearch && matchesCat && matchesStock;
  });

  // Sort products
  filtered.sort((a, b) => {
    switch (sortOption) {
      case 'name_asc': return a.name.localeCompare(b.name);
      case 'name_desc': return b.name.localeCompare(a.name);
      case 'price_asc': return a.unitPrice - b.unitPrice;
      case 'price_desc': return b.unitPrice - a.unitPrice;
      case 'qty_asc': return a.quantity - b.quantity;
      case 'qty_desc': return b.quantity - a.quantity;
      default: return 0;
    }
  });

  // Update counters
  recordCounter.textContent = `Showing ${filtered.length} of ${inventory.length} items`;

  // Render rows
  inventoryTableBody.innerHTML = '';
  if (filtered.length === 0) {
    emptyState.classList.remove('hidden');
    return;
  }
  emptyState.classList.add('hidden');

  filtered.forEach(item => {
    const tr = document.createElement('tr');

    // Determine status badge
    let badgeClass = 'badge-green';
    let badgeLabel = 'In Stock';
    if (item.quantity === 0) {
      badgeClass = 'badge-red';
      badgeLabel = 'Out of Stock';
    } else if (item.quantity <= item.minThreshold) {
      badgeClass = 'badge-amber';
      badgeLabel = `Low (${item.quantity}/${item.minThreshold})`;
    }

    const totalVal = (item.quantity * item.unitPrice).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    });

    const unitPriceFormatted = item.unitPrice.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    });

    tr.innerHTML = `
      <td><span class="sku-code">${escapeHtml(item.sku)}</span></td>
      <td>
        <div class="product-name-cell">${escapeHtml(item.name)}</div>
        <small style="color:#64748b; font-size: 0.75rem;">ID: ${escapeHtml(item.id)}</small>
      </td>
      <td><span class="category-pill">${escapeHtml(item.category)}</span></td>
      <td>${escapeHtml(item.supplier)}</td>
      <td class="text-right font-mono">${unitPriceFormatted}</td>
      <td class="text-center font-bold">${item.quantity}</td>
      <td class="text-right font-mono font-bold">${totalVal}</td>
      <td class="text-center">
        <span class="legend-badge ${badgeClass}"><span class="dot"></span> ${badgeLabel}</span>
      </td>
      <td class="text-center">
        <div class="action-btns">
          <button class="btn-icon" title="Inspect Item JSON" onclick="inspectItem('${item.id}')">
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
          </button>
          <button class="btn-icon" title="Edit Item" onclick="editProduct('${item.id}')">
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
          </button>
          <button class="btn-icon delete" title="Delete Item" onclick="deleteProduct('${item.id}')">
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </button>
        </div>
      </td>
    `;

    inventoryTableBody.appendChild(tr);
  });
}

function updateStatistics() {
  const totalItems = inventory.length;
  const totalValuation = inventory.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const lowStockCount = inventory.filter(item => item.quantity > 0 && item.quantity <= item.minThreshold).length;
  const outOfStockCount = inventory.filter(item => item.quantity === 0).length;

  const uniqueCats = new Set(inventory.map(i => i.category)).size;

  statTotalItems.textContent = totalItems;
  statTotalValue.textContent = totalValuation.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD'
  });
  statLowStock.textContent = lowStockCount;
  statOutOfStock.textContent = outOfStockCount;
  statCategoriesCount.textContent = `${uniqueCats} Active Categories`;
}

function populateCategoryDropdown() {
  const currentVal = categoryFilter.value;
  const categories = Array.from(new Set(inventory.map(i => i.category))).filter(Boolean).sort();

  categoryFilter.innerHTML = '<option value="ALL">All Categories</option>';
  categories.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    categoryFilter.appendChild(opt);
  });

  if (categories.includes(currentVal)) {
    categoryFilter.value = currentVal;
  }
}

// ==========================================
// Modal & Form Handling
// ==========================================
function openModal(item = null) {
  clearValidationErrors();
  if (item) {
    editingProductId = item.id;
    modalTitle.textContent = `Update Product: ${item.sku}`;
    inputId.value = item.id;
    inputName.value = item.name;
    inputSku.value = item.sku;
    inputCategory.value = item.category;
    inputQty.value = item.quantity;
    inputPrice.value = item.unitPrice;
    inputSupplier.value = item.supplier;
    inputThreshold.value = item.minThreshold;
  } else {
    editingProductId = null;
    modalTitle.textContent = 'Register New Inventory Product';
    productForm.reset();
    inputId.value = '';
    inputThreshold.value = 5;
  }
  productModal.classList.remove('hidden');
  inputName.focus();
}

function closeModal() {
  productModal.classList.add('hidden');
  editingProductId = null;
  clearValidationErrors();
}

function clearValidationErrors() {
  document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');
  document.querySelectorAll('.input-invalid').forEach(el => el.classList.remove('input-invalid'));
}

function validateForm() {
  clearValidationErrors();
  let isValid = true;

  // Name
  if (!inputName.value.trim() || inputName.value.trim().length < 3) {
    document.getElementById('nameError').textContent = 'Product name must be at least 3 characters.';
    inputName.classList.add('input-invalid');
    isValid = false;
  }

  // SKU
  const skuRegex = /^[A-Z0-9\-_]{3,20}$/i;
  const trimmedSku = inputSku.value.trim().toUpperCase();
  if (!skuRegex.test(trimmedSku)) {
    document.getElementById('skuError').textContent = 'Valid alphanumeric SKU required (3-20 chars).';
    inputSku.classList.add('input-invalid');
    isValid = false;
  } else {
    // Check uniqueness
    const duplicate = inventory.find(i => i.sku.toUpperCase() === trimmedSku && i.id !== editingProductId);
    if (duplicate) {
      document.getElementById('skuError').textContent = 'This SKU is already assigned to another item.';
      inputSku.classList.add('input-invalid');
      isValid = false;
    }
  }

  // Category
  if (!inputCategory.value) {
    document.getElementById('categoryError').textContent = 'Please select a valid category.';
    inputCategory.classList.add('input-invalid');
    isValid = false;
  }

  // Quantity
  const qty = parseInt(inputQty.value, 10);
  if (isNaN(qty) || qty < 0) {
    document.getElementById('qtyError').textContent = 'Quantity must be zero or a positive integer.';
    inputQty.classList.add('input-invalid');
    isValid = false;
  }

  // Unit Price
  const price = parseFloat(inputPrice.value);
  if (isNaN(price) || price <= 0) {
    document.getElementById('priceError').textContent = 'Unit price must be greater than $0.00.';
    inputPrice.classList.add('input-invalid');
    isValid = false;
  }

  // Supplier
  if (!inputSupplier.value.trim()) {
    document.getElementById('supplierError').textContent = 'Supplier / Vendor name is required.';
    inputSupplier.classList.add('input-invalid');
    isValid = false;
  }

  // Threshold
  const thresh = parseInt(inputThreshold.value, 10);
  if (isNaN(thresh) || thresh < 1) {
    document.getElementById('thresholdError').textContent = 'Threshold must be at least 1 unit.';
    inputThreshold.classList.add('input-invalid');
    isValid = false;
  }

  return isValid;
}

function handleFormSubmit(e) {
  e.preventDefault();
  if (!validateForm()) return;

  const productData = {
    id: editingProductId || 'PRD-' + (Date.now().toString().slice(-6)),
    name: inputName.value.trim(),
    sku: inputSku.value.trim().toUpperCase(),
    category: inputCategory.value,
    quantity: parseInt(inputQty.value, 10),
    unitPrice: parseFloat(parseFloat(inputPrice.value).toFixed(2)),
    supplier: inputSupplier.value.trim(),
    minThreshold: parseInt(inputThreshold.value, 10),
    lastUpdated: new Date().toISOString()
  };

  if (editingProductId) {
    // Update
    const idx = inventory.findIndex(i => i.id === editingProductId);
    if (idx !== -1) {
      inventory[idx] = productData;
      showToast(`Updated "${productData.name}"`, 'success');
    }
  } else {
    // Add new
    inventory.unshift(productData);
    showToast(`Added new item "${productData.name}"`, 'success');
  }

  saveToStorage();
  populateCategoryDropdown();
  renderTable();
  updateStatistics();
  closeModal();

  // Highlight in inspector
  inspectorMethodBadge.textContent = editingProductId ? 'PUT' : 'POST';
  inspectorStatusText.textContent = `Client mutation committed for ID ${productData.id}`;
  inspectorRequest.textContent = JSON.stringify({ action: editingProductId ? 'UPDATE' : 'CREATE', product: productData }, null, 2);
  inspectorResponse.textContent = JSON.stringify({ success: true, updatedRecord: productData }, null, 2);
}

// ==========================================
// Item Actions (Edit / Delete / Inspect)
// ==========================================
window.editProduct = function(id) {
  const item = inventory.find(i => i.id === id);
  if (item) {
    openModal(item);
  }
};

window.deleteProduct = function(id) {
  const item = inventory.find(i => i.id === id);
  if (!item) return;

  if (confirm(`Are you sure you want to delete "${item.name}" (${item.sku})?`)) {
    inventory = inventory.filter(i => i.id !== id);
    saveToStorage();
    populateCategoryDropdown();
    renderTable();
    updateStatistics();
    showToast(`Deleted product ${item.sku}`, 'info');

    inspectorMethodBadge.textContent = 'DELETE';
    inspectorStatusText.textContent = `Deleted product ID: ${id}`;
    inspectorRequest.textContent = JSON.stringify({ action: 'DELETE', id, sku: item.sku }, null, 2);
    inspectorResponse.textContent = JSON.stringify({ success: true, deletedId: id }, null, 2);
  }
};

window.inspectItem = function(id) {
  const item = inventory.find(i => i.id === id);
  if (!item) return;
  inspectorMethodBadge.textContent = 'INSPECT';
  inspectorStatusText.textContent = `Inspecting item ${item.sku}`;
  inspectorRequest.textContent = `GET /api/inventory/${item.id}`;
  inspectorResponse.textContent = JSON.stringify(item, null, 2);
  showToast(`Loaded details for ${item.sku} in Inspector`, 'info');
};

function clearFilters() {
  searchInput.value = '';
  categoryFilter.value = 'ALL';
  stockFilter.value = 'ALL';
  sortBy.value = 'name_asc';
  renderTable();
}

function resetAllData() {
  if (confirm('Reset inventory? This will clear local changes and reload default sample data.')) {
    localStorage.removeItem(STORAGE_KEY);
    fetchSampleData(true);
  }
}

function exportInventoryToJson() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(inventory, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `apex_inventory_${Date.now()}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  showToast('Exported inventory JSON file', 'success');
}

// ==========================================
// Toast Notification System
// ==========================================
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  let icon = 'ℹ️';
  if (type === 'success') icon = '✅';
  if (type === 'error') icon = '⚠️';

  toast.innerHTML = `<span>${icon}</span> <span>${escapeHtml(message)}</span>`;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 250);
  }, 3200);
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

