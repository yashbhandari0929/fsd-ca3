import { sequelize, Product } from '../models/index.js';

const initialItems = [
  {
    name: "Dell UltraSharp 27\" 4K Monitor",
    sku: "MON-DEL-4K",
    category: "Electronics",
    quantity: 18,
    unitPrice: 549.99,
    supplier: "Dell Direct India",
    minThreshold: 5
  },
  {
    name: "Logitech MX Master 3S Mouse",
    sku: "ACC-LOG-MX3S",
    category: "Accessories",
    quantity: 42,
    unitPrice: 99.50,
    supplier: "Logitech Official",
    minThreshold: 10
  },
  {
    name: "Apple MacBook Pro 14\" M3 Pro",
    sku: "LAP-APP-M3P",
    category: "Computers",
    quantity: 4,
    unitPrice: 1999.00,
    supplier: "Apple Distribution",
    minThreshold: 5
  },
  {
    name: "Keychron K2 Mechanical Keyboard",
    sku: "KEY-KCH-K2",
    category: "Accessories",
    quantity: 15,
    unitPrice: 89.99,
    supplier: "Keychron Global",
    minThreshold: 8
  },
  {
    name: "Cisco Catalyst 1000 Gigabit Switch",
    sku: "NET-CIS-C10",
    category: "Networking",
    quantity: 0,
    unitPrice: 620.00,
    supplier: "Cisco Systems",
    minThreshold: 3
  },
  {
    name: "Samsung 990 Pro 2TB NVMe SSD",
    sku: "STR-SAM-990P",
    category: "Storage",
    quantity: 30,
    unitPrice: 169.99,
    supplier: "Samsung Semiconductor",
    minThreshold: 8
  }
];

export async function seedDatabase() {
  try {
    await sequelize.authenticate();
    console.log('[DB] Connection established successfully.');
    await sequelize.sync({ force: true });
    console.log('[DB] Database schema synchronized.');

    for (const item of initialItems) {
      await Product.create(item);
    }
    console.log(`[DB] Successfully seeded ${initialItems.length} initial products.`);
  } catch (err) {
    console.error('[DB] Seeding failed:', err.message);
  }
}

// Auto-run if executed directly
if (process.argv[1]?.endsWith('seed.js')) {
  seedDatabase().then(() => process.exit(0));
}

