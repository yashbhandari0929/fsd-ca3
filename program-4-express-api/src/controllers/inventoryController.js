// Initial Inventory Records for Program 4
let products = [
  {
    id: "PRD-4001",
    name: "Dell UltraSharp 27\" 4K Monitor",
    sku: "MON-DEL-4K",
    category: "Electronics",
    quantity: 18,
    unitPrice: 549.99,
    supplier: "Dell Direct India",
    minThreshold: 5,
    lastUpdated: "2026-11-10T10:30:00Z"
  },
  {
    id: "PRD-4002",
    name: "Logitech MX Master 3S Mouse",
    sku: "ACC-LOG-MX3S",
    category: "Accessories",
    quantity: 42,
    unitPrice: 99.50,
    supplier: "Logitech Official",
    minThreshold: 10,
    lastUpdated: "2026-11-11T14:15:00Z"
  },
  {
    id: "PRD-4003",
    name: "Apple MacBook Pro 14\" M3 Pro",
    sku: "LAP-APP-M3P",
    category: "Computers",
    quantity: 4,
    unitPrice: 1999.00,
    supplier: "Apple Distribution",
    minThreshold: 5,
    lastUpdated: "2026-11-12T09:00:00Z"
  },
  {
    id: "PRD-4004",
    name: "Keychron K2 Mechanical Keyboard",
    sku: "KEY-KCH-K2",
    category: "Accessories",
    quantity: 15,
    unitPrice: 89.99,
    supplier: "Keychron Global",
    minThreshold: 8,
    lastUpdated: "2026-11-12T16:45:00Z"
  },
  {
    id: "PRD-4005",
    name: "Cisco Catalyst 1000 Gigabit Switch",
    sku: "NET-CIS-C10",
    category: "Networking",
    quantity: 0,
    unitPrice: 620.00,
    supplier: "Cisco Systems",
    minThreshold: 3,
    lastUpdated: "2026-11-13T11:20:00Z"
  }
];

export function getAllProducts(req, res) {
  const { search, category, stockLevel, sortBy } = req.query;

  let result = [...products];

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.supplier.toLowerCase().includes(q)
    );
  }

  if (category && category !== 'ALL') {
    result = result.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  }

  if (stockLevel === 'IN_STOCK') {
    result = result.filter((p) => p.quantity > p.minThreshold);
  } else if (stockLevel === 'LOW_STOCK') {
    result = result.filter((p) => p.quantity > 0 && p.quantity <= p.minThreshold);
  } else if (stockLevel === 'OUT_OF_STOCK') {
    result = result.filter((p) => p.quantity === 0);
  }

  if (sortBy === 'price_desc') {
    result.sort((a, b) => b.unitPrice - a.unitPrice);
  } else if (sortBy === 'price_asc') {
    result.sort((a, b) => a.unitPrice - b.unitPrice);
  } else if (sortBy === 'name_desc') {
    result.sort((a, b) => b.name.localeCompare(a.name));
  } else {
    result.sort((a, b) => a.name.localeCompare(b.name));
  }

  return res.status(200).json({
    success: true,
    count: result.length,
    totalRecords: products.length,
    data: result
  });
}

export function getProductById(req, res) {
  const { id } = req.params;
  const product = products.find((p) => p.id === id || p.sku.toUpperCase() === id.toUpperCase());

  if (!product) {
    return res.status(404).json({
      success: false,
      error: `Product with identifier '${id}' not found.`
    });
  }

  return res.status(200).json({
    success: true,
    data: product
  });
}

export function createProduct(req, res) {
  const { name, sku, category, quantity, unitPrice, supplier, minThreshold } = req.body;
  const upperSku = sku.trim().toUpperCase();

  const exists = products.find((p) => p.sku.toUpperCase() === upperSku);
  if (exists) {
    return res.status(409).json({
      success: false,
      error: `SKU '${upperSku}' already exists in inventory.`
    });
  }

  const newProduct = {
    id: 'PRD-' + Date.now().toString().slice(-6),
    name: name.trim(),
    sku: upperSku,
    category: category || 'General',
    quantity: Number(quantity) || 0,
    unitPrice: Number(parseFloat(unitPrice).toFixed(2)),
    supplier: supplier || 'Unassigned',
    minThreshold: Number(minThreshold) || 5,
    createdBy: req.user ? req.user.email : 'System',
    lastUpdated: new Date().toISOString()
  };

  products.unshift(newProduct);

  return res.status(201).json({
    success: true,
    message: 'Product created successfully',
    data: newProduct
  });
}

export function updateProduct(req, res) {
  const { id } = req.params;
  const index = products.findIndex((p) => p.id === id || p.sku.toUpperCase() === id.toUpperCase());

  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: `Product with identifier '${id}' not found.`
    });
  }

  const existing = products[index];
  const updated = {
    ...existing,
    ...req.body,
    id: existing.id, // prevent changing ID
    quantity: req.body.quantity !== undefined ? Number(req.body.quantity) : existing.quantity,
    unitPrice: req.body.unitPrice !== undefined ? Number(parseFloat(req.body.unitPrice).toFixed(2)) : existing.unitPrice,
    minThreshold: req.body.minThreshold !== undefined ? Number(req.body.minThreshold) : existing.minThreshold,
    updatedBy: req.user ? req.user.email : 'System',
    lastUpdated: new Date().toISOString()
  };

  products[index] = updated;

  return res.status(200).json({
    success: true,
    message: 'Product updated successfully',
    data: updated
  });
}

export function deleteProduct(req, res) {
  const { id } = req.params;
  const index = products.findIndex((p) => p.id === id || p.sku.toUpperCase() === id.toUpperCase());

  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: `Product with identifier '${id}' not found.`
    });
  }

  const [removed] = products.splice(index, 1);

  return res.status(200).json({
    success: true,
    message: `Product '${removed.sku}' deleted successfully`,
    data: removed
  });
}

export function getInventoryStats(req, res) {
  const totalValuation = products.reduce((sum, p) => sum + p.quantity * p.unitPrice, 0);
  const lowStock = products.filter((p) => p.quantity > 0 && p.quantity <= p.minThreshold);
  const outOfStock = products.filter((p) => p.quantity === 0);

  return res.status(200).json({
    success: true,
    stats: {
      totalProducts: products.length,
      totalQuantity: products.reduce((sum, p) => sum + p.quantity, 0),
      totalValuation: Number(totalValuation.toFixed(2)),
      lowStockCount: lowStock.length,
      outOfStockCount: outOfStock.length,
      categories: Array.from(new Set(products.map((p) => p.category)))
    }
  });
}

