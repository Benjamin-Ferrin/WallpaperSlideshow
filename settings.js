document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('input');
  const intervalInput = document.getElementById('interval');
  const shuffleToggle = document.getElementById('shuffleToggle');
  const saveButton = document.getElementById('saveButton');
  const status = document.getElementById('status');

  let imageUrls = [];

  input.addEventListener('change', (e) => {
    const files = [...e.target.files];
    imageUrls = [];

    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        imageUrls.push(url);
      }
    });

    status.textContent = `Loaded ${imageUrls.length} images, but not saved yet. Click Save to apply.`;
  });

  saveButton.addEventListener('click', () => {
    if (imageUrls.length === 0) {
      status.textContent = "No wallpapers selected.";
      return;
    }
    const intervalVal = parseInt(intervalInput.value, 10);
    if (isNaN(intervalVal) || intervalVal < 5) {
      status.textContent = "Interval must be a number >= 5 seconds.";
      return;
    }

    chrome.storage.local.set({
      wallpapers: imageUrls,
      interval: intervalVal,
      shuffle: shuffleToggle.checked,
      currentIndex: 0
    }, () => {
      status.textContent = `Saved ${imageUrls.length} wallpapers with interval ${intervalVal} seconds.`;
    });
  });

  // Load saved settings on open
  chrome.storage.local.get(['interval', 'shuffle'], (data) => {
    if (data.interval) intervalInput.value = data.interval;
    if (data.shuffle) shuffleToggle.checked = data.shuffle;
  });
});
