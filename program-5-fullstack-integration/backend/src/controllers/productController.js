import { Op } from 'sequelize';
import { Product } from '../models/index.js';

export async function getAllProducts(req, res) {
  try {
    const { search, category, stockLevel, sortBy } = req.query;
    const where = {};

    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { sku: { [Op.like]: `%${search}%` } },
        { supplier: { [Op.like]: `%${search}%` } }
      ];
    }

    if (category && category !== 'ALL') {
      where.category = category;
    }

    let order = [['createdAt', 'DESC']];
    if (sortBy === 'price_desc') order = [['unitPrice', 'DESC']];
    if (sortBy === 'price_asc') order = [['unitPrice', 'ASC']];
    if (sortBy === 'name_asc') order = [['name', 'ASC']];
    if (sortBy === 'name_desc') order = [['name', 'DESC']];
    if (sortBy === 'qty_desc') order = [['quantity', 'DESC']];
    if (sortBy === 'qty_asc') order = [['quantity', 'ASC']];

    const products = await Product.findAll({ where, order });

    // In-memory stock level filter if requested
    let result = products;
    if (stockLevel === 'IN_STOCK') {
      result = products.filter(p => p.quantity > p.minThreshold);
    } else if (stockLevel === 'LOW_STOCK') {
      result = products.filter(p => p.quantity > 0 && p.quantity <= p.minThreshold);
    } else if (stockLevel === 'OUT_OF_STOCK') {
      result = products.filter(p => p.quantity === 0);
    }

    return res.status(200).json({
      success: true,
      count: result.length,
      data: result
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function getProductById(req, res) {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ success: false, error: `Product ID #${id} not found.` });
    }

    return res.status(200).json({ success: true, data: product });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function createProduct(req, res) {
  try {
    const { name, sku, category, quantity, unitPrice, supplier, minThreshold } = req.body;

    const existing = await Product.findOne({ where: { sku: sku.trim().toUpperCase() } });
    if (existing) {
      return res.status(409).json({ success: false, error: `SKU '${sku}' already exists in database.` });
    }

    const product = await Product.create({
      name: name.trim(),
      sku: sku.trim().toUpperCase(),
      category: category || 'General',
      quantity: Number(quantity) || 0,
      unitPrice: Number(parseFloat(unitPrice).toFixed(2)),
      supplier: supplier || 'Standard Vendor',
      minThreshold: Number(minThreshold) || 5
    });

    return res.status(201).json({
      success: true,
      message: 'Product persisted to database successfully',
      data: product
    });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
}

export async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ success: false, error: `Product ID #${id} not found.` });
    }

    await product.update({
      ...req.body,
      sku: req.body.sku ? req.body.sku.trim().toUpperCase() : product.sku
    });

    return res.status(200).json({
      success: true,
      message: 'Product updated in database successfully',
      data: product
    });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
}

export async function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ success: false, error: `Product ID #${id} not found.` });
    }

    await product.destroy();

    return res.status(200).json({
      success: true,
      message: `Product #${id} (${product.sku}) deleted successfully from database.`
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function getStats(req, res) {
  try {
    const products = await Product.findAll();

    const totalValuation = products.reduce((sum, p) => sum + (Number(p.quantity) * Number(p.unitPrice)), 0);
    const lowStock = products.filter(p => p.quantity > 0 && p.quantity <= p.minThreshold);
    const outOfStock = products.filter(p => p.quantity === 0);

    return res.status(200).json({
      success: true,
      stats: {
        totalProducts: products.length,
        totalQuantity: products.reduce((sum, p) => sum + p.quantity, 0),
        totalValuation: Number(totalValuation.toFixed(2)),
        lowStockCount: lowStock.length,
        outOfStockCount: outOfStock.length,
        categories: Array.from(new Set(products.map(p => p.category)))
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

