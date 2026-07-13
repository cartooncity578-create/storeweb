import { kv } from '@vercel/kv';

export default function handler(req, res) {
  if (req.method === 'POST') {
    // Ye code KV mein data save karega (Live site par kaam karega)
    // Yahan logic add karo
  } else {
    // Data fetch karo
    const data = await kv.get('catalog') || { catalog: {} };
    res.status(200).json(data);
  }
}
