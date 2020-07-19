const oldRedditHostname = "old.reddit.com"
const oldReddit = "https://" + oldRedditHostname;
const excludedPaths = [
  "/gallery",
  "/poll",
  "/rpan",
  "/settings",
  "/topics"
];

chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    const url = new URL(details.url);

    if (url.hostname === oldRedditHostname) {
      return;
    }

    for (const path of excludedPaths) {
      if (url.pathname.startsWith(path)) {
        return;
      }
    }

    return {
      redirectUrl: oldReddit + url.pathname + url.search + url.hash
    };
  },
  {
    urls: [
      "*://reddit.com/*",
      "*://www.reddit.com/*",
      "*://np.reddit.com/*",
      "*://new.reddit.com/*",
      "*://amp.reddit.com/*",
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
