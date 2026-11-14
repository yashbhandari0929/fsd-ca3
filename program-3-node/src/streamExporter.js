import { Transform } from 'stream';
import fs from 'fs';
import { AUDIT_LOG_PATH } from './eventManager.js';

/**
 * Custom Node.js Transform Stream to convert JSON product objects into CSV lines
 */
export class JsonToCsvStream extends Transform {
  constructor(options = {}) {
    super({ ...options, objectMode: true });
    this.isFirstChunk = true;
  }

  _transform(chunk, encoding, callback) {
    if (this.isFirstChunk) {
      this.push('ID,SKU,Name,Category,Quantity,UnitPrice,Supplier,MinThreshold,LastUpdated\n');
      this.isFirstChunk = false;
    }

    const escapeCsv = (str) => {
      const val = str === null || str === undefined ? '' : String(str);
      return `"${val.replace(/"/g, '""')}"`;
    };

    const line = [
      escapeCsv(chunk.id),
      escapeCsv(chunk.sku),
      escapeCsv(chunk.name),
      escapeCsv(chunk.category),
      chunk.quantity,
      chunk.unitPrice,
      escapeCsv(chunk.supplier),
      chunk.minThreshold,
      escapeCsv(chunk.lastUpdated)
    ].join(',') + '\n';

    this.push(line);
    callback();
  }
}

/**
 * Returns a readable stream for audit log file
 */
export function getAuditLogStream() {
  if (!fs.existsSync(AUDIT_LOG_PATH)) {
    fs.writeFileSync(AUDIT_LOG_PATH, `[${new Date().toISOString()}] [INIT  ] Audit logging initialized.\n`);
  }
  return fs.createReadStream(AUDIT_LOG_PATH, { encoding: 'utf8' });
}

