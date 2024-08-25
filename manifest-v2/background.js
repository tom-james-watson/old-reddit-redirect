const oldReddit = "https://old.reddit.com";
const excludedPaths = [
  /^\/media/,
  /^\/mod/,
  /^\/poll/,
  /^\/rpan/,
  /^\/settings/,
  /^\/topics/,
  /^\/community-points/,
  /^\/r\/[a-zA-Z0-9_]+\/s\/.*/, // eg https://reddit.com/r/comics/s/TjDGhcl22d
  /^\/appeals?/,
  /\/r\/.*\/s\//,
];

chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    const url = new URL(details.url);

    if (url.hostname === "old.reddit.com") return;

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
