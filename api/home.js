import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'db.json');

export default function handler(req, res) {
  // 1. Data load karo
  let db = { catalog: {} };
  if (fs.existsSync(DB_PATH)) {
    db = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
  }

  // 2. POST request handle karo (Add/Edit/Delete)
  if (req.method === 'POST') {
    const { type, key, name, image, redirect, cat } = req.body;

    if (type === 'add') {
      db.catalog['item_' + Date.now()] = { name, image, redirect, cat };
    } else if (type === 'edit') {
      db.catalog[key] = { name, image, redirect, cat };
    } else if (type === 'del') {
      delete db.catalog[key];
    }

    fs.writeFileSync(DB_PATH, JSON.stringify(db));
    return res.status(200).json({ success: true });
  }

  // 3. GET request: Data wapas bhejo
  res.status(200).json(db);
}
