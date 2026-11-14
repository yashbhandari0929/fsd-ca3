# Program 3: Native Node.js Inventory Utility & Streaming Server

**Subject:** Full Stack Development (FSD) – CA3  
**Student Name:** Yash Prasanna Bhandari  
**Roll Number:** 08  
**Division:** D11ADA | **Semester:** V  
**Degree:** B.E. Artificial Intelligence and Data Science  
**Course Outcomes Mapped:** **CO4**

---

## 1. Project Overview & Aim

The objective of Program 3 is to develop a robust, zero-dependency backend Inventory Utility using **pure Node.js core modules** without any third-party web frameworks such as Express.

The system demonstrates:
1. Low-level asynchronous file persistence using `fs/promises` and the `path` module for platform-agnostic file paths.
2. An asynchronous **Event-Driven Architecture** utilizing `EventEmitter` for audit logging, state change events, and stock safety alarms.
3. High-throughput data transformation and download via **Node.js Streams** (`stream.Transform`, `stream.Readable`, `stream.pipe`) for memory-efficient CSV exports.
4. A complete native HTTP web server built with `http.createServer()` handling routing, headers, body streams, CORS, query strings, and standard HTTP status codes.

---

## 2. Technologies Used

- **Node.js Core Runtimes:**
  - `http`: Web server creation, request listener, header dispatch, response streaming.
  - `fs` / `fs/promises`: Non-blocking file reads, writes, atomic JSON file updates.
  - `path`: Normalized path resolution (`path.resolve`, `path.join`, `path.dirname`).
  - `events`: Subclassing `EventEmitter` for real-time decoupled application events.
  - `stream`: Custom `Transform` stream implementing `_transform()` for JSON-to-CSV transformation.
  - `url`: URL and search parameter parsing via the standard WHATWG URL API.

---

## 3. Architecture & Module Design

```
program-3-node/
├── package.json         # Project metadata and execution scripts
├── data/
│   ├── inventory.json   # Primary persistent JSON file store
│   └── audit.log        # Event-driven append-only audit trail
├── src/
│   ├── server.js        # Native HTTP server, router & request body parser
│   ├── fileManager.js   # Safe file I/O operations using path & fs/promises
│   ├── eventManager.js  # InventoryEventEmitter for event publishing/listening
│   └── streamExporter.js# JsonToCsvStream Transform class & log streamer
├── tests/
│   └── test-api.js      # Automated programmatic test suite
├── screenshots/         # Captured execution and terminal outputs
│   ├── 01_server_startup.png
│   ├── 02_api_get_inventory.png
│   ├── 03_post_event_trigger.png
│   ├── 04_stream_csv_export.png
│   └── 05_audit_log_stream.png
└── README.md            # Program documentation
```

---

## 4. API Specification & Endpoints

| Method | Endpoint | Description | Status Code |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Web dashboard & interactive API documentation | `200 OK` |
| `GET` | `/api/inventory` | Retrieve inventory records (supports `?search=` and `?category=`) | `200 OK` |
| `GET` | `/api/inventory/:id` | Lookup single product by ID or SKU | `200 OK` / `404 Not Found` |
| `GET` | `/api/inventory/stats` | Compute total items, valuation, low stock, out of stock | `200 OK` |
| `GET` | `/api/inventory/export/csv` | Stream catalog as CSV file using `Transform Stream` | `200 OK` |
| `GET` | `/api/audit-logs` | Stream append-only audit event logs | `200 OK` |
| `POST` | `/api/inventory` | Register new product (emits `item:created` & writes to disk) | `201 Created` / `400 Bad Request` |
| `PUT` | `/api/inventory/:id` | Update product attributes (emits `item:updated` & low stock alerts) | `200 OK` / `404 Not Found` |
| `DELETE` | `/api/inventory/:id` | Delete product (emits `item:deleted` & updates disk) | `200 OK` / `404 Not Found` |

---

## 5. Execution Instructions

### Start the Server
```bash
cd program-3-node
node src/server.js
```
The server will start listening on `http://localhost:3002`.

### Run Automated Tests
In a separate terminal:
```bash
node tests/test-api.js
```

---

## 6. Verification & Event Audit Evidence

When a product is created or updated, `InventoryEventEmitter` fires decoupled events that immediately write to `data/audit.log`:

```log
[2026-11-14T08:30:10.123Z] [CREATE] Created item DEV-RPI-58G (Qty: 12, Price: $119.99)
[2026-11-14T08:31:05.456Z] [UPDATE] Updated DEV-RPI-58G. Qty: 12 -> 2
[2026-11-14T08:31:05.457Z] [ALERT ] Stock threshold reached for DEV-RPI-58G: 2 units remaining
```

