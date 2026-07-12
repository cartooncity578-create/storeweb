// Dynamic Cloud Sync Hub via GitHub Storage API Pipeline
const GITHUB_TOKEN = "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"; 
const GITHUB_REPO = "cartooncity578-create/REPO_NAME_HERE"; // ⚠️ REPO_NAME_HERE hata kar apni repository ka naam dalo (e.g. zubaygameshop)
const FILE_PATH = "products.json"; 

let liveOrdersCache = [];
const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1525815962257981515/dLYVwZR54QKSUhiiLc_HA8ReCEgF5dm9T558MfeArNk-X0f8VYQlOW0lTwTgw-g9QEzR";

async function getCatalogFromGitHub() {
  try {
    const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${FILE_PATH}`, {
      headers: { Authorization: `token ${GITHUB_TOKEN}` }
    });
    if (!res.ok) return { catalog: {}, sha: null };
    const data = await res.json();
    const content = Buffer.from(data.content, 'base64').toString('utf-8');
    return { catalog: JSON.parse(content), sha: data.sha };
  } catch (e) {
    return { catalog: {}, sha: null };
  }
}

async function saveCatalogToGitHub(catalog, sha) {
  const contentBase64 = Buffer.from(JSON.stringify(catalog, null, 2)).toString('base64');
  await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${FILE_PATH}`, {
    method: 'PUT',
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: "Admin update: Sync catalog state",
      content: contentBase64,
      sha: sha
    })
  });
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    const { catalog } = await getCatalogFromGitHub();
    return res.status(200).json({ 
      success: true, 
      orders: liveOrdersCache, 
      catalog: catalog
    });
  }

  if (req.method === 'POST') {
    try {
      const { type, user, email, product, price, prodId, status, packName, packPrice } = req.body;

      if (type === 'update_stock') {
        const { catalog, sha } = await getCatalogFromGitHub();
        if (prodId.endsWith('_price_sync')) {
          const actualKey = prodId.replace('_price_sync', '');
          if (catalog[actualKey]) catalog[actualKey].price = status;
        } else {
          if (catalog[prodId]) catalog[catalog.hasOwnProperty(prodId) ? prodId : prodId].status = status;
        }
        await saveCatalogToGitHub(catalog, sha);
        return res.status(200).json({ success: true, catalog });
      }

      if (type === 'add_product') {
        const { catalog, sha } = await getCatalogFromGitHub();
        const generatedKey = packName.toLowerCase().replace(/\s+/g, '_') + '_' + Date.now();
        catalog[generatedKey] = { name: packName, price: packPrice, status: "In Stock" };
        await saveCatalogToGitHub(catalog, sha);
        return res.status(201).json({ success: true, catalog });
      }

      const newOrder = {
        id: 'ZGS-' + Math.floor(Math.random() * 900000 + 100000),
        user: user || 'Guest Gamer',
        email: email || 'No Credentials',
        product: product,
        price: price,
        timestamp: new Date().toISOString()
      };

      liveOrdersCache.unshift(newOrder);
      if (liveOrdersCache.length > 50) liveOrdersCache.pop();

      await fetch(DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          embeds: [{
            title: "🛒 NEW INCOMING ORDER RECOVERY",
            color: 5814783,
            fields: [
              { name: "Order ID", value: `\`${newOrder.id}\``, inline: true },
              { name: "Customer Username", value: newOrder.user, inline: true },
              { name: "Product Selected", value: newOrder.product, inline: true },
              { name: "Price Settlement", value: `৳${newOrder.price}`, inline: true }
            ],
            timestamp: new Date().toISOString()
          }]
        })
      });

      return res.status(201).json({ success: true, order: newOrder });
    } catch (error) {
      return res.status(500).json({ success: false, error: 'Pipeline write error' });
    }
  }
}
