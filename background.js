const oldReddit = "https://old.reddit.com"
const excludedSubdomains = ["blog.reddit.com", "oauth.reddit.com", "out.reddit.com"];

chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    var urlParser = document.createElement("a");
    urlParser.href = details.url;
    
    //redirect to old.reddit.com
    if (urlParser.hostname != "old.reddit.com" && excludedSubdomains.indexOf(urlParser.hostname) == -1)
      return {redirectUrl: oldReddit + details.url.match(/^https?:\/\/[^\/]+([\S\s]*)/)[1]};
    
    //redirect /user/* and /user/*/ to /user/*/overview
    var pathname = urlParser.pathname;
    if (pathname.match(/\/user\/[\w-]+\/?$/)) {
      var tail = "overview";
      if (pathname.lastIndexOf("/") != pathname.length - 1) tail = "/" + tail;
        
      return {redirectUrl: urlParser.origin + urlParser.pathname + tail + urlParser.search};
    }
  },
  {
    urls: [
      "*://reddit.com/*",
      "*://*.reddit.com/*"
    ],
    types: ["main_frame", "sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest", "other"]
  },
  ["blocking"]
)