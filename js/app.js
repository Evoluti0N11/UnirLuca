/* ===== app.js — Entry point & boot ===== */
'use strict';

import { state, loadProgress } from './modules/state.js';
import { renderApp } from './modules/renderer.js';

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
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then(r => console.log('SW registered:', r.scope))
        .catch(e => console.warn('SW error:', e));
    });
  }
};

document.addEventListener('DOMContentLoaded', initApp);
