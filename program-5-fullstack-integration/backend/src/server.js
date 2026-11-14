/**
 * Program 5: Full Stack Express Backend with Sequelize ORM
 * Student: Yash Prasanna Bhandari (Roll No: 08, Div: D11ADA, Sem V)
 * Course: Full Stack Development (FSD) CA3
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize } from './models/index.js';
import productRoutes from './routes/productRoutes.js';
import { seedDatabase } from './seeders/seed.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || '*';

// Configure CORS
app.use(cors({
  origin: CLIENT_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`[FULLSTACK_BACKEND] ${new Date().toISOString()} | ${req.method} ${req.originalUrl}`);
  next();
});

// Root Documentation Route
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    service: 'ApexInventory Full Stack Backend (Sequelize ORM)',
    candidate: 'Yash Prasanna Bhandari (Roll 08, D11ADA)',
    courseOutcome: 'CO6: Full Stack Integration and Relational Database Persistence',
    endpoints: {
      products: '/api/products',
      stats: '/api/products/stats'
    }
  });
});

// Mount Routes
app.use('/api/products', productRoutes);

// Database Sync and Server Boot
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('[SEQUELIZE] Database connection authenticated successfully.');
    
    // Sync models
    await sequelize.sync();
    console.log('[SEQUELIZE] Model schemas synced.');

    // Auto-seed if empty
    const { Product } = await import('./models/index.js');
    const count = await Product.count();
    if (count === 0) {
      console.log('[SEQUELIZE] Database empty, seeding initial records...');
      await seedDatabase();
    }

    app.listen(PORT, () => {
      console.log(`=======================================================`);
      console.log(` ApexInventory Full Stack Backend Server Active`);
      console.log(` Listening on: http://localhost:${PORT}`);
      console.log(` Candidate: Yash Prasanna Bhandari (Roll 08, D11ADA)`);
      console.log(` Database Dialect: ${sequelize.getDialect()}`);
      console.log(`=======================================================`);
    });
  } catch (err) {
    console.error('[ERROR] Unable to boot backend server:', err);
    process.exit(1);
  }
}

startServer();

export default app;

