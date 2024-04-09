styleRedirect = "old"
const styleRedirectId = "style-reddit-redirect"
const styleRedirectData = {
    "old": {
        "title": "Old classic style",
        "url": "https://old.reddit.com",
        "hostname": "old.reddit.com"
    },
    "boxy":{
        "title": "\"New\" boxy style",
        "url": "https://new.reddit.com",
        "hostname": "new.reddit.com"
    }
}
enableRedirect = true
const enableRedirectId = "enable-reddit-redirect"
const enableRedirectData = {
  true: {
    "title": "Redirect enabled",
    "icons": {
      48: "img/icon48.png",
      128: "img/icon128.png"
    }
  },
  false: {
    "title": "Redirect disabled",
    "icons": {
      48: "img/icon48-off.png",
      128: "img/icon128-off.png"
    }
  }
}
const excludedPaths = [
  /^\/media/,
  /^\/poll/,
  /^\/rpan/,
  /^\/settings/,
  /^\/topics/,
  /^\/community-points/,
  /^\/r\/[a-zA-Z0-9_]+\/s\/.*/, // eg https://reddit.com/r/comics/s/TjDGhcl22d
  /^\/appeals?/,
  /\/r\/.*\/s\//,
  /\.json$/,
  /\.rss$/,
];

chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    const url = new URL(details.url);

    if (url.hostname === styleRedirectData[styleRedirect]["hostname"] || !enableRedirect) return;

    for (const path of excludedPaths) {
      if (path.test(url.pathname)) return;
    }

    if (url.pathname.indexOf("/gallery") === 0) {
      return {
        redirectUrl:
        styleRedirectData[styleRedirect]["url"] + "/comments" + url.pathname.slice("/gallery".length),
      };
    }

    return { redirectUrl: styleRedirectData[styleRedirect]["url"] + url.pathname + url.search + url.hash };
  },
  {
    urls: [
      "*://reddit.com/*",
      "*://www.reddit.com/*",
      "*://np.reddit.com/*",
      "*://amp.reddit.com/*",
      "*://i.reddit.com/*",
    ],
    types: [
      "main_frame",
      "sub_frame",
      "stylesheet",
      "script",
      "image",
      "object",
      "xmlhttprequest",
      "other",
    ],
  },
  ["blocking"],
);

// Prevent reddit from rendering raw image URLs as HTML
chrome.webRequest.onBeforeSendHeaders.addListener(
  function (details) {
    const url = new URL(details.url);

    const imageUrlHostnames = ["preview.redd.it", "i.redd.it"];

    for (const hostname of imageUrlHostnames) {
      if (url.hostname === hostname) {
        const headers = details.requestHeaders.filter(
          (h) => h.name.toLowerCase() !== "accept",
        );
        return { requestHeaders: headers };
      }
    }
  },
  {
    urls: ["*://i.redd.it/*", "*://preview.redd.it/*"],
    types: [
      "main_frame",
      "sub_frame",
      "stylesheet",
      "script",
      "image",
      "object",
      "xmlhttprequest",
      "other",
    ],
  },
  ["blocking", "requestHeaders"],
);

chrome.contextMenus.create({
    id: styleRedirectId,
    title: "style-redirect",
    contexts: ["action"]
  }, () => chrome.runtime.lastError);

function updateStyleRedirect(value){
  chrome.contextMenus.update(styleRedirectId, {title: styleRedirectData[value]["title"]});
}

chrome.storage.local.get("styleRedirect", function(items){
    value = items["styleRedirect"];
    if (value != undefined) {
      styleRedirect = value;
    }
    updateStyleRedirect(styleRedirect)
  });
  
chrome.contextMenus.onClicked.addListener(function (info, tab) {
  if (info.menuItemId === styleRedirectId) {
    if (styleRedirect == "old") {
        styleRedirect = "boxy";
    } else {
        styleRedirect = "old";
    }
    updateStyleRedirect(styleRedirect);
    chrome.storage.local.set({"styleRedirect": styleRedirect}, function(){});
  }
})

chrome.contextMenus.create({
  id: enableRedirectId,
  title: "enable-redirect",
  contexts: ["action"]
}, () => chrome.runtime.lastError);

function updateEnableRedirect(value){
  chrome.contextMenus.update(enableRedirectId, {title: enableRedirectData[value]["title"]});
  chrome.browserAction.setIcon({path: enableRedirectData[value]["icons"]});
}
updateEnableRedirect(enableRedirect);

chrome.contextMenus.onClicked.addListener(function (info, tab) {
  if (info.menuItemId === enableRedirectId) {
    enableRedirect = !enableRedirect;
    updateEnableRedirect(enableRedirect);
  }
})
