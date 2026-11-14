# Program 2: React Component-Driven Enterprise Inventory System

**Subject:** Full Stack Development (FSD) – CA3  
**Student Name:** Yash Prasanna Bhandari  
**Roll Number:** 08  
**Division:** D11ADA | **Semester:** V  
**Degree:** B.E. Artificial Intelligence and Data Science  
**Course Outcomes Mapped:** **CO3**

---

## 1. Project Overview & Aim

The objective of Program 2 is to architect and implement an enterprise-grade Inventory Management Application leveraging **React 18**, functional components, JSX, component state management via **React Hooks** (`useState`, `useEffect`), and multi-page declarative routing with **React Router v6**.

The system demonstrates:
1. Modular and atomic component architecture with clear separation of concerns.
2. Unidirectional data flow and strict props contracts.
3. Declarative client-side routing across 5 distinct routes (`/`, `/inventory`, `/add`, `/analytics`, `/about`).
4. Controlled form components with multi-field validation.
5. High-performance filtering, search, and sorting using memoized derived state.
6. Local persistence synchronization via `useEffect` hook.

---

## 2. Technologies Used

- **React 18.3+:** Modern functional component paradigm.
- **React Router DOM v6:** Declarative nested routing (`<Router>`, `<Routes>`, `<Route>`, `<NavLink>`).
- **Hooks:** `useState` for local and shared state, `useEffect` for lifecycle side-effects, `useMemo` for derived catalog filtering, `useNavigate` for programmatic redirection.
- **Vite:** High-performance ES module bundler and development server.
- **CSS3:** Custom properties design tokens, SaaS navy/slate palette, responsive flex/grid layouts.

---

## 3. Component Hierarchy

```
App (State Store & Router Root)
├── Navbar (Branding, Navigation Links, Candidate Tag)
├── Routes
│   ├── Route "/" -> DashboardPage
│   │   ├── StatCard (Metrics: Total SKUs, Valuation, Low Stock, Out of Stock)
│   │   └── InventoryTable (Priority Reorder Alerts & Recent Items)
│   ├── Route "/inventory" -> InventoryPage
│   │   ├── SearchFilterBar (Search input, Category filter, Stock filter, Sort selector)
│   │   └── InventoryTable (Full catalog with StockBadge, Edit/Delete handlers)
│   ├── Route "/add" -> AddProductPage
│   │   └── Controlled Product Specification Form
│   ├── Route "/analytics" -> AnalyticsPage
│   │   ├── StatCard (Portfolio Capital, Average Valuation)
│   │   └── Category Valuation & Progress Bar Allocation Breakdown
│   └── Route "/about" -> AboutPage
│       └── Candidate Metadata & Course Outcome Card
└── ProductFormModal (Reusable Add/Edit Dialog with Validation)
```

---

## 4. Folder Structure

```
program-2-react/
├── package.json         # Dependency manifest (React, React-DOM, React-Router-DOM, Vite)
├── vite.config.js       # Vite bundler configuration
├── index.html           # HTML template container
├── screenshots/         # Verified execution screenshots
│   ├── 01_dashboard.png
│   ├── 02_catalog_filter.png
│   ├── 03_add_product.png
│   ├── 04_analytics.png
│   └── 05_student_about.png
├── src/
│   ├── main.jsx         # React application entry point
│   ├── App.jsx          # Top-level state and routing coordinator
│   ├── index.css        # Enterprise design tokens and styles
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── StatCard.jsx
│   │   ├── StockBadge.jsx
│   │   ├── SearchFilterBar.jsx
│   │   ├── InventoryTable.jsx
│   │   └── ProductFormModal.jsx
│   ├── pages/
│   │   ├── DashboardPage.jsx
│   │   ├── InventoryPage.jsx
│   │   ├── AddProductPage.jsx
│   │   ├── AnalyticsPage.jsx
│   │   └── AboutPage.jsx
│   └── data/
│       └── initialData.js  # Baseline enterprise inventory records
└── README.md            # Program documentation
```

---

## 5. Execution Instructions

### Prerequisites
Node.js (v18+) and npm installed.

### Steps
1. Navigate into the React program directory:
   ```bash
   cd program-2-react
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:3001`.

4. Build production bundle:
   ```bash
   npm run build
   ```

---

## 6. Verification & Test Evidence

| Test Case | Feature Tested | Action / Input | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| **TC-01** | Routing Integrity | Click Navbar links | URL and page components update seamlessly without full-page reload | **PASS** |
| **TC-02** | Metrics Calculation | Modify item quantity | Dashboard stats and total portfolio valuation dynamically update | **PASS** |
| **TC-03** | Product Modal Form | Click "Edit" on SKU | Pre-populates form, validates fields, saves to state and localStorage | **PASS** |
| **TC-04** | Reactive Filter | Search "Dell" | Instantaneous filtering via `useMemo` with zero UI latency | **PASS** |
| **TC-05** | Analytics Allocation | View `/analytics` | Correct percentage share computed per product category | **PASS** |
| **TC-06** | State Persistence | Reload web page | State rehydrated accurately from browser localStorage | **PASS** |

