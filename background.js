let tabHistory = [];
let currentIndex = -1;

chrome.tabs.onActivated.addListener((activeInfo) => {
    const windowId = activeInfo.windowId;
    const tabId = activeInfo.tabId;

    const currentHistory = tabHistory[currentIndex];
    if (currentHistory == undefined || (currentHistory["windowId"] !== windowId || currentHistory["tabId"] !== tabId)) {
        currentIndex++;
        tabHistory = tabHistory.slice(0, currentIndex);
        tabHistory.push({
            "windowId": windowId,
            "tabId": tabId,
        });
    }
});

chrome.commands.onCommand.addListener((command) => {
    if (command === "go-back-tab") {
        if (currentIndex > 0) {
            currentIndex--;
            const windowId = tabHistory[currentIndex]["windowId"];
            const tabId = tabHistory[currentIndex]["tabId"];
            moveTab(windowId, tabId);
        }
    } else if (command === "go-forward-tab") {
        if (currentIndex < tabHistory.length - 1) {
            currentIndex++;
            const windowId = tabHistory[currentIndex]["windowId"];
            const tabId = tabHistory[currentIndex]["tabId"];
            moveTab(windowId, tabId);
        }
    }
});

function moveTab(windowId, tabId) {
    chrome.windows.update(windowId, { focused: true }).then(() => {
        chrome.tabs.update(tabId, { active: true }).then(() => { }).catch(() => {
            console.log("not found tabId " + tabId);
        });
    }).catch(() => {
        console.log("not found windowId " + windowId);
    });
}
