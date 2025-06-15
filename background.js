// Initialize wallpapers and index on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(['wallpapers', 'currentIndex'], (data) => {
    if (!data.wallpapers) {
      chrome.storage.local.set({ wallpapers: [], currentIndex: 0 });
    }
  });

  // Set up alarm for wallpaper rotation every 5 minutes
  chrome.alarms.create('wallpaperRotate', { periodInMinutes: 5 });
});

// Listen for alarm to rotate wallpaper index
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'wallpaperRotate') {
    chrome.storage.local.get(['wallpapers', 'currentIndex'], (data) => {
      const wallpapers = data.wallpapers || [];
      let currentIndex = data.currentIndex || 0;

      if (wallpapers.length === 0) return;

      currentIndex = (currentIndex + 1) % wallpapers.length;

      chrome.storage.local.set({ currentIndex });
    });
  }
});
