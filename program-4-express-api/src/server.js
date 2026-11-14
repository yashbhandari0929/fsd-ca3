/**
 * Program 4: Express.js Enterprise REST API with JWT, bcrypt, and Middleware
 * Student: Yash Prasanna Bhandari (Roll No: 08, Div: D11ADA, Sem V)
 * Course: Full Stack Development (FSD) CA3
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';
import { requestLogger } from './middleware/logger.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;

// Global Middleware
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// Root Documentation & Status Endpoint
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>ApexInventory | Express REST API</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0f172a; color: #f8fafc; padding: 2rem; margin: 0; }
        .container { max-width: 900px; margin: 0 auto; background: #1e293b; border-radius: 12px; padding: 2rem; border: 1px solid #334155; }
        h1 { color: #38bdf8; margin-top: 0; }
        .student-box { background: #0b1120; padding: 1rem 1.25rem; border-radius: 8px; border-left: 4px solid #2563eb; margin: 1.5rem 0; }
        table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
        th, td { text-align: left; padding: 0.75rem; border-bottom: 1px solid #334155; font-size: 0.875rem; }
        th { color: #94a3b8; text-transform: uppercase; font-size: 0.75rem; }
        code { background: #0b1120; color: #38bdf8; padding: 0.2rem 0.4rem; border-radius: 4px; font-family: monospace; }
        .badge-lock { background: #7c2d12; color: #fdba74; padding: 0.15rem 0.45rem; border-radius: 4px; font-size: 0.7rem; font-weight: bold; }
        .badge-open { background: #064e3b; color: #6ee7b7; padding: 0.15rem 0.45rem; border-radius: 4px; font-size: 0.7rem; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>ApexInventory Express REST API v1.0</h1>
        <p>Enterprise RESTful backend service with JWT authentication, bcrypt password hashing, and custom middleware.</p>
        
        <div class="student-box">
          <strong>Student:</strong> Yash Prasanna Bhandari &bull; 
          <strong>Roll:</strong> 08 &bull; 
          <strong>Div:</strong> D11ADA &bull; 
          <strong>Sem:</strong> V &bull; 
          <strong>Course Outcome:</strong> CO5
        </div>

        <h3>API Endpoints Reference</h3>
        <table>
          <thead>
            <tr>
              <th>Method</th>
              <th>Endpoint</th>
              <th>Auth Level</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr><td><code>POST</code></td><td>/api/auth/register</td><td><span class="badge-open">PUBLIC</span></td><td>User registration with bcrypt password hashing</td></tr>
            <tr><td><code>POST</code></td><td>/api/auth/login</td><td><span class="badge-open">PUBLIC</span></td><td>User login returning signed JWT access token</td></tr>
            <tr><td><code>GET</code></td><td>/api/auth/profile</td><td><span class="badge-lock">JWT REQUIRED</span></td><td>Retrieve authenticated user payload</td></tr>
            <tr><td><code>GET</code></td><td>/api/inventory</td><td><span class="badge-open">PUBLIC</span></td><td>Catalog list with search, filter, and sort</td></tr>
            <tr><td><code>GET</code></td><td>/api/inventory/stats</td><td><span class="badge-open">PUBLIC</span></td><td>Real-time inventory valuation metrics</td></tr>
            <tr><td><code>GET</code></td><td>/api/inventory/:id</td><td><span class="badge-open">PUBLIC</span></td><td>Fetch single SKU product record</td></tr>
            <tr><td><code>POST</code></td><td>/api/inventory</td><td><span class="badge-lock">JWT REQUIRED</span></td><td>Create new product (validated)</td></tr>
            <tr><td><code>PUT</code></td><td>/api/inventory/:id</td><td><span class="badge-lock">JWT REQUIRED</span></td><td>Update existing product (validated)</td></tr>
            <tr><td><code>DELETE</code></td><td>/api/inventory/:id</td><td><span class="badge-lock">JWT REQUIRED</span></td><td>Remove product record</td></tr>
          </tbody>
        </table>
      </div>
    </body>
    </html>
  `);
});

// Mount Feature Routers
app.use('/api/auth', authRoutes);
app.use('/api/inventory', inventoryRoutes);

// Fallback 404 Route
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Endpoint '${req.method} ${req.originalUrl}' not found on this server.`
  });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

// Start HTTP Listener
const server = app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(` ApexInventory Express REST API Server Active`);
  console.log(` Candidate: Yash Prasanna Bhandari (Roll 08, D11ADA)`);
  console.log(` API Endpoint: http://localhost:${PORT}`);
  console.log(`=======================================================`);
});

export default app;

