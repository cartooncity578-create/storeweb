export default async function handler(req, res) {
  const BIN_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

  if (req.method === 'POST') {
    // 1. Pehle pura data fetch karo
    const getRes = await fetch(BIN_URL, { headers: { 'X-Master-Key': MASTER_KEY } });
    const { record } = await getRes.json();
    
    // 2. Data update karo (Add/Edit/Delete)
    const { type, key, name, image, redirect, cat } = req.body;
    if (type === 'add') record.catalog['item_' + Date.now()] = { name, image, redirect, cat };
    else if (type === 'edit') record.catalog[key] = { name, image, redirect, cat };
    else if (type === 'del') delete record.catalog[key];

    // 3. JSONBin par wapas save karo
    await fetch(BIN_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'X-Master-Key': MASTER_KEY },
      body: JSON.stringify(record)
    });
    return res.status(200).json({ success: true });
  }

  // GET request: Data fetch karke bhejo
  const response = await fetch(BIN_URL, { headers: { 'X-Master-Key': MASTER_KEY } });
  const { record } = await response.json();
  res.status(200).json(record);
}
