let liveOrdersCache = [];

// Dynamic base product cluster system memory state
let productCatalog = {
  "80_robux": { name: "80 Robux", price: "70", status: "In Stock" },
  "400_robux": { name: "400 Robux", price: "350", status: "In Stock" },
  "800_robux": { name: "800 Robux", price: "680", status: "In Stock" },
  "1700_robux": { name: "1700 Robux", price: "1400", status: "In Stock" },
  "4500_robux": { name: "4500 Robux", price: "3600", status: "In Stock" },
  "10000_robux": { name: "10000 Robux", price: "7800", status: "In Stock" }
};

const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1525815962257981515/dLYVwZR54QKSUhiiLc_HA8ReCEgF5dm9T558MfeArNk-X0f8VYQlOW0lTwTgw-g9QEzR";

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    return res.status(200).json({ 
      success: true, 
      orders: liveOrdersCache, 
      catalog: productCatalog
    });
  }

  if (req.method === 'POST') {
    try {
      const { type, user, email, product, price, prodId, status, packName, packPrice } = req.body;

      // 1. Action to save/modify stock or price configurations
      if (type === 'update_stock') {
        if (prodId.endsWith('_price_sync')) {
          const actualKey = prodId.replace('_price_sync', '');
          if (productCatalog[actualKey]) productCatalog[actualKey].price = status;
        } else {
          if (productCatalog[prodId]) productCatalog[prodId].status = status;
        }
        return res.status(200).json({ success: true, catalog: productCatalog });
      }

      // 2. Action to create an entirely new Robux Package
      if (type === 'add_product') {
        const generatedKey = packName.toLowerCase().replace(/\s+/g, '_') + '_' + Date.now();
        productCatalog[generatedKey] = {
          name: packName,
          price: packPrice,
          status: "In Stock"
        };
        return res.status(201).json({ success: true, catalog: productCatalog });
      }

      // 3. Action to submit incoming orders
      const newOrder = {
        id: 'ZGS-' + Math.floor(Math.random() * 900000 + 100000),
        user: user || 'Guest Gamer',
        email: email || 'No Email Logged',
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
              { name: "Email Node / Contacts", value: `\`${newOrder.email}\``, inline: false },
              { name: "Product Selected", value: newOrder.product, inline: true },
              { name: "Price Settlement", value: `৳${newOrder.price}`, inline: true }
            ],
            footer: { text: "ZubayGames Order Intercept System" },
            timestamp: new Date().toISOString()
          }]
        })
      });

      return res.status(201).json({ success: true, order: newOrder });
    } catch (error) {
      return res.status(500).json({ success: false, error: 'Pipeline error' });
    }
  }
}
