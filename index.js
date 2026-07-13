// Configuration
const BIN_ID = "Yahan-Apni-JSONBin-ID-Daalo";
const API_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}/latest`;

// Game Catalog Fetching
async function loadCatalog() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        const games = data.record.games; // Tumhare JSON structure ke hisab se
        
        const container = document.getElementById('game-topup-section');
        // Yahan tum logic likhoge jo grid elements generate karega
    } catch (err) {
        console.error("Data Load Error:", err);
    }
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    loadCatalog();
});
