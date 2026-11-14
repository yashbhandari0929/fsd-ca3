/**
 * Program 3: Native Node.js Inventory Utility
 * Student: Yash Prasanna Bhandari (Roll No: 08, Div: D11ADA, Sem V)
 * Course: Full Stack Development (FSD) CA3
 * Technologies: Node.js (http, fs, path, stream, events) - No Express
 */

import http from 'http';
import { URL } from 'url';
import { Readable } from 'stream';
import { readInventory, writeInventory } from './fileManager.js';
import { inventoryEvents } from './eventManager.js';
import { JsonToCsvStream, getAuditLogStream } from './streamExporter.js';

const PORT = process.env.PORT || 3002;

/**
 * Helper to parse incoming JSON request body
 */
function parseRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
      if (body.length > 1e6) {
        req.destroy();
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      if (!body.trim()) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(new Error('Invalid JSON format: ' + err.message));
      }
    });
    req.on('error', reject);
  });
}

/**
 * Helper to send standard JSON responses
 */
function sendJsonResponse(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(data, null, 2));
}

/**
 * Native HTTP Server
 */
const server = http.createServer(async (req, res) => {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    return res.end();
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost:' + PORT}`);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  console.log(`[HTTP] ${new Date().toISOString()} | ${method} ${pathname}`);

  try {
    // ------------------------------------------------------------------
    // ROUTE: GET / -> Interactive HTML Documentation & Live Status
    // ------------------------------------------------------------------
    if (pathname === '/' && method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>ApexInventory | Native Node.js Utility</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0f172a; color: #f8fafc; padding: 2rem; margin: 0; }
            .container { max-width: 900px; margin: 0 auto; background: #1e293b; border-radius: 12px; padding: 2rem; border: 1px solid #334155; }
            h1 { color: #38bdf8; margin-top: 0; }
            .badge { background: #2563eb; color: #fff; padding: 0.25rem 0.6rem; border-radius: 4px; font-size: 0.8rem; }
            .student-card { background: #0b1120; padding: 1rem 1.25rem; border-radius: 8px; border-left: 4px solid #10b981; margin: 1.5rem 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
            th, td { text-align: left; padding: 0.75rem; border-bottom: 1px solid #334155; font-size: 0.9rem; }
            th { color: #94a3b8; text-transform: uppercase; font-size: 0.75rem; }
            code { background: #0b1120; color: #38bdf8; padding: 0.2rem 0.4rem; border-radius: 4px; font-family: monospace; }
            a { color: #38bdf8; text-decoration: none; }
            a:hover { text-decoration: underline; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>ApexInventory Native Node.js Server</h1>
            <p>Built exclusively using Node.js core modules: <code>http</code>, <code>fs/promises</code>, <code>path</code>, <code>stream</code>, <code>events</code>.</p>
            
            <div class="student-card">
              <strong>Student:</strong> Yash Prasanna Bhandari &bull; 
              <strong>Roll:</strong> 08 &bull; 
              <strong>Div:</strong> D11ADA &bull; 
              <strong>Sem:</strong> V &bull; 
              <strong>Course Outcome:</strong> CO4
            </div>

            <h3>Available Native Endpoints</h3>
            <table>
              <thead>
                <tr>
                  <th>Method</th>
                  <th>Endpoint</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr><td><code>GET</code></td><td><a href="/api/inventory">/api/inventory</a></td><td>Retrieve full inventory (supports <code>?search=</code>, <code>?category=</code>)</td></tr>
                <tr><td><code>GET</code></td><td><a href="/api/inventory/stats">/api/inventory/stats</a></td><td>Compute valuation and stock breakdown statistics</td></tr>
                <tr><td><code>GET</code></td><td><a href="/api/inventory/export/csv">/api/inventory/export/csv</a></td><td>Stream inventory formatted as CSV via <code>Transform Stream</code></td></tr>
                <tr><td><code>GET</code></td><td><a href="/api/audit-logs">/api/audit-logs</a></td><td>Stream raw audit log records generated by <code>EventEmitter</code></td></tr>
                <tr><td><code>POST</code></td><td><code>/api/inventory</code></td><td>Create new product (validates and emits <code>item:created</code>)</td></tr>
                <tr><td><code>PUT</code></td><td><code>/api/inventory/:id</code></td><td>Update product (emits <code>item:updated</code> / <code>stock:low_alert</code>)</td></tr>
                <tr><td><code>DELETE</code></td><td><code>/api/inventory/:id</code></td><td>Remove product (emits <code>item:deleted</code>)</td></tr>
              </tbody>
            </table>
          </div>
        </body>
        </html>
      `);
    }

    // ------------------------------------------------------------------
    // ROUTE: GET /api/inventory/stats -> Inventory Statistics
    // ------------------------------------------------------------------
    if (pathname === '/api/inventory/stats' && method === 'GET') {
      const items = await readInventory();
      const totalValuation = items.reduce((sum, i) => sum + (i.quantity * i.unitPrice), 0);
      const lowStock = items.filter(i => i.quantity > 0 && i.quantity <= i.minThreshold);
      const outOfStock = items.filter(i => i.quantity === 0);

      return sendJsonResponse(res, 200, {
        success: true,
        stats: {
          totalProducts: items.length,
          totalQuantity: items.reduce((sum, i) => sum + i.quantity, 0),
          totalValuation: Number(totalValuation.toFixed(2)),
          lowStockCount: lowStock.length,
          outOfStockCount: outOfStock.length,
          categories: Array.from(new Set(items.map(i => i.category)))
        }
      });
    }

    // ------------------------------------------------------------------
    // ROUTE: GET /api/inventory/export/csv -> Streaming CSV Export via Transform Stream
    // ------------------------------------------------------------------
    if (pathname === '/api/inventory/export/csv' && method === 'GET') {
      const items = await readInventory();
      res.writeHead(200, {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="inventory-export.csv"',
        'Access-Control-Allow-Origin': '*'
      });

      const readable = Readable.from(items);
      const csvTransform = new JsonToCsvStream();

      readable.pipe(csvTransform).pipe(res);
      return;
    }

    // ------------------------------------------------------------------
    // ROUTE: GET /api/audit-logs -> Stream Audit Event Logs
    // ------------------------------------------------------------------
    if (pathname === '/api/audit-logs' && method === 'GET') {
      res.writeHead(200, {
        'Content-Type': 'text/plain; charset=utf-8',
        'Access-Control-Allow-Origin': '*'
      });
      const stream = getAuditLogStream();
      stream.pipe(res);
      return;
    }

    // ------------------------------------------------------------------
    // ROUTE: GET /api/inventory -> List all products (with filters)
    // ------------------------------------------------------------------
    if (pathname === '/api/inventory' && method === 'GET') {
      const items = await readInventory();
      const search = (parsedUrl.searchParams.get('search') || '').toLowerCase();
      const category = parsedUrl.searchParams.get('category');

      let filtered = items;
      if (search) {
        filtered = filtered.filter(i =>
          i.name.toLowerCase().includes(search) ||
          i.sku.toLowerCase().includes(search) ||
          i.supplier.toLowerCase().includes(search)
        );
      }
      if (category && category !== 'ALL') {
        filtered = filtered.filter(i => i.category.toLowerCase() === category.toLowerCase());
      }

      return sendJsonResponse(res, 200, {
        success: true,
        count: filtered.length,
        total: items.length,
        data: filtered
      });
    }

    // ------------------------------------------------------------------
    // ROUTE: GET /api/inventory/:id -> Single Product Lookup
    // ------------------------------------------------------------------
    const singleMatch = pathname.match(/^\/api\/inventory\/([A-Za-z0-9_-]+)$/);
    if (singleMatch && method === 'GET') {
      const id = singleMatch[1];
      const items = await readInventory();
      const item = items.find(i => i.id === id || i.sku.toUpperCase() === id.toUpperCase());

      if (!item) {
        return sendJsonResponse(res, 404, {
          success: false,
          error: `Product with identifier '${id}' not found`
        });
      }

      return sendJsonResponse(res, 200, { success: true, data: item });
    }

    // ------------------------------------------------------------------
    // ROUTE: POST /api/inventory -> Create New Product
    // ------------------------------------------------------------------
    if (pathname === '/api/inventory' && method === 'POST') {
      const payload = await parseRequestBody(req);

      // Validation
      if (!payload.name || payload.name.trim().length < 3) {
        return sendJsonResponse(res, 400, { success: false, error: 'Name must be at least 3 characters' });
      }
      if (!payload.sku || !/^[A-Z0-9\-_]{3,20}$/i.test(payload.sku.trim())) {
        return sendJsonResponse(res, 400, { success: false, error: 'Valid SKU required (3-20 alphanumeric chars)' });
      }
      if (payload.quantity === undefined || isNaN(Number(payload.quantity)) || Number(payload.quantity) < 0) {
        return sendJsonResponse(res, 400, { success: false, error: 'Quantity must be zero or a positive integer' });
      }
      if (payload.unitPrice === undefined || isNaN(Number(payload.unitPrice)) || Number(payload.unitPrice) <= 0) {
        return sendJsonResponse(res, 400, { success: false, error: 'Unit price must be greater than 0' });
      }

      const items = await readInventory();
      const upperSku = payload.sku.trim().toUpperCase();

      if (items.some(i => i.sku.toUpperCase() === upperSku)) {
        return sendJsonResponse(res, 409, { success: false, error: `SKU '${upperSku}' already exists` });
      }

      const newItem = {
        id: 'PRD-' + Date.now().toString().slice(-6),
        name: payload.name.trim(),
        sku: upperSku,
        category: payload.category || 'General',
        quantity: parseInt(payload.quantity, 10),
        unitPrice: Number(parseFloat(payload.unitPrice).toFixed(2)),
        supplier: payload.supplier || 'Standard Vendor',
        minThreshold: parseInt(payload.minThreshold || 5, 10),
        lastUpdated: new Date().toISOString()
      };

      items.unshift(newItem);
      await writeInventory(items);

      // Emit Event
      inventoryEvents.emit('item:created', newItem);
      if (newItem.quantity <= newItem.minThreshold) {
        inventoryEvents.emit('stock:low_alert', newItem);
      }

      return sendJsonResponse(res, 201, {
        success: true,
        message: 'Product registered successfully',
        data: newItem
      });
    }

    // ------------------------------------------------------------------
    // ROUTE: PUT /api/inventory/:id -> Update Product
    // ------------------------------------------------------------------
    if (singleMatch && method === 'PUT') {
      const id = singleMatch[1];
      const payload = await parseRequestBody(req);
      const items = await readInventory();
      const index = items.findIndex(i => i.id === id || i.sku.toUpperCase() === id.toUpperCase());

      if (index === -1) {
        return sendJsonResponse(res, 404, { success: false, error: `Product '${id}' not found` });
      }

      const oldItem = { ...items[index] };
      const updatedItem = {
        ...oldItem,
        ...payload,
        id: oldItem.id, // Immutable ID
        quantity: payload.quantity !== undefined ? parseInt(payload.quantity, 10) : oldItem.quantity,
        unitPrice: payload.unitPrice !== undefined ? Number(parseFloat(payload.unitPrice).toFixed(2)) : oldItem.unitPrice,
        minThreshold: payload.minThreshold !== undefined ? parseInt(payload.minThreshold, 10) : oldItem.minThreshold,
        lastUpdated: new Date().toISOString()
      };

      items[index] = updatedItem;
      await writeInventory(items);

      // Emit update event
      inventoryEvents.emit('item:updated', { oldItem, newItem: updatedItem });

      return sendJsonResponse(res, 200, {
        success: true,
        message: 'Product updated successfully',
        data: updatedItem
      });
    }

    // ------------------------------------------------------------------
    // ROUTE: DELETE /api/inventory/:id -> Delete Product
    // ------------------------------------------------------------------
    if (singleMatch && method === 'DELETE') {
      const id = singleMatch[1];
      const items = await readInventory();
      const index = items.findIndex(i => i.id === id || i.sku.toUpperCase() === id.toUpperCase());

      if (index === -1) {
        return sendJsonResponse(res, 404, { success: false, error: `Product '${id}' not found` });
      }

      const [deletedItem] = items.splice(index, 1);
      await writeInventory(items);

      // Emit delete event
      inventoryEvents.emit('item:deleted', deletedItem);

      return sendJsonResponse(res, 200, {
        success: true,
        message: `Product '${deletedItem.sku}' removed successfully`,
        data: deletedItem
      });
    }

    // ------------------------------------------------------------------
    // Fallback: 404 Not Found
    // ------------------------------------------------------------------
    return sendJsonResponse(res, 404, {
      success: false,
      error: `Endpoint '${pathname}' with method '${method}' not found`
    });

  } catch (err) {
    console.error('Server internal error:', err);
    return sendJsonResponse(res, 500, {
      success: false,
      error: 'Internal Server Error',
      details: err.message
    });
  }
});

// Start Server
server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(` ApexInventory Native Node.js Server Active`);
  console.log(` Student: Yash Prasanna Bhandari (Roll 08, D11ADA)`);
  console.log(` Listening on: http://localhost:${PORT}`);
  console.log(`=======================================================`);
});

export default server;

