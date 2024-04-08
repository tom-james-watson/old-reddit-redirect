enableRedirect = true
const toggleRedirectId = "toggle-reddit-redirect"
const oldReddit = "https://old.reddit.com";
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
];
const toggleRedirectData = {
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

chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    const url = new URL(details.url);

    if (url.hostname === "old.reddit.com" || !enableRedirect) return;

    for (const path of excludedPaths) {
      if (path.test(url.pathname)) return;
    }

    if (url.pathname.indexOf("/gallery") === 0) {
      return {
        redirectUrl:
          oldReddit + "/comments" + url.pathname.slice("/gallery".length),
      };
    }

    return { redirectUrl: oldReddit + url.pathname + url.search + url.hash };
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
  id: toggleRedirectId,
  title: "toggle-redirect",
  contexts: ["action"]
}, () => chrome.runtime.lastError);

function updateRedirect(value){
  data = toggleRedirectData[value]
  chrome.contextMenus.update(toggleRedirectId, {title: data["title"]});
  chrome.browserAction.setIcon({path: data["icons"]});
}
updateRedirect(enableRedirect);

chrome.contextMenus.onClicked.addListener(function (info, tab) {
  if (info.menuItemId === toggleRedirectId) {
    enableRedirect = !enableRedirect;
    updateRedirect(enableRedirect);
  }
})
