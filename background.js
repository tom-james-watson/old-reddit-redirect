const oldReddit = "https://old.reddit.com";
const excludedPaths = [
  "/poll",
  "/rpan",
  "/settings",
  "/topics",
  "/community-points",
];

chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    const url = new URL(details.url);

    if (url.hostname === "old.reddit.com") return;

    for (const path of excludedPaths) {
      if (url.pathname.indexOf(path) === 0) return;
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
  ["blocking"]
);

chrome.webRequest.onBeforeSendHeaders.addListener(
  function (details) {
    const url = new URL(details.url);

    if (url.hostname === "i.redd.it") {
      const headers = details.requestHeaders.filter(h => h.name.toLowerCase() !== "accept");
      return { requestHeaders: headers };
    }
  },
  {
    urls: [
      "*://i.redd.it/*",
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
  [
    "blocking",
    "requestHeaders",
  ]
);
