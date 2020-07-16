const oldReddit = "https://old.reddit.com";
const excludedSubdomains = [
  "blog.reddit.com",
  "mod.reddit.com",
  "oauth.reddit.com",
  "out.reddit.com"];
const excludedPaths = [
  "/chat",
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
    
    if (excludedSubdomains.indexOf(urlParser.hostname) != -1) return;
    
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
