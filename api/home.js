const BIN_ID = '6a5511e3f5f4af5e29895352';
const MASTER_KEY = '$2a$10$GgciNVlsxsg/OWI0DP9yau93Jy/igtLASCFRtt9ZYM80DPFZGYOtK';

export default async function handler(req, res) {
  const BIN_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

  // POST Request: Add, Edit, ya Delete karne ke liye
  if (req.method === 'POST') {
    // 1. Current data fetch karo
    const getRes = await fetch(BIN_URL, { 
      headers: { 'X-Master-Key': MASTER_KEY } 
    });
    const { record } = await getRes.json();
    
    // 2. Body se data lo
    const { type, key, name, image, redirect, cat } = req.body;

    // 3. Action perform karo
    if (type === 'add') {
      record.catalog['item_' + Date.now()] = { name, image, redirect, cat };
    } else if (type === 'edit') {
      record.catalog[key] = { name, image, redirect, cat };
    } else if (type === 'del') {
      delete record.catalog[key];
    }

    // 4. Update status JSONBin par save karo
    await fetch(BIN_URL, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json', 
        'X-Master-Key': MASTER_KEY 
      },
      body: JSON.stringify(record)
    });
    
    return res.status(200).json({ success: true });
  }

  // GET Request: Data fetch karke front-end ko bhejo
  const response = await fetch(BIN_URL, { 
    headers: { 'X-Master-Key': MASTER_KEY } 
  });
  const { record } = await response.json();
  res.status(200).json(record);
}
