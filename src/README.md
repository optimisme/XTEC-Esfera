# XTEC-Esfera

A Chrome extension that shows a centered overlay with a summary of XTEC-Esfera module grades from the current page.

## Load in Chrome

1. Open `chrome://extensions`.
2. Enable Developer mode.
3. Click Load unpacked.
4. Select the `src` folder.
5. Pin the extension and click it on an XTEC-Esfera grade page.

## Files

- `manifest.json`: Chrome extension metadata and permissions.
- `background.js`: Runs when the extension button is clicked.
- `content.js`: Extracts module data from the page and renders the overlay.
