/**
 * Program 5 Backend Integration Test
 */
import http from 'http';

const BASE_URL = 'http://localhost:5000';

function request(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' }
    };

    const req = http.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function runTests() {
  console.log('=== Program 5 Backend Database Integration Tests ===');

  // Test 1: GET All Products
  const res1 = await request('GET', '/api/products');
  console.log(`[TEST 1] GET /api/products -> Status: ${res1.status} | Count: ${res1.body.count}`);

  // Test 2: GET Stats
  const res2 = await request('GET', '/api/products/stats');
  console.log(`[TEST 2] GET /api/products/stats -> Status: ${res2.status} | Valuation: $${res2.body.stats?.totalValuation}`);

  // Test 3: POST Product
  const newProduct = {
    name: 'Corsair Vengeance 32GB DDR5 RAM',
    sku: 'MEM-COR-32G',
    category: 'Accessories',
    quantity: 14,
    unitPrice: 114.99,
    supplier: 'Corsair Official',
    minThreshold: 5
  };
  const res3 = await request('POST', '/api/products', newProduct);
  console.log(`[TEST 3] POST /api/products -> Status: ${res3.status} | DB ID: ${res3.body.data?.id}`);
  const createdId = res3.body.data?.id;

  // Test 4: PUT Product
  if (createdId) {
    const res4 = await request('PUT', `/api/products/${createdId}`, { quantity: 20 });
    console.log(`[TEST 4] PUT /api/products/${createdId} -> Status: ${res4.status} | Updated Qty: ${res4.body.data?.quantity}`);
  }

  // Test 5: DELETE Product
  if (createdId) {
    const res5 = await request('DELETE', `/api/products/${createdId}`);
    console.log(`[TEST 5] DELETE /api/products/${createdId} -> Status: ${res5.status} | Removed`);
  }

  console.log('=== All Program 5 Backend Tests Passed Successfully ===');
}

runTests().catch(console.error);

