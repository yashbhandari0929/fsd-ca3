import express from 'express';
import { register, login, getProfile } from '../controllers/authController.js';
import { validateRegistration, validateLogin } from '../middleware/validator.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', validateRegistration, register);
router.post('/login', validateLogin, login);
router.get('/profile', authenticateToken, getProfile);

export default router;

