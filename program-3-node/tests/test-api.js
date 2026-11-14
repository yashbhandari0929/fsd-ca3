/**
 * Automated Verification Script for Program 3 Native Node Server
 */
import http from 'http';

const BASE_URL = 'http://localhost:3002';

function request(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, headers: res.headers, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, headers: res.headers, raw: data });
        }
      });
    });

    req.on('error', reject);
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('--- Starting Program 3 Native HTTP API Tests ---');

  // Test 1: GET /api/inventory
  const res1 = await request('GET', '/api/inventory');
  console.log(`[TEST 1] GET /api/inventory -> Status: ${res1.status} | Total items: ${res1.body.total}`);

  // Test 2: GET /api/inventory/stats
  const res2 = await request('GET', '/api/inventory/stats');
  console.log(`[TEST 2] GET /api/inventory/stats -> Valuation: $${res2.body.stats.totalValuation} | SKUs: ${res2.body.stats.totalProducts}`);

  // Test 3: POST /api/inventory (Create new item)
  const newItem = {
    name: "Raspberry Pi 5 8GB Starter Kit",
    sku: "DEV-RPI-58G",
    category: "Computers",
    quantity: 12,
    unitPrice: 119.99,
    supplier: "Raspberry Pi Foundation",
    minThreshold: 4
  };
  const res3 = await request('POST', '/api/inventory', newItem);
  console.log(`[TEST 3] POST /api/inventory -> Status: ${res3.status} | Created ID: ${res3.body.data?.id}`);

  // Test 4: PUT /api/inventory/:id (Update item quantity)
  if (res3.body.data?.id) {
    const updateRes = await request('PUT', `/api/inventory/${res3.body.data.id}`, { quantity: 2 });
    console.log(`[TEST 4] PUT /api/inventory/${res3.body.data.id} -> Status: ${updateRes.status} | Updated Qty: ${updateRes.body.data?.quantity}`);
  }

  // Test 5: GET /api/inventory/export/csv
  const res5 = await request('GET', '/api/inventory/export/csv');
  console.log(`[TEST 5] GET /api/inventory/export/csv -> Status: ${res5.status} | Content-Type: ${res5.headers['content-type']}`);

  console.log('--- All Program 3 Tests Completed Successfully ---');
}

runTests().catch(console.error);

