const oldReddit = "https://old.reddit.com";
var disabled = false;

// Redirect requests
chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    // Check if disabled
    if(disabled)  {
      return;
    }

    // Exclude poll pages
    if (/^https?:\/\/(www\.)*reddit.com\/poll/.test(details.url)) {
      return;
    }

    return {
      redirectUrl:
        oldReddit + details.url.match(/^https?:\/\/[^\/]+([\S\s]*)/)[1]
    };
  },
  {
    urls: [
      "*://reddit.com/*",
      "*://www.reddit.com/*",
      "*://np.reddit.com/*",
      "*://new.reddit.com/*",
    ],
    types: [
      "main_frame",
      "sub_frame",
      "stylesheet",
      "script",
      "image",
      "object",
      "xmlhttprequest",
      "other"
    ]
  },
  ["blocking"]
);

// Browser Action
chrome.browserAction.onClicked.addListener(() => {
  disabled = !disabled;

  // Set icon and name
  if(disabled)  {
    chrome.browserAction.setIcon({"path": {"48": "img/disabledicon48.png", "128": "img/disabledicon128.png"}});
    chrome.browserAction.setTitle({"title": "Old Reddit Redirect (Disabled)"});
  } else {
    chrome.browserAction.setIcon({"path": {"48": "img/icon48.png", "128": "img/icon128.png"}});
    chrome.browserAction.setTitle({"title": "Old Reddit Redirect (Enabled)"});
  }
});