// Keep the shared UI's browser API and synchronous response handlers working in Chrome.
const messageListeners = new Map();
const browser = {
  storage: chrome.storage,
  tabs: chrome.tabs,
  runtime: {
    sendMessage: (...args) => chrome.runtime.sendMessage(...args),
    openOptionsPage: () => chrome.runtime.openOptionsPage(),
    onMessage: {
      addListener(listener) {
        const wrapped = (message, sender, respond) => {
          const result = listener(message, sender);
          if (result !== undefined) respond(result);
          return false;
        };
        messageListeners.set(listener, wrapped);
        chrome.runtime.onMessage.addListener(wrapped);
      },
      removeListener(listener) {
        const wrapped = messageListeners.get(listener);
        if (wrapped) chrome.runtime.onMessage.removeListener(wrapped);
        messageListeners.delete(listener);
      }
    }
  }
};
