/**
 * Input Validation Middleware
 */

export function validateRegistration(req, res, next) {
  const { name, email, password, role } = req.body;

  if (!name || name.trim().length < 2) {
    return res.status(400).json({ success: false, error: 'Full name is required (min 2 characters)' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email.trim())) {
    return res.status(400).json({ success: false, error: 'Valid email address is required' });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({ success: false, error: 'Password must be at least 6 characters' });
  }

  next();
}

export function validateLogin(req, res, next) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Both email and password are required' });
  }
  next();
}

export function validateProductPayload(req, res, next) {
  const { name, sku, quantity, unitPrice, minThreshold } = req.body;

  // In POST, name and sku are strictly required. In PUT, they may be partial
  if (req.method === 'POST') {
    if (!name || name.trim().length < 3) {
      return res.status(400).json({ success: false, error: 'Product name must have at least 3 characters' });
    }

    if (!sku || !/^[A-Z0-9\-_]{3,20}$/i.test(sku.trim())) {
      return res.status(400).json({ success: false, error: 'Valid alphanumeric SKU required (3-20 chars)' });
    }
  }

  if (quantity !== undefined) {
    const q = Number(quantity);
    if (isNaN(q) || q < 0 || !Number.isInteger(q)) {
      return res.status(400).json({ success: false, error: 'Quantity must be a non-negative integer' });
    }
  }

  if (unitPrice !== undefined) {
    const p = Number(unitPrice);
    if (isNaN(p) || p <= 0) {
      return res.status(400).json({ success: false, error: 'Unit price must be a positive number' });
    }
  }

  if (minThreshold !== undefined) {
    const t = Number(minThreshold);
    if (isNaN(t) || t < 1 || !Number.isInteger(t)) {
      return res.status(400).json({ success: false, error: 'Minimum threshold must be an integer >= 1' });
    }
  }

  next();
}

