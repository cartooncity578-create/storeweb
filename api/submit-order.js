let liveOrdersCache = [];
let productStockStatus = {
  "80_robux": "In Stock",
  "400_robux": "In Stock",
  "800_robux": "In Stock",
  "1700_robux": "In Stock",
  "4500_robux": "In Stock",
  "10000_robux": "In Stock"
};

// Default values set internally on server-side memory
let productPrices = {
  "80_robux": "70",
  "400_robux": "350",
  "800_robux": "700",
  "1700_robux": "1450",
  "4500_robux": "3800",
  "10000_robux": "8300"
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
      stock: productStockStatus,
      prices: productPrices // Automatically broadcasting active server prices
    });
  }

  if (req.method === 'POST') {
    try {
      const { type, user, email, product, price, prodId, status } = req.body;

      if (type === 'update_stock') {
        // Checking if the incoming call is a sync request for direct price modification
        if (prodId.endsWith('_price_sync')) {
          const actualProdKey = prodId.replace('_price_sync', '');
          productPrices[actualProdKey] = status; // Overwriting the price state on runtime memory

          await fetch(DISCORD_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              embeds: [{
                title: "💰 PRICE UPDATE NOTICE",
                description: `Product **${actualProdKey.replace('_', ' ').toUpperCase()}** price was updated to **৳${status}**.`,
                color: 16761035,
                timestamp: new Date().toISOString()
              }]
            })
          });
          return res.status(200).json({ success: true, stock: productStockStatus, prices: productPrices });
        }

        // Standard operational logic for stock status flow
        productStockStatus[prodId] = status;

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
        return res.status(200).json({ success: true, stock: productStockStatus, prices: productPrices });
      }

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
      return res.status(500).json({ success: false, error: 'Webhook pipeline failure' });
    }
  }

  return res.status(405).json({ success: false, error: 'Method non-operational' });
}
