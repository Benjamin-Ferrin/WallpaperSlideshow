document.addEventListener('DOMContentLoaded', () => {
  const wallpaperImg = document.getElementById('wallpaper');
  let wallpapers = [];
  let currentIndex = 0;

  // Load wallpapers & index from storage and update image
  function loadWallpapers() {
    chrome.storage.local.get(['wallpapers', 'currentIndex'], (data) => {
      wallpapers = Array.isArray(data.wallpapers) ? data.wallpapers : [];
      currentIndex = typeof data.currentIndex === 'number' ? data.currentIndex : 0;

      if (wallpapers.length === 0) {
        wallpaperImg.src = 'default.jpg';
        console.log('No wallpapers found, using default.');
        return;
      }

      if (currentIndex >= wallpapers.length) currentIndex = 0;

      wallpaperImg.src = wallpapers[currentIndex];
      console.log(`Loaded wallpaper index ${currentIndex}`);
    });
  }

  // Rotate wallpaper
  function rotateWallpaper() {
    if (wallpapers.length === 0) return;
    currentIndex = (currentIndex + 1) % wallpapers.length;
    wallpaperImg.src = wallpapers[currentIndex];
    chrome.storage.local.set({ currentIndex });
    console.log(`Rotated to wallpaper index ${currentIndex}`);
  }

  // Setup alarms to rotate every 1 minute
  chrome.alarms.create('wallpaperRotate', { periodInMinutes: 1 });

  chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'wallpaperRotate') {
      rotateWallpaper();
    }
  });

  // Watch for wallpaper changes from other parts of extension
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && changes.wallpapers) {
      wallpapers = Array.isArray(changes.wallpapers.newValue) ? changes.wallpapers.newValue : [];
      currentIndex = 0;
      wallpaperImg.src = wallpapers.length > 0 ? wallpapers[0] : 'default.jpg';
      console.log('Wallpapers updated from storage changes.');
    }
  });

  // Handle image load error
  wallpaperImg.addEventListener('error', () => {
    console.error('Failed to load wallpaper. Falling back to default.');
    wallpaperImg.src = 'default.jpg';
  });

  // Buttons
  document.getElementById('dailyEventBtn').addEventListener('click', () => {
    alert('Daily event placeholder - implement your logic here.');
  });

  document.getElementById('sharePageBtn').addEventListener('click', () => {
    if (navigator.share) {
      navigator.share({
        title: 'Check out this awesome new tab!',
        url: window.location.href,
      }).catch(console.error);
    } else {
      alert('Sharing not supported on this browser.');
    }
  });

  // Shortcut clicks and keyboard accessibility
  document.querySelectorAll('.shortcut').forEach(elem => {
    elem.addEventListener('click', () => {
      const urlMap = {
        'YouTube': 'https://www.youtube.com',
        'Gmail': 'https://mail.google.com',
        'ChatGPT': 'https://chat.openai.com'
      };
      const url = urlMap[elem.title];
      if (url) window.open(url, '_blank');
    });
    elem.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        elem.click();
      }
    });
  });

  // Initial load
  loadWallpapers();
});
