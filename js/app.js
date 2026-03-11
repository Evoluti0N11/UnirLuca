/* ===== app.js — Entry point & boot ===== */
'use strict';

import { state, loadProgress } from './modules/state.js';
import { renderApp } from './modules/renderer.js';

// Expose renderApp globally so audio.js / other modules can call it without circular imports
window._renderApp = renderApp;

// Import all action handlers (side-effect: registers window.*)
import './modules/actions.js';
// Import audio (registers window.playAudio etc.)
import './modules/audio.js';
// Import map (registers window.initMap)
import './modules/map.js';

const initApp = () => {
  loadProgress();
  if (state.completedDays.length > 0 || !state.showHomepage) {
    state.showHomepage = false;
    state.currentView = 'dashboard';
  }
  renderApp();

  // Register Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
      .then(r => console.log('SW registered:', r.scope))
      .catch(e => console.warn('SW error:', e));
  }
};

// Wait for COURSE_DATA (set by data.js) to be available before booting.
// data.js is a classic script so it runs synchronously before DOMContentLoaded,
// but on some browsers/servers the module can race ahead — poll to be safe.
const waitForData = () => {
  if (window.COURSE_DATA && window.COURSE_DATA.length > 0) {
    initApp();
  } else {
    setTimeout(waitForData, 20);
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', waitForData);
} else {
  waitForData();
}
