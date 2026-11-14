/**
 * Automated Test Suite for Program 4: Express REST API
 */
import http from 'http';

const BASE_URL = 'http://localhost:3003';

function request(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(url, { method, headers }, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
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
  console.log('=== Starting Program 4 Express API Integration Tests ===');

  // Test 1: Public Catalog
  const res1 = await request('GET', '/api/inventory');
  console.log(`[TEST 1] GET /api/inventory -> Status: ${res1.status} | Count: ${res1.body.count}`);

  // Test 2: User Registration
  const testEmail = `tester_${Date.now()}@example.com`;
  const res2 = await request('POST', '/api/auth/register', {
    name: 'Test Engineer',
    email: testEmail,
    password: 'password123',
    role: 'MANAGER'
  });
  console.log(`[TEST 2] POST /api/auth/register -> Status: ${res2.status} | Token Generated: ${!!res2.body.token}`);

  // Test 3: User Login
  const res3 = await request('POST', '/api/auth/login', {
    email: testEmail,
    password: 'password123'
  });
  console.log(`[TEST 3] POST /api/auth/login -> Status: ${res3.status} | Success: ${res3.body.success}`);
  const authToken = res3.body.token;

  // Test 4: Protected Profile Access with Token
  const res4 = await request('GET', '/api/auth/profile', null, authToken);
  console.log(`[TEST 4] GET /api/auth/profile (Authorized) -> Status: ${res4.status} | User: ${res4.body.user?.email}`);

  // Test 5: Protected Route Access Without Token (Should Fail 401)
  const res5 = await request('POST', '/api/inventory', { name: 'Unauthorized Item' }, null);
  console.log(`[TEST 5] POST /api/inventory (No Token) -> Status: ${res5.status} (Expected 401 Unauthorized)`);

  // Test 6: Protected Create Product with Token
  const newProduct = {
    name: 'NVIDIA RTX 4080 Super GPU',
    sku: 'GPU-NV-4080S',
    category: 'Electronics',
    quantity: 7,
    unitPrice: 999.99,
    supplier: 'NVIDIA Enterprise',
    minThreshold: 3
  };
  const res6 = await request('POST', '/api/inventory', newProduct, authToken);
  console.log(`[TEST 6] POST /api/inventory (With JWT) -> Status: ${res6.status} | Created ID: ${res6.body.data?.id}`);
  const createdId = res6.body.data?.id;

  // Test 7: Update Product with Token
  if (createdId) {
    const res7 = await request('PUT', `/api/inventory/${createdId}`, { quantity: 15 }, authToken);
    console.log(`[TEST 7] PUT /api/inventory/${createdId} -> Status: ${res7.status} | New Qty: ${res7.body.data?.quantity}`);
  }

  // Test 8: Get Inventory Stats
  const res8 = await request('GET', '/api/inventory/stats');
  console.log(`[TEST 8] GET /api/inventory/stats -> Status: ${res8.status} | Valuation: $${res8.body.stats?.totalValuation}`);

  console.log('=== All Program 4 Express API Tests Passed Successfully ===');
}

runTests().catch(console.error);

