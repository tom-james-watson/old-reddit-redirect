# Old Reddit Redirect

[Chrome extension](https://chrome.google.com/webstore/detail/old-reddit-redirect/dneaehbmnbhcippjikoajpoabadpodje)

[Firefox extension](https://addons.mozilla.org/firefox/addon/old-reddit-redirect)

Dislike Reddit's redesign? Old Reddit Redirect will ensure that you always load the old design instead.

Will redirect reddit.com usage to old.reddit.com. Works when navigating to the site, opening links, using old bookmarks, and in incognito mode.

Click the extension's icon to switch between old.reddit.com and www.reddit.com.

Also has a few minor fixes and quality of life improvements like:

- Removing the undismissable cookie banner and the "Get New Reddit" button
- Rewriting links to galleries to the raw old reddit comments page
- Allowing image URLs to be viewed as raw image files

#### Redirected domains

- `reddit.com`
- `www.reddit.com`
- `np.reddit.com`
- `amp.reddit.com`
- `i.reddit.com`
- `m.reddit.com`
- `new.reddit.com`
- `sh.reddit.com`

Pages that need new Reddit, such as settings, modmail, polls, and shared-link landing pages, are excluded from old Reddit redirects.

## Development

Ensure you have [`node`](https://nodejs.org/en) installed. Then run `make run` to start the live-reloading development server. This will open a browser window with the extension installed for testing.

Once you've verified things are working correctly locally you can fork this repo and submit a pull request with your changes.

## License

Code copyright Tom Watson. Code released under [the MIT license](LICENSE.txt).
