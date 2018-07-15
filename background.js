const oldReddit = "https://old.reddit.com"

chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    return {redirectUrl: oldReddit + details.url.match(/^https?:\/\/[^\/]+([\S\s]*)/)[1]}
  },
  {
    urls: [
      "*://reddit.com/*",
      "*://www.reddit.com/*",
      "*://np.reddit.com/*",
      "*://new.reddit.com/*",
      "*://pay.reddit.com/*"
    ],
    types: ["main_frame", "sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest", "other"]
  },
  ["blocking"]
)
chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    var urlParser = document.createElement("a");
    urlParser.href = details.url;
    var pathname = urlParser.pathname;
    
    //redirect /user/* and /user/*/ to /user/*/overview
    if (pathname.match(/\/user\/[\w-]+\/?$/)) {
      var tail = "overview";
      if (pathname.lastIndexOf("/") != pathname.length - 1) tail = "/" + tail;
        
      return {redirectUrl: details.url + tail};
    }
  },
  {
    urls: [
      "*://reddit.com/user/*",
      "*://old.reddit.com/user/*",
      "*://www.reddit.com/user/*",
      "*://np.reddit.com/user/*",
      "*://new.reddit.com/user/*",
      "*://pay.reddit.com/user/*"
    ],
    types: ["main_frame", "sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest", "other"]
  },
  ["blocking"]
)