const BIN_ID = "6a5511e3f5f4af5e29895352"; 

async function loadDynamicContent() {
    try {
        const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`);
        const data = await response.json();

        // 1. Load Topups
        const topupGrid = document.querySelector('#game-topup-section .grid');
        topupGrid.innerHTML = data.record.topups.map(item => `
            <div onclick="handleGameClick('${item.link}')" class="bg-[#131b2e] rounded-xl overflow-hidden border border-gray-800 relative hover:scale-[1.03] transition-all group cursor-pointer">
                <span class="absolute top-2 left-2 bg-red-600 text-[10px] font-black px-1.5 py-0.5 rounded z-10">${item.discount}</span>
                <div class="h-44 bg-[#1e293b] bg-cover bg-center" style="background-image: url('${item.image}');"></div>
                <div class="p-3 text-center"><h3 class="text-xs font-bold truncate text-gray-200 group-hover:text-cyan-400">${item.name}</h3></div>
            </div>
        `).join('');

        // 2. Load Subscriptions
        const subGrid = document.querySelector('#subscription-section .grid');
        subGrid.innerHTML = data.record.subs.map(item => `
            <div onclick="handleGameClick('${item.link}')" class="bg-[#131b2e] rounded-xl overflow-hidden border border-gray-800 hover:scale-[1.03] transition-all group cursor-pointer">
                <div class="h-44 bg-[#1e293b] bg-cover bg-center" style="background-image: url('${item.image}');"></div>
                <div class="p-3 text-center"><h3 class="text-xs font-bold text-gray-200 group-hover:text-cyan-400">${item.name}</h3></div>
            </div>
        `).join('');

    } catch (e) {
        console.error("Content load failed:", e);
    }
}

document.addEventListener('DOMContentLoaded', loadDynamicContent);
