// api/home.js
export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json({ catalog: { /* tumhara data */ } });
  } else if (req.method === 'POST') {
    // Yahan tum data handle karoge
    res.status(200).json({ success: true });
  }
}
