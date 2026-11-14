# ApexInventory – Enterprise Full Stack Inventory Management System

**Full Stack Development (FSD) – Continuous Assessment 3 (CA3)**  
**Department of Artificial Intelligence & Data Science**  

---

## Student Details & Submission Metadata

| Attribute | Academic Record |
| :--- | :--- |
| **Student Name** | **Yash Prasanna Bhandari** |
| **Roll Number** | **08** |
| **Subject** | **Full Stack Development (FSD)** |
| **Division** | **D11ADA** |
| **Semester** | **Semester V** |
| **Degree** | **B.E. Artificial Intelligence and Data Science** |
| **Assignment** | **CA3 – Full Stack Development Programming Exercise** |
| **Total Programs** | **5 Programs (Complete Suite)** |
| **GitHub Repository** | [https://github.com/yashbhandari0929/fsd-ca3](https://github.com/yashbhandari0929/fsd-ca3) |

---

## Executive Project Overview

**ApexInventory** is an enterprise-grade stock valuation, catalog management, and audit tracking suite developed to fulfill the Continuous Assessment 3 (CA3) practical requirements for Full Stack Development.

The project systematically advances from fundamental client-side DOM manipulation and asynchronous networking to modular component architecture, low-level streaming backend services, secured REST APIs, and full stack database persistence.

### Course Outcome (CO) Mapping

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       COURSE OUTCOME (CO) MAPPING                           │
├───────────┬─────────────────────────────────────────────────┬───────────────┤
│ Program   │ Focus Area & Architectural Paradigm             │ Outcome       │
├───────────┼─────────────────────────────────────────────────┼───────────────┤
│ Program 1 │ Vanilla JS DOM Manipulation & Fetch API Async   │ CO1, CO2      │
│ Program 2 │ React 18 Component Architecture & Client Router │ CO3           │
│ Program 3 │ Node.js File System, Streams & EventEmitter     │ CO4           │
│ Program 4 │ Express REST API with JWT & bcrypt Auth Guard   │ CO5           │
│ Program 5 │ Full Stack React + Express + Sequelize ORM / DB │ CO6           │
└───────────┴─────────────────────────────────────────────────┴───────────────┘
```

---

## Five Program Summaries

### 1. Program 1: Vanilla JavaScript Enterprise Dashboard (`CO1`, `CO2`)
- **Technologies:** HTML5, CSS3, Vanilla JavaScript (ES6+), Fetch API, `localStorage`.
- **Highlights:** Zero external libraries. Features dynamic DOM generation, client-side input validation, real-time statistics calculation, multi-field search and category filtering, a live **Fetch API Request/Response Inspector**, simulated cloud sync, and JSON export.
- **Directory:** [`program-1-vanilla-js/`](./program-1-vanilla-js/)

### 2. Program 2: React Component-Driven SPA (`CO3`)
- **Technologies:** React 18, JSX, Vite, React Router DOM v6, Modern CSS.
- **Highlights:** Strict atomic component structure (`StatCard`, `StockBadge`, `ProductFormModal`, `InventoryTable`, `SearchFilterBar`). Features 5 declarative routes (`/`, `/inventory`, `/add`, `/analytics`, `/about`), memoized filtering via `useMemo`, and automated synchronization with `localStorage` via `useEffect`.
- **Directory:** [`program-2-react/`](./program-2-react/)

### 3. Program 3: Native Node.js Inventory Utility (`CO4`)
- **Technologies:** Native Node.js (`http`, `fs/promises`, `path`, `stream`, `events`).
- **Highlights:** Built with zero npm dependencies. Features safe cross-platform file storage in `data/inventory.json`, decoupled event-driven audit logging with `EventEmitter`, memory-efficient CSV streaming using a custom `stream.Transform` pipeline, and an interactive native HTTP dashboard.
- **Directory:** [`program-3-node/`](./program-3-node/)

### 4. Program 4: Express.js REST API with JWT & bcrypt (`CO5`)
- **Technologies:** Node.js, Express.js 4.x, JSON Web Tokens (JWT), `bcryptjs`, `cors`, `dotenv`.
- **Highlights:** Complete RESTful CRUD API with a custom request logging middleware, payload validator middleware, centralized error handling, user registration with salted password hashing, stateless JWT authentication, and protected inventory endpoints. Includes a complete **Postman collection**.
- **Directory:** [`program-4-express-api/`](./program-4-express-api/)

### 5. Program 5: Full Stack Integration & Sequelize ORM (`CO6`)
- **Technologies:** React 18 SPA, Express.js, Sequelize ORM 6.x, PostgreSQL (Cloud) / SQLite (Local).
- **Highlights:** Complete full-stack integration connecting React client to Express backend. Implements strict relational database schema definitions, validations, constraints, and timestamps. Features loading spinners, error banners with automatic retry, CORS configuration, environment variable isolation, and complete deployment configurations for **Vercel** and **Render**.
- **Directory:** [`program-5-fullstack-integration/`](./program-5-fullstack-integration/)

---

## Master Repository Structure

```
fsd-ca3/
├── README.md                                  # Root documentation & student credentials
│
├── program-1-vanilla-js/                     # Program 1 (Vanilla JS, DOM & Fetch API)
│   ├── index.html                            # Semantic HTML5 dashboard
│   ├── style.css                             # Enterprise Navy/Slate styling
│   ├── script.js                             # Vanilla JS application controller
│   ├── sample-data.json                      # Seed catalog data
│   ├── screenshots/                          # Verified execution captures
│   └── README.md                             # Detailed Program 1 documentation
│
├── program-2-react/                          # Program 2 (React 18 & React Router)
│   ├── package.json                          # Dependencies manifest
│   ├── vite.config.js                        # Vite bundler configuration
│   ├── index.html                            # React mounting template
│   ├── screenshots/                          # Verified execution captures
│   ├── src/
│   │   ├── main.jsx                          # Root entry point
│   │   ├── App.jsx                           # Route coordinator & state manager
│   │   ├── index.css                         # Custom properties design tokens
│   │   ├── components/                       # Reusable functional components
│   │   ├── pages/                            # 5 dedicated route views
│   │   └── data/initialData.js               # Initial state fixtures
│   └── README.md                             # Detailed Program 2 documentation
│
├── program-3-node/                           # Program 3 (Native Node Core Modules)
│   ├── package.json                          # Scripts & zero-dependency config
│   ├── data/
│   │   ├── inventory.json                    # File-based JSON database
│   │   └── audit.log                         # Append-only event audit trail
│   ├── src/
│   │   ├── server.js                         # Native HTTP server & router
│   │   ├── fileManager.js                    # Safe fs/promises & path operations
│   │   ├── eventManager.js                   # InventoryEventEmitter subsystem
│   │   └── streamExporter.js                 # Transform stream CSV exporter
│   ├── tests/test-api.js                     # Automated HTTP verification script
│   ├── screenshots/                          # Verified execution captures
│   └── README.md                             # Detailed Program 3 documentation
│
├── program-4-express-api/                    # Program 4 (Express REST API with JWT)
│   ├── package.json                          # Manifest (express, jwt, bcrypt, cors)
│   ├── postman/                              # Pre-built Postman test collection
│   │   └── fsd-ca3-inventory-api.postman_collection.json
│   ├── screenshots/                          # Verified execution captures
│   ├── src/
│   │   ├── server.js                         # Express application bootstrap
│   │   ├── middleware/                       # Logger, validator, auth, errorHandler
│   │   ├── controllers/                      # Auth & Inventory controllers
│   │   └── routes/                           # Auth & Inventory routers
│   ├── tests/api.test.js                     # Automated API integration tests
│   └── README.md                             # Detailed Program 4 documentation
│
├── program-5-fullstack-integration/          # Program 5 (Full Stack & Sequelize ORM)
│   ├── backend/                              # Express & Sequelize Service
│   │   ├── package.json
│   │   ├── render.yaml                       # Render deployment manifest
│   │   ├── .env.example
│   │   ├── src/
│   │   │   ├── server.js
│   │   │   ├── config/database.js            # Sequelize PostgreSQL / SQLite
│   │   │   ├── models/Product.js             # Relational model & constraints
│   │   │   ├── controllers/productController.js
│   │   │   ├── routes/productRoutes.js
│   │   │   └── seeders/seed.js               # Database seeder
│   │   └── tests/integration.test.js
│   ├── frontend/                             # React 18 Single Page Client
│   │   ├── package.json
│   │   ├── vite.config.js
│   │   ├── vercel.json                       # Vercel deployment manifest
│   │   ├── .env.example
│   │   └── src/                              # Components, API service, App
│   ├── screenshots/                          # Verified execution captures
│   └── README.md                             # Detailed Program 5 documentation
│
└── practical-journal/                        # College Practical Journal Deliverable
    ├── Yash_Prasanna_Bhandari_FSD_CA3_Report.pdf  # Printable A4 PDF Journal
    └── report-source/                        # HTML/CSS generator & template
```

---

## Global Quick Start Guide

### 1. Run Program 1 (Vanilla JS)
```bash
cd program-1-vanilla-js
python -m http.server 3000
# Open http://localhost:3000
```

### 2. Run Program 2 (React)
```bash
cd program-2-react
npm install
npm run dev
# Open http://localhost:3001
```

### 3. Run Program 3 (Native Node.js)
```bash
cd program-3-node
node src/server.js
# Access native server at http://localhost:3002
# Run automated tests: node tests/test-api.js
```

### 4. Run Program 4 (Express REST API)
```bash
cd program-4-express-api
npm install
npm start
# Access API at http://localhost:3003
# Run automated tests: npm test
```

### 5. Run Program 5 (Full Stack Integration)
Terminal 1 (Backend):
```bash
cd program-5-fullstack-integration/backend
npm install
npm start
# Backend live at http://localhost:5000
```

Terminal 2 (Frontend):
```bash
cd program-5-fullstack-integration/frontend
npm install
npm run dev
# Frontend live at http://localhost:5173
```

---

## Printable Practical Journal PDF

The formal, printable college practical journal document is located at:  
`practical-journal/Yash_Prasanna_Bhandari_FSD_CA3_Report.pdf`

It contains complete aim, theory, algorithms, source code listings, real output screenshots, database schema definitions, API documentation, and conclusion formatted according to university standards.
