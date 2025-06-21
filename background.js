chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "setAlarm") {
    const delayInMinutes = Math.max(0, (message.time - Date.now()) / 60000);
    chrome.alarms.create("autoSubmit", { delayInMinutes });
    console.log(`Alarm set for ${delayInMinutes} minutes from now.`);
  } else if (message.action === "clearAlarm") {
    chrome.alarms.clear("autoSubmit");
    console.log("Alarm cleared.");
  } else if (message.action === "goToCheckout") {  // << NEW block here
    chrome.tabs.query({ url: "*://webreg.usc.edu/*" }, (tabs) => {
      tabs.forEach(tab => {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: () => {
            const isCheckoutPage = window.location.pathname.includes("/Checkout");
            if (!isCheckoutPage) {
              const checkoutLink = document.getElementById('mItReg');
              if (checkoutLink) {
                checkoutLink.click();
                console.log("Navigated to Checkout after Set Registration.");
              } else {
                console.log("Checkout link not found.");
              }
            } else {
              console.log("Already on Checkout page.");
            }
          }
        });
      });
    });
  }
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "autoSubmit") {
    chrome.tabs.query({ url: "*://webreg.usc.edu/*" }, (tabs) => {
      tabs.forEach(tab => {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: () => {
            const isCheckoutPage = window.location.pathname.includes("/Checkout");

            if (isCheckoutPage) {
              const submitButton = document.getElementById('SubmitButton');
              if (submitButton) {
                submitButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
                console.log("Already on Checkout. Clicked SubmitButton.");
              } else {
                console.log("SubmitButton not found on Checkout page.");
              }
            } else {
              const checkoutLink = document.getElementById('mItReg');
              if (checkoutLink) {
                checkoutLink.click();
                console.log("Navigated to Checkout page.");

                setTimeout(() => {
                  const submitButtonAfterNav = document.getElementById('SubmitButton');
                  if (submitButtonAfterNav) {
                    submitButtonAfterNav.dispatchEvent(new MouseEvent('click', { bubbles: true }));
                    console.log("Clicked SubmitButton after navigation.");
                  } else {
                    console.log("SubmitButton not found after navigation.");
                  }
                }, 3000); // wait 3 seconds after navigating
              } else {
                console.log("Checkout link not found.");
              }
            }
          }
        });

        chrome.tabs.sendMessage(tab.id, { action: "showBanner" });
      });
    });
  }
});
