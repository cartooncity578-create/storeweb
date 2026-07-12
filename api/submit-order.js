// Global State for products status and orders channel tracking
let liveOrdersCache = [];
let productStockStatus = {
  "80_robux": "In Stock",
  "400_robux": "In Stock",
  "800_robux": "In Stock",
  "1700_robux": "In Stock",
  "4500_robux": "In Stock",
  "10000_robux": "In Stock"
};

const DISCORD_WEBHOOK_URL = "YAHAN_APNA_DISCORD_WEBHOOK_URL_DALO";

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // GET Request: Admin aur Robux page data sync karne ke liye
  if (req.method === 'GET') {
    return res.status(200).json({ 
      success: true, 
      orders: liveOrdersCache, 
      stock: productStockStatus 
    });
  }

  // POST Request: Order pipeline ya Stock change control pipeline
  if (req.method === 'POST') {
    try {
      const { type, user, email, product, price, prodId, status } = req.body;

      // Agar request stock update ki hai (Admin Hub se)
      if (type === 'update_stock') {
        productStockStatus[prodId] = status;

        // Discord Notification for Stock Update
        if (DISCORD_WEBHOOK_URL !== "https://discord.com/api/webhooks/1525815962257981515/dLYVwZR54QKSUhiiLc_HA8ReCEgF5dm9T558MfeArNk-X0f8VYQlOW0lTwTgw-g9QEzR") {
          await fetch(DISCORD_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              embeds: [{
                title: "⚠️ STOCK UPDATE NOTICE",
                description: `Product **${prodId.replace('_', ' ').toUpperCase()}** status changed to **${status}**.`,
                color: status === "In Stock" ? 65280 : 16711680,
                timestamp: new Date().toISOString()
              }]
            })
          });
        }
        return res.status(200).json({ success: true, stock: productStockStatus });
      }

      // Agar request naye order submit karne ki hai (bill.html se)
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

      // Send Rich Embed Notification to Discord via Webhook
      if (DISCORD_WEBHOOK_URL !== "YAHAN_APNA_DISCORD_WEBHOOK_URL_DALO") {
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
      }

      return res.status(201).json({ success: true, order: newOrder });
    } catch (error) {
      return res.status(500).json({ success: false, error: 'Webhook delivery or function crash' });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not operational' });
}