const oldReddit = "https://old.reddit.com";
const excludedPaths = [
  "/gallery",
  "/poll",
  "/rpan",
  "/settings",
  "/topics"];

chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    const urlParser = document.createElement("a");
    urlParser.href = details.url;
    
    if (urlParser.hostname == "old.reddit.com") return;
    
    for (const path of excludedPaths) {
      if (urlParser.pathname.indexOf(path) == 0) return;
    }
    
    return {redirectUrl: oldReddit + urlParser.pathname + urlParser.search + urlParser.hash};
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
