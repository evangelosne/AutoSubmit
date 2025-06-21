// ========== Part 1: Listen for "showBanner" message from background.js ==========

chrome.runtime.onMessage.addListener((request) => {
  if (request.action === "showBanner") {
    showSuccessBanner();
  }
});

function showSuccessBanner() {
  const banner = document.createElement('div');
  banner.innerText = "✅ Submit Clicked! You’re registered.";
  banner.style.position = 'fixed';
  banner.style.top = '20px';
  banner.style.left = '50%';
  banner.style.transform = 'translateX(-50%)';
  banner.style.backgroundColor = '#4CAF50';
  banner.style.color = 'white';
  banner.style.padding = '15px 30px';
  banner.style.borderRadius = '8px';
  banner.style.fontSize = '16px';
  banner.style.zIndex = '9999';
  banner.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';

  document.body.appendChild(banner);

  setTimeout(() => {
    banner.remove();
  }, 5000);
}

// ========== Part 2: Auto-refresh the WebReg page every 20 minutes ==========

const REFRESH_INTERVAL = 20 * 60 * 1000; // 20 minutes in milliseconds

setInterval(() => {
  console.log("Refreshing WebReg page to prevent logout due to inactivity...");
  window.location.reload();
}, REFRESH_INTERVAL);
