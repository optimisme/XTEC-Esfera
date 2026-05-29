const extensionApi = globalThis.browser || globalThis.chrome;

extensionApi.action.onClicked.addListener(async (tab) => {
  if (!tab.id) {
    return;
  }

  await extensionApi.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["content.js"]
  });

  await extensionApi.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => window.dispatchEvent(new Event("xtec-esfera-open-summary"))
  });
});
