# Program 4: Express.js Enterprise REST API with JWT Authentication

**Subject:** Full Stack Development (FSD) – CA3  
**Student Name:** Yash Prasanna Bhandari  
**Roll Number:** 08  
**Division:** D11ADA | **Semester:** V  
**Degree:** B.E. Artificial Intelligence and Data Science  
**Course Outcomes Mapped:** **CO5**

---

## 1. Project Overview & Aim

The objective of Program 4 is to design, implement, and document a secure, production-grade **Express.js RESTful API** for enterprise inventory management.

The system demonstrates:
1. Complete CRUD endpoints (`GET`, `POST`, `PUT`, `DELETE`) adhering to REST principles.
2. Custom Express middleware chain:
   - **Request Logging Middleware:** Captures timestamp, HTTP method, URL, status code, and latency in milliseconds.
   - **Input Validation Middleware:** Sanitizes and asserts constraints on user and product payloads.
   - **Centralized Error Handling Middleware:** Intercepts unhandled exceptions and standardizes JSON error formats.
3. User Authentication & Authorization:
   - Password hashing and salting using **bcrypt**.
   - Stateless authentication using **JSON Web Tokens (JWT)**.
   - Protected inventory routes requiring valid `Bearer <token>` headers.
4. Comprehensive testing documentation including automated integration tests and a full **Postman Collection**.

---

## 2. Technologies Used

- **Runtime:** Node.js (v18+)
- **Framework:** Express.js 4.x
- **Security:**
  - `bcryptjs`: Password hashing with configurable salt rounds (cost factor 10).
  - `jsonwebtoken`: Cryptographic signing and verification of HMAC-SHA256 tokens.
- **Middleware:** `cors` for Cross-Origin Resource Sharing, `express.json()` for parsing incoming JSON request bodies.
- **Configuration:** `dotenv` for environment variable isolation.

---

## 3. Middleware Architecture

```
Incoming Request
      │
      ▼
┌──────────────────────────────────────────────┐
│ 1. CORS & Express JSON Parser                │
└──────────────────────────────────────────────┘
      │
      ▼
┌──────────────────────────────────────────────┐
│ 2. Custom Request Logger Middleware          │
│    (Logs: Timestamp | Method | URL | Status) │
└──────────────────────────────────────────────┘
      │
      ▼
┌──────────────────────────────────────────────┐
│ 3. Route-Specific Validation Middleware      │
│    (Checks: Email, Password, SKU, Price > 0) │
└──────────────────────────────────────────────┘
      │
      ▼
┌──────────────────────────────────────────────┐
│ 4. JWT Authentication Guard (Protected)      │
│    (Verifies: Bearer <token> in Auth Header) │
└──────────────────────────────────────────────┘
      │
      ▼
┌──────────────────────────────────────────────┐
│ 5. Controller Handlers (Business Logic)      │
└──────────────────────────────────────────────┘
      │
      ▼
┌──────────────────────────────────────────────┐
│ 6. Centralized Error Handler (500, 404, 400) │
└──────────────────────────────────────────────┘
```

---

## 4. API Endpoints Specification

### Authentication Endpoints

#### 1. Register User
- **Method:** `POST /api/auth/register`
- **Request Body:**
  ```json
  {
    "name": "Yash Prasanna Bhandari",
    "email": "yashbhandari0929@gmail.com",
    "password": "SecurePassword123",
    "role": "ADMIN"
  }
  ```
- **Response (`201 Created`):**
  ```json
  {
    "success": true,
    "message": "User registered successfully with hashed password",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
    "user": {
      "id": "USR-123456",
      "name": "Yash Prasanna Bhandari",
      "email": "yashbhandari0929@gmail.com",
      "role": "ADMIN"
    }
  }
  ```

#### 2. Login User
- **Method:** `POST /api/auth/login`
- **Request Body:**
  ```json
  {
    "email": "yashbhandari0929@gmail.com",
    "password": "SecurePassword123"
  }
  ```
- **Response (`200 OK`):**
  ```json
  {
    "success": true,
    "message": "Authentication successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
    "user": {
      "id": "USR-123456",
      "name": "Yash Prasanna Bhandari",
      "email": "yashbhandari0929@gmail.com",
      "role": "ADMIN"
    }
  }
  ```

---

### Inventory Endpoints

| Method | Endpoint | Access Level | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/inventory` | Public | List products (supports `?search=`, `?category=`, `?sortBy=`) |
| `GET` | `/api/inventory/stats` | Public | Real-time valuation and stock breakdown |
| `GET` | `/api/inventory/:id` | Public | Retrieve single product by ID or SKU |
| `POST` | `/api/inventory` | **Protected (JWT)** | Register new product in catalog |
| `PUT` | `/api/inventory/:id` | **Protected (JWT)** | Update inventory record |
| `DELETE` | `/api/inventory/:id` | **Protected (JWT)** | Delete product from inventory |

---

## 5. Postman Collection Integration

A ready-to-import Postman collection is included at:
`postman/fsd-ca3-inventory-api.postman_collection.json`

### Importing into Postman
1. Launch Postman.
2. Click **Import** &rarr; select `postman/fsd-ca3-inventory-api.postman_collection.json`.
3. The collection includes pre-configured environment variables (`base_url: http://localhost:3003`) and an automated test script on the Login endpoint that auto-populates `{{jwt_token}}` for subsequent protected requests.

---

## 6. Execution Instructions

### 1. Install Dependencies
```bash
cd program-4-express-api
npm install
```

### 2. Start the Server
```bash
npm start
```
The server will boot on `http://localhost:3003`.

### 3. Run Automated Integration Tests
In a secondary terminal:
```bash
npm test
```
This script executes end-to-end testing of authentication, JWT verification, and protected CRUD operations.

