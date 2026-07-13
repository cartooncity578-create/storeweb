// Global User Authentication Tracking
let isLoggedIn = false;

// Google Auth Handler
function handleCredentialResponse(response) {
  try {
    const base64Url = response.credential.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => 
      '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    ).join(''));

    const userData = JSON.parse(jsonPayload);
    
    document.getElementById('user-name').innerText = userData.name || 'Gamer';
    if(userData.picture) document.getElementById('user-img').src = userData.picture;

    isLoggedIn = true;
    document.getElementById('negative-signin-btn')?.classList.add('hidden');
    document.getElementById('user-profile-wrapper')?.classList.remove('hidden');
    closeModalAndAllowGuest();
  } catch (error) {
    console.error("Auth Failed:", error);
  }
}

// Modal & Navigation Functions
function openModal() { document.getElementById('login-modal').classList.remove('hidden'); }
function closeModalAndAllowGuest() { document.getElementById('login-modal').classList.add('hidden'); }
function toggleDropdown() { document.getElementById('profile-dropdown')?.classList.toggle('hidden'); }
function smoothScrollTo(id) { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); }
function showStorefrontView() { document.getElementById('main-site')?.classList.remove('hidden'); }

function handleGameClick(filename) {
  if (!isLoggedIn) {
    openModal();
  } else {
    window.location.href = filename;
  }
}

// JSONBin se Data Load karne wala function
async function loadProducts() {
  const grid = document.getElementById('main-grid');
  if (!grid) return;
  
  try {
    const res = await fetch('/api/home');
    const data = await res.json();
    
    grid.innerHTML = ''; // Pehle grid khali karo
    
    if (data.catalog) {
      Object.keys(data.catalog).forEach(key => {
        const item = data.catalog[key];
        grid.innerHTML += `
          <div class="bg-[#0f172a] p-4 border border-gray-800 rounded-xl hover:border-cyan-500 transition cursor-pointer" onclick="handleGameClick('${item.redirect}')">
            <img src="${item.image}" class="w-full h-32 object-cover rounded-lg mb-3">
            <h3 class="font-bold text-sm truncate">${item.name}</h3>
            <p class="text-xs text-cyan-400 uppercase">${item.cat}</p>
          </div>
        `;
      });
    }
  } catch (e) {
    console.error("Data load karne mein error:", e);
  }
}

// Page load hote hi products load karo
loadProducts();
