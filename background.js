const oldReddit = "http://old.reddit.com"

chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    return {redirectUrl: oldReddit + details.url.match(/^https?:\/\/[^\/]+([\S\s]*)/)[1]}
  },
  {
    urls: [
      "*://reddit.com/*",
      "*://www.reddit.com/*",
      "*://np.reddit.com/*"
    ],
    types: ["main_frame", "sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest", "other"]
  },
  ["blocking"]
)
