// api/home.js
export default function handler(req, res) {
  // Yahan tum data ka logic likhoge
  if (req.method === 'GET') {
    res.status(200).json({
      catalog: {
        "item1": { name: "Minecraft", image: "https://placehold.co/150", redirect: "minecraft.html" }
      }
    });
  } else if (req.method === 'POST') {
    // Yahan POST request handle hogi
    res.status(200).json({ success: true });
  }
}
