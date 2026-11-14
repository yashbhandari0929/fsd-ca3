import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../middleware/auth.js';

// In-memory user store for Program 4
const users = [];

// Seed an initial administrator account
(async () => {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  users.push({
    id: 'USR-ADMIN',
    name: 'Yash Prasanna Bhandari',
    email: 'yashbhandari0929@gmail.com',
    password: hashedPassword,
    role: 'ADMIN',
    createdAt: new Date().toISOString()
  });
})();

export async function register(req, res, next) {
  try {
    const { name, email, password, role } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    const existing = users.find((u) => u.email === normalizedEmail);
    if (existing) {
      return res.status(409).json({
        success: false,
        error: `User with email '${normalizedEmail}' is already registered.`
      });
    }

    // Salt and hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      id: 'USR-' + Date.now().toString().slice(-6),
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: role === 'ADMIN' ? 'ADMIN' : 'MANAGER',
      createdAt: new Date().toISOString()
    };

    users.push(newUser);

    // Sign JWT token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    return res.status(201).json({
      success: true,
      message: 'User registered successfully with hashed password',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        createdAt: newUser.createdAt
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    const user = users.find((u) => u.email === normalizedEmail);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials. User not found.'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials. Password mismatch.'
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    return res.status(200).json({
      success: true,
      message: 'Authentication successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    next(err);
  }
}

export function getProfile(req, res) {
  return res.status(200).json({
    success: true,
    user: req.user
  });
}

