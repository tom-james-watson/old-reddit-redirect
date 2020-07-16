const oldReddit = "https://old.reddit.com";

chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    let urlParser = document.createElement("a");
    urlParser.href = details.url;
    
    if (urlParser.hostname == "old.reddit.com") return;
    
    return {redirectUrl: oldReddit + urlParser.pathname};
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
