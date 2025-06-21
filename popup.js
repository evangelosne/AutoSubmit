let countdownInterval = null;

document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get('regTime', (data) => {
    if (data.regTime) {
      const regTime = data.regTime;
      if (regTime > Date.now()) {
        document.getElementById('regTime').style.display = 'none';
        document.getElementById('setTime').style.display = 'none';
        document.getElementById('resetTime').style.display = 'block';
        startCountdown(regTime);
      }
    }
  });
});

document.getElementById('setTime').addEventListener('click', () => {
  const inputVal = document.getElementById('regTime').value;

  if (!inputVal) {
    alert("Please pick a registration time.");
    return;
  }

  const regTime = new Date(inputVal).getTime();
  if (isNaN(regTime)) {
    alert("Invalid registration time.");
    return;
  }

  chrome.storage.local.set({ regTime });
  chrome.runtime.sendMessage({ action: "setAlarm", time: regTime });
  chrome.runtime.sendMessage({ action: "goToCheckout" }); // << NEW line here!

  alert("Registration time set!");

  document.getElementById('regTime').style.display = 'none';
  document.getElementById('setTime').style.display = 'none';
  document.getElementById('resetTime').style.display = 'block';

  startCountdown(regTime);
});

document.getElementById('resetTime').addEventListener('click', () => {
  chrome.storage.local.remove('regTime');
  chrome.runtime.sendMessage({ action: "clearAlarm" });
  clearInterval(countdownInterval);

  document.getElementById('regTime').style.display = 'block';
  document.getElementById('setTime').style.display = 'block';
  document.getElementById('resetTime').style.display = 'none';
  document.getElementById('countdown').innerText = '';
});

function startCountdown(regTime) {
  const countdownDiv = document.getElementById('countdown');

  function updateCountdown() {
    const now = Date.now();
    const diff = regTime - now;

    if (diff <= 0) {
      countdownDiv.innerText = "It's registration time!";
      clearInterval(countdownInterval);
      return;
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    countdownDiv.innerText = `Time left: ${hours}h ${minutes}m ${seconds}s`;
  }

  updateCountdown();
  countdownInterval = setInterval(updateCountdown, 1000);
}
