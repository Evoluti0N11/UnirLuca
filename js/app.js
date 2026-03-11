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
  // Always start from homepage — stats are shown there
  state.currentView = 'home';
  state.showHomepage = true;
  renderApp();

  // Register Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
      .then(r => {
        console.log('SW registered:', r.scope);
        scheduleReminderNotification();
      })
      .catch(e => console.warn('SW error:', e));
  } else {
    scheduleReminderNotification();
  }
};

/**
 * Asks for notification permission (once), then fires a "you've been away"
 * notification via the Service Worker if Sara hasn't studied in ≥2 days.
 */
const scheduleReminderNotification = async () => {
  if (!('Notification' in window)) return;

  // Request permission on first visit (browser shows prompt only once)
  let permission = Notification.permission;
  if (permission === 'default') {
    permission = await Notification.requestPermission();
  }
  if (permission !== 'granted') return;

  // Avoid firing more than once per calendar day
  const NOW_KEY  = 'sara_last_notification_day';
  const DATE_KEY = 'sara_last_lesson_date';
  const todayStr = new Date().toDateString();
  if (localStorage.getItem(NOW_KEY) === todayStr) return;

  // Record the date of the most recent lesson completion (set once, updated on progress)
  if (state.completedDays.length > 0 && !localStorage.getItem(DATE_KEY)) {
    localStorage.setItem(DATE_KEY, new Date().toISOString());
  }

  const saved = localStorage.getItem(DATE_KEY);
  if (!saved) return; // Never completed a lesson yet — no nag needed

  const daysSince = Math.floor((Date.now() - new Date(saved).getTime()) / 86400000);
  if (daysSince < 2) return; // Still fresh — no reminder

  const messages = [
    { title: '🌸 Annyeong, Sara!',       body: `Sono ${daysSince} giorni che non studi — i tuoi Hangul ti mancano! 화이팅!` },
    { title: '🔥 Il tuo streak si spegne!', body: `Hai già completato ${state.completedDays.length} lezioni — non fermarti ora!` },
    { title: '📚 La Corea ti aspetta!',    body: `Anche solo 10 minuti oggi fanno la differenza. Andiamo! 🇰🇷` },
    { title: '😿 I tuoi Hangul sono tristi...', body: `Torna a studiare — la Corea non si impara da sola! 한국어 화이팅!` },
  ];
  const msg = messages[daysSince % messages.length];

  // Use SW to show notification (works even when the tab is in background)
  try {
    if ('serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.ready;
      await reg.showNotification(msg.title, {
        body:      msg.body,
        icon:      './icons/icon-192.png',
        badge:     './icons/icon-192.png',
        tag:       'sara-reminder',
        renotify:  true,
        vibrate:   [200, 100, 200],
        data:      { url: location.href },
      });
    } else {
      // Fallback: plain Notification API
      new Notification(msg.title, { body: msg.body, icon: './icons/icon-192.png' });
    }
    localStorage.setItem(NOW_KEY, todayStr);
  } catch (e) {
    console.warn('Notification error:', e);
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
