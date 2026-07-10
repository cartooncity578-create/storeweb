/* shop.js
   Include this on your main site pages where you want products to show:
   <div id="zg-shop"></div>
   <script src="/shop.js"></script>
*/

async function loadShop() {
  const res = await fetch("/data.json?_=" + Date.now());
  const data = await res.json();
  applyTheme(data.settings.theme);
  renderProducts(data.products, data.settings.payment);
}

function applyTheme(theme) {
  const root = document.documentElement.style;
  root.setProperty("--zg-primary", theme.primaryColor);
  root.setProperty("--zg-bg", theme.backgroundColor);
  root.setProperty("--zg-card", theme.cardColor);
  root.setProperty("--zg-text", theme.textColor);
  document.body.style.background = theme.backgroundColor;
  document.body.style.color = theme.textColor;
}

function renderProducts(products, payment) {
  const container = document.getElementById("zg-shop");
  if (!container) return;

  container.innerHTML = products.map((p, idx) => `
    <div class="zg-product" style="background:var(--zg-card); border-radius:12px; padding:16px; margin-bottom:16px; cursor:pointer;"
         onclick="toggleProduct(${idx})">
      <img src="${p.image}" style="width:100%; border-radius:8px; margin-bottom:10px;" />
      <h3 style="margin:0 0 6px;">${p.name}</h3>
      <p style="opacity:0.8; font-size:14px;">${p.description}</p>
      <div id="zg-prices-${idx}" style="display:none; margin-top:10px;">
        ${p.prices.map(pr => `
          <div style="display:flex; justify-content:space-between; padding:6px 0; border-top:1px solid rgba(255,255,255,0.1);">
            <span>${pr.label}</span>
            <strong style="color:var(--zg-primary);">${pr.amount} BDT</strong>
          </div>
        `).join("")}
        <div style="margin-top:10px; font-size:13px; opacity:0.85;">
          <strong>Payment methods:</strong> ${payment.methods.join(", ")}<br/>
          ${payment.note}
        </div>
      </div>
    </div>
  `).join("");
}

function toggleProduct(idx) {
  const el = document.getElementById(`zg-prices-${idx}`);
  el.style.display = el.style.display === "none" ? "block" : "none";
}

loadShop();
