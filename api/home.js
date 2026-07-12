export default function handler(req, res) {
  // Demo Data (Vercel pe restart hota hai, database ke liye KV use karna padega)
  let db = { "item1": { name: "Minecraft", image: "...", redirect: "a.html", cat: "Topup" } };

  if (req.method === 'POST') {
    const { type, key, name, image, redirect, cat } = req.body;
    if (type === 'add') db['item' + Date.now()] = { name, image, redirect, cat };
    if (type === 'edit') db[key] = { name, image, redirect, cat };
    if (type === 'del') delete db[key];
    return res.status(200).json({ success: true });
  }

  res.status(200).json({ catalog: db });
}
