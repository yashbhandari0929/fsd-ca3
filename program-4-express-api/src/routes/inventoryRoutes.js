import express from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getInventoryStats
} from '../controllers/inventoryController.js';
import { validateProductPayload } from '../middleware/validator.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public Routes
router.get('/', getAllProducts);
router.get('/stats', getInventoryStats);
router.get('/:id', getProductById);

// Protected Routes (Require Valid JWT Token)
router.post('/', authenticateToken, validateProductPayload, createProduct);
router.put('/:id', authenticateToken, validateProductPayload, updateProduct);
router.delete('/:id', authenticateToken, deleteProduct);

export default router;

