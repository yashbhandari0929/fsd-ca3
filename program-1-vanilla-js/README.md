# Program 1: Browser-Based Enterprise Inventory Management Dashboard

**Subject:** Full Stack Development (FSD) – CA3  
**Student Name:** Yash Prasanna Bhandari  
**Roll Number:** 08  
**Division:** D11ADA | **Semester:** V  
**Degree:** B.E. Artificial Intelligence and Data Science  
**Course Outcomes Mapped:** **CO1, CO2**

---

## 1. Project Overview & Aim

The objective of Program 1 is to design, develop, and test a professional, enterprise-grade client-side Inventory Management System using **semantic HTML5**, modern **responsive CSS3**, and object-driven **Vanilla JavaScript (ES6+)**.

The system demonstrates:
1. Dynamic DOM manipulation for rendering tables, statistics, modals, and notifications without third-party frameworks.
2. Robust input validation with instantaneous user feedback and error state handling.
3. Asynchronous HTTP request lifecycles via the modern **Fetch API** (`async`/`await`) demonstrating **GET** and simulated **POST** workflows.
4. Real-time request and response inspection with a live payload visualizer.
5. Client-side persistence via `localStorage` with failover seeding.
6. Advanced client-side search, multi-field filtering, and custom sorting.

---

## 2. Technologies Used

- **HTML5:** Semantic document structuring (`<header>`, `<main>`, `<section>`, `<table>`, `<dialog>` modal).
- **CSS3:** Custom properties (design tokens), Flexbox, CSS Grid, animations, and SaaS navy/slate color palette (`#0f172a`, `#2563eb`).
- **Vanilla JavaScript (ES6+):** Arrow functions, template literals, destructuring, higher-order array methods (`filter`, `map`, `reduce`, `sort`), DOM APIs, event delegation, and asynchronous Promises with `async/await`.
- **Browser Storage:** `Window.localStorage` API for state persistence.
- **Data Exchange:** JSON format for simulated cloud sync and sample dataset.

---

## 3. Key Functional Features

- **Inventory Dashboard Metrics:**
  - Dynamic computation of **Total Products**, **Total Valuation** ($\sum \text{Qty} \times \text{Unit Price}$), **Low Stock Count** ($\le \text{Threshold}$), and **Out of Stock Count** ($=0$).
- **CRUD Operations:**
  - **Create:** Modal form to register new stock items with SKU validation.
  - **Read:** Render dynamic tabular data with status pill badges (In Stock, Low Stock, Out of Stock).
  - **Update:** Pre-filled edit modal allowing in-place field updates.
  - **Delete:** Safe removal with confirmation dialog and state recalculation.
- **Fetch API Demonstration:**
  - **GET Pipeline:** Loads `./sample-data.json` asynchronously using `fetch()` and `async/await`.
  - **POST Pipeline:** Simulates atomic cloud synchronization with batch headers, audit IDs, and latency simulation.
  - **Inspector Panel:** Displays live HTTP method, request headers, payload, status codes (`200 OK`, `201 Created`), and execution latency in milliseconds.
- **Search, Filter & Sort:**
  - Multi-attribute text search across Product Name, SKU, and Supplier.
  - Dropdown filtering by Category and Stock Level.
  - Multi-directional sorting (Name A-Z/Z-A, Price High-Low/Low-High, Quantity High-Low/Low-High).
- **Data Portability:**
  - One-click export to standalone formatted JSON.
  - Instant reset to factory sample data.

---

## 4. Folder Structure

```
program-1-vanilla-js/
├── index.html           # Core HTML5 semantic interface
├── style.css            # Enterprise navy-slate CSS styles & responsive layout
├── script.js            # Modular Vanilla JavaScript application controller
├── sample-data.json     # Initial mock catalog data
├── screenshots/         # Captured verification screenshots
│   ├── 01_dashboard.png
│   ├── 02_add_modal.png
│   ├── 03_fetch_inspector.png
│   └── 04_filter_search.png
└── README.md            # Program documentation
```

---

## 5. Execution Instructions

### Option A: Direct Browser Launch
Simply double-click `index.html` or open it in Google Chrome / Microsoft Edge / Mozilla Firefox.

### Option B: Local Static Server (Recommended)
Using Python:
```bash
cd program-1-vanilla-js
python -m http.server 3000
```
Then visit `http://localhost:3000` in your web browser.

Using Node `npx serve`:
```bash
npx serve .
```

---

## 6. Verification & Test Evidence

| Test Case | Description | Input / Action | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| **TC-01** | Initial Data Hydration | Page Load | Fetches `sample-data.json`, renders 6 items, updates stats | **PASS** |
| **TC-02** | Form Validation | Blank SKU / Negative Price | Highlights invalid fields with error messages | **PASS** |
| **TC-03** | Product Addition | Valid payload in Add modal | New item prepended, valuation updated, toast emitted | **PASS** |
| **TC-04** | Live Fetch Inspector | Click "Fetch Sample (GET)" | Shows request headers, 200 OK, latency & response JSON | **PASS** |
| **TC-05** | Cloud Sync Simulation | Click "Sync Cloud (POST)" | Emits simulated POST request, returns 201 Created payload | **PASS** |
| **TC-06** | Search & Filter | Filter Category = "Electronics" | Displays only Electronics items, recalculates count | **PASS** |
| **TC-07** | Persistent State | Refresh browser | State restored seamlessly from `localStorage` | **PASS** |

