# Old Reddit Redirect

> [!NOTE]  
> If you're wondering why the extension recently requested new permissions, please see https://github.com/tom-james-watson/old-reddit-redirect/issues/117

[Chrome extension](https://chrome.google.com/webstore/detail/old-reddit-redirect/dneaehbmnbhcippjikoajpoabadpodje)

[Firefox extension](https://addons.mozilla.org/firefox/addon/old-reddit-redirect)

Dislike Reddit's redesign? Old Reddit Redirect will ensure that you always load the old (old.reddit.com) design instead.

Will force all reddit.com usage to old.reddit.com. Will work when navigating to the site, opening links, using old bookmarks. Works regardless of whether you are logged in or not, and in incognito mode.

Also has a new minor fixes and quality of life improvements like:

- Removing the undismissable cookie banner
- Rewriting links to galleries to the raw old reddit comments page

#### Redirected domains

- `reddit.com`
- `www.reddit.com`
- `np.reddit.com`
- `amp.reddit.com`
- `i.reddit.com`
- `i.redd.it`
- `preview.redd.it`

#### Whitelisted domains

- `sh.reddit.com`

## Development

> [!NOTE]  
> There are currently two separate versions of this extension - manifest V2 and manifest V3.
> Chrome is phasing out manifest V2, so we're forced to migrate to to avoid the extension getting removed. However, the V3 version currently doesn't seem compatible with Firefox, so V2 will be hanging around for a while.
> TL;DR: Chrome = V3, Firefox = V2

Ensure you have [`node`](https://nodejs.org/en) installed. Then run `make run` to start the live-reloading development server. This will open a browser window with the extension installed for testing.

Once you've verified things are working correctly locally you can fork this repo and submit a pull request with your changes.

## License

Code copyright Tom Watson. Code released under [the MIT license](LICENSE.txt).
