import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '..', 'data');
const INVENTORY_FILE = path.join(DATA_DIR, 'inventory.json');

export async function ensureDataFiles() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(INVENTORY_FILE);
    } catch {
      await fs.writeFile(INVENTORY_FILE, '[]', 'utf8');
    }
  } catch (err) {
    console.error('Error initializing data directory:', err);
  }
}

export async function readInventory() {
  await ensureDataFiles();
  try {
    const data = await fs.readFile(INVENTORY_FILE, 'utf8');
    return JSON.parse(data || '[]');
  } catch (err) {
    console.error('Error reading inventory file:', err.message);
    return [];
  }
}

export async function writeInventory(items) {
  await ensureDataFiles();
  const formatted = JSON.stringify(items, null, 2);
  await fs.writeFile(INVENTORY_FILE, formatted, 'utf8');
}

export { INVENTORY_FILE, DATA_DIR };

