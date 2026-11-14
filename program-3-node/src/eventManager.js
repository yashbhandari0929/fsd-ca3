import EventEmitter from 'events';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const AUDIT_LOG_PATH = path.resolve(__dirname, '..', 'data', 'audit.log');

class InventoryEventEmitter extends EventEmitter {
  constructor() {
    super();
    this.setupListeners();
  }

  setupListeners() {
    this.on('item:created', async (item) => {
      console.log(`[EVENT:item:created] Added SKU: ${item.sku} | Name: ${item.name}`);
      await this.logAudit('CREATE', `Created item ${item.sku} (Qty: ${item.quantity}, Price: $${item.unitPrice})`);
    });

    this.on('item:updated', async ({ oldItem, newItem }) => {
      console.log(`[EVENT:item:updated] Updated SKU: ${newItem.sku}`);
      await this.logAudit('UPDATE', `Updated ${newItem.sku}. Qty: ${oldItem.quantity} -> ${newItem.quantity}`);
      if (newItem.quantity <= newItem.minThreshold) {
        this.emit('stock:low_alert', newItem);
      }
    });

    this.on('item:deleted', async (item) => {
      console.log(`[EVENT:item:deleted] Removed SKU: ${item.sku}`);
      await this.logAudit('DELETE', `Deleted item ${item.sku} (${item.name})`);
    });

    this.on('stock:low_alert', async (item) => {
      const status = item.quantity === 0 ? 'OUT_OF_STOCK' : 'LOW_STOCK';
      console.warn(`[EVENT:stock:low_alert] ⚠️ Alert for SKU: ${item.sku} [${status}] (${item.quantity}/${item.minThreshold})`);
      await this.logAudit('ALERT', `Stock threshold reached for ${item.sku}: ${item.quantity} units remaining`);
    });
  }

  async logAudit(action, message) {
    const timestamp = new Date().toISOString();
    const entry = `[${timestamp}] [${action.padEnd(6)}] ${message}\n`;
    try {
      await fs.appendFile(AUDIT_LOG_PATH, entry, 'utf8');
    } catch (err) {
      console.error('Failed to append to audit log:', err.message);
    }
  }
}

export const inventoryEvents = new InventoryEventEmitter();
export { AUDIT_LOG_PATH };

