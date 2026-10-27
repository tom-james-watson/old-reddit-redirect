const api = globalThis.browser ?? globalThis.chrome;

const rulesetId = "ruleset_1";
const newRulesetId = "new_reddit";

const icons = (state) => ({
    16: `img/icon16${state}.png`,
    32: `img/icon32${state}.png`,
    48: `img/icon48${state}.png`,
    64: `img/icon64${state}.png`,
    96: `img/icon96${state}.png`,
    128: `img/icon128${state}.png`,
});

const isEnabled = async () => {
    const rulesets = await api.declarativeNetRequest.getEnabledRulesets();
    return rulesets.includes(rulesetId);
};

// One-time migration from 3.0.x. Keep cookie permission for this cleanup;
// normal operation no longer reads, sets, or restores cookies.
const removeLegacyOptOutCookie = async () => {
    for (const { id: storeId } of await api.cookies.getAllCookieStores()) {
        try {
            const details = {
                url: "https://www.reddit.com/",
                name: "redesign_optout",
                storeId,
            };
            const cookie = await api.cookies.get(details);
            if (cookie?.value === "true" && cookie.domain === ".reddit.com") {
                await api.cookies.remove(details);
            }
        } catch (e) {
            console.warn("failed to remove legacy opt-out cookie", e);
        }
    }
};

const setMode = async (enabled) => {
    await api.declarativeNetRequest.updateEnabledRulesets({
        enableRulesetIds: [enabled ? rulesetId : newRulesetId],
        disableRulesetIds: [enabled ? newRulesetId : rulesetId],
    });
    await api.storage.local.set({ oldReddit: enabled });
};

const showState = async (enabled) => {
    await api.action.setBadgeText({ text: "" });
    await api.action.setIcon({ path: icons(enabled ? "" : "-off") });
    await api.action.setTitle({
        title: enabled ? "Switch to new Reddit" : "Switch to old Reddit",
    });
};

const sync = async () => {
    const { oldReddit: enabled = true } =
        await api.storage.local.get("oldReddit");
    // Static ruleset state resets on extension updates. Restore our saved mode.
    await setMode(enabled);
    await showState(enabled);
};

const isRedditTab = (tab) => {
    if (!tab?.id || !tab.url) {
        return false;
    }

    try {
        const { hostname } = new URL(tab.url);
        return [
            "reddit.com",
            "www.reddit.com",
            "old.reddit.com",
            "new.reddit.com",
            "sh.reddit.com",
            "np.reddit.com",
            "m.reddit.com",
            "amp.reddit.com",
            "i.reddit.com",
        ].includes(hostname);
    } catch (e) {
        console.error("failed to process tab url", e);
        return false;
    }
};

api.action.onClicked.addListener(async (tab) => {
    const enabled = await isEnabled();

    await setMode(!enabled);
    await showState(!enabled);

    if (isRedditTab(tab)) {
        try {
            await api.tabs.reload(tab.id);
        } catch (e) {
            console.warn("failed to switch Reddit tab", e);
        }
    }
});

api.runtime.onInstalled.addListener(async (details) => {
    if (
        details.reason === "update" &&
        details.previousVersion?.startsWith("3.0.")
    ) {
        try {
            await removeLegacyOptOutCookie();
        } catch (e) {
            console.warn("failed to clean up legacy opt-out cookies", e);
        }
    }
    await sync();
});

api.runtime.onStartup.addListener(sync);
