# Program 5: Full Stack Inventory Integration with Sequelize ORM & Relational Database

**Subject:** Full Stack Development (FSD) – CA3  
**Student Name:** Yash Prasanna Bhandari  
**Roll Number:** 08  
**Division:** D11ADA | **Semester:** V  
**Degree:** B.E. Artificial Intelligence and Data Science  
**Course Outcomes Mapped:** **CO6**

---

## 1. Project Overview & Aim

The objective of Program 5 is to architect, develop, and integrate a complete **Full Stack Enterprise Application** comprising a modern **React 18 Single Page Application (SPA)** client and an **Express.js RESTful API** backend persisted with **Sequelize ORM** targeting a relational database (**PostgreSQL** on Render / **SQLite** locally).

The system demonstrates:
1. End-to-end full stack communication via standard asynchronous REST pipelines.
2. Relational database modeling with Sequelize: schema validation, types, unique constraints, and auto-timestamps.
3. Decoupled client-side loading indicators, skeleton states, and graceful error banners with automatic retry mechanisms.
4. Security best practices: CORS whitelist headers, environment variable isolation, and zero committed credentials.
5. Production deployment configurations targeting **Vercel** (Frontend) and **Render** (Backend with managed PostgreSQL).

---

## 2. Technologies Used

- **Frontend Client:**
  - React 18, JSX, Vite build tool.
  - Asynchronous Fetch API client with query parameter serialization.
  - CSS Custom properties design system adhering to the SaaS navy/slate palette.
- **Backend Service:**
  - Node.js & Express.js REST application.
  - CORS middleware configured for cross-origin security.
  - Centralized error handler and request logging.
- **Database Layer & ORM:**
  - **Sequelize ORM 6.x:** Object-relational mapping, migrations, model sync.
  - **PostgreSQL (`pg`, `pg-hstore`):** Cloud production target.
  - **SQLite (`sqlite3`):** Zero-friction local file-based database engine (`data/inventory.sqlite`).

---

## 3. Relational Database Schema & Data Dictionary

The application defines a relational `Product` model mapped to the `products` table:

```sql
CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT, -- SERIAL in PostgreSQL
  sku VARCHAR(20) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL DEFAULT 'General',
  quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  unitPrice DECIMAL(10, 2) NOT NULL CHECK (unitPrice >= 0.01),
  supplier VARCHAR(100) NOT NULL DEFAULT 'Standard Vendor',
  minThreshold INTEGER NOT NULL DEFAULT 5 CHECK (minThreshold >= 1),
  createdAt TIMESTAMP NOT NULL,
  updatedAt TIMESTAMP NOT NULL
);
```

| Field Name | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `INTEGER` | Primary Key, Auto Increment | Unique record identifier |
| `sku` | `VARCHAR(20)` | `NOT NULL`, `UNIQUE` | Enterprise Stock Keeping Unit code |
| `name` | `VARCHAR(100)` | `NOT NULL`, length $\ge 3$ | Official product description |
| `category` | `VARCHAR(50)` | `NOT NULL` | Catalog taxonomy |
| `quantity` | `INTEGER` | `NOT NULL`, $\ge 0$ | Physical stock count on hand |
| `unitPrice` | `DECIMAL(10,2)` | `NOT NULL`, $> 0.00$ | Unit price in USD |
| `supplier` | `VARCHAR(100)` | `NOT NULL` | Vendor / distributor entity |
| `minThreshold` | `INTEGER` | `NOT NULL`, $\ge 1$ | Reorder trigger threshold |
| `createdAt` | `TIMESTAMP` | Auto-managed by Sequelize | Record creation timestamp |
| `updatedAt` | `TIMESTAMP` | Auto-managed by Sequelize | Last mutation timestamp |

---

## 4. Folder Structure

```
program-5-fullstack-integration/
├── backend/
│   ├── package.json         # Backend dependencies (express, cors, sequelize, sqlite3, pg)
│   ├── render.yaml          # Render deployment manifest
│   ├── .env.example         # Environment template
│   ├── src/
│   │   ├── server.js        # Express listener & DB sync bootstrapper
│   │   ├── config/
│   │   │   └── database.js  # Sequelize connection factory (Postgres/SQLite)
│   │   ├── models/
│   │   │   ├── Product.js   # Sequelize model definition & validation rules
│   │   │   └── index.js
│   │   ├── controllers/
│   │   │   └── productController.js # ORM CRUD operations
│   │   ├── routes/
│   │   │   └── productRoutes.js
│   │   └── seeders/
│   │       └── seed.js      # Initial baseline data seeder
│   └── tests/
│       └── integration.test.js
├── frontend/
│   ├── package.json         # Frontend dependencies (React, Vite)
│   ├── vite.config.js       # Vite development and bundle configuration
│   ├── vercel.json          # Vercel deployment and routing rules
│   ├── index.html           # HTML template
│   ├── .env.example         # Client API endpoint environment template
│   └── src/
│       ├── main.jsx         # React application bootstrap
│       ├── App.jsx          # Top-level state coordinator
│       ├── api.js           # Fetch API service layer
│       ├── index.css        # Enterprise design tokens
│       └── components/
│           ├── Navbar.jsx
│           ├── StatCards.jsx
│           ├── ProductTable.jsx
│           ├── ProductModal.jsx
│           ├── LoadingSpinner.jsx
│           └── ErrorBanner.jsx
├── screenshots/
└── README.md
```

---

## 5. Execution Instructions (Local Setup)

### Step 1: Boot the Express & Sequelize Backend
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd program-5-fullstack-integration/backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server (automatically connects to local SQLite and seeds initial data):
   ```bash
   npm start
   ```
   *The backend will be live at `http://localhost:5000`.*

### Step 2: Boot the React Frontend
1. Open a second terminal and navigate to the frontend folder:
   ```bash
   cd program-5-fullstack-integration/frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the client:
   ```bash
   npm run dev
   ```
   *Open your browser at `http://localhost:5173`.*

---

## 6. Cloud Deployment Guide

### A. Backend Deployment on Render
1. Push this repository to GitHub.
2. Sign in to [Render.com](https://render.com).
3. Create a **New Blueprint Instance** or Web Service linking `program-5-fullstack-integration/backend`.
4. Render automatically parses `render.yaml` to provision:
   - A free managed **PostgreSQL database instance**.
   - A Node web service with `npm install && npm start`.
5. Set environment variables in Render Dashboard:
   - `NODE_ENV`: `production`
   - `DATABASE_URL`: Injected automatically from the Render Postgres database.
   - `CLIENT_URL`: `https://your-frontend.vercel.app` (Your Vercel domain).

### B. Frontend Deployment on Vercel
1. Sign in to [Vercel](https://vercel.com).
2. Click **Add New Project** and import the repository.
3. Configure project root directory to `program-5-fullstack-integration/frontend`.
4. Add Environment Variable:
   - `VITE_API_URL`: `https://your-render-backend-url.onrender.com/api`
5. Click **Deploy**. Vercel will run `npm run build` using the included `vercel.json` rewrite configuration.

