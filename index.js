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
    
    console.log("Session Authorized:", userData.email);
  } catch (error) {
    console.error("Auth Failed:", error);
  }
}

// Modal & Navigation Functions
function openModal() {
  document.getElementById('login-modal').classList.remove('hidden');
}

function closeModalAndAllowGuest() {
  document.getElementById('login-modal').classList.add('hidden');
}

function handleGameClick(filename) {
  if (!isLoggedIn) {
    openModal();
  } else {
    window.location.href = filename;
  }
}

function smoothScrollTo(id) {
  const element = document.getElementById(id);
  if(element) element.scrollIntoView({ behavior: 'smooth' });
}

function showStorefrontView() {
  document.getElementById('main-site')?.classList.remove('hidden');
  document.getElementById('standalone-page')?.classList.add('hidden');
}

// Dynamic Data Loader (Jab tumhara backend ready ho)
async function loadProducts() {
  const grid = document.getElementById('main-grid');
  if (!grid) return;
  
  try {
    // Ye tab kaam karega jab tumhari API ready hogi
    // const res = await fetch('/api/home');
    // const data = await res.json();
    console.log("Loading products...");
  } catch (e) {
    console.log("Waiting for API...");
  }
}

// Initialize
loadProducts();
