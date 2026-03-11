/* ===== timer.js — WOTD countdown timer (Rome timezone) ===== */
'use strict';

import { state } from './state.js';
import { formatTime, getRomeSecondsUntilMidnight } from './utils.js';
import { renderApp } from './renderer.js';

export const startWotdTimer = () => {
  if (state.wotdTimerInterval) clearInterval(state.wotdTimerInterval);
  state.wotdTimeLeft = getRomeSecondsUntilMidnight();

  state.wotdTimerInterval = setInterval(() => {
    state.wotdTimeLeft = Math.max(0, state.wotdTimeLeft - 1);
    const el = document.getElementById('wotd-timer');
    if (el) {
      el.textContent = formatTime(state.wotdTimeLeft);
      const bar = document.getElementById('wotd-timer-bar');
      if (bar) bar.style.width = `${(state.wotdTimeLeft / 86400) * 100}%`;
    }
    if (state.wotdTimeLeft === 0) {
      clearInterval(state.wotdTimerInterval);
      state.wotdIndex = Math.floor(Date.now() / 86400000) % (window.WOTD_POOL || []).length;
      renderApp();
    }
  }, 1000);
};
