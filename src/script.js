chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if (msg.text === 'return_DOM') {
    sendResponse(document.all[0].outerHTML);
  }
});