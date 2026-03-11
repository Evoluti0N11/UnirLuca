/* ===== utils.js — Shared helpers ===== */
'use strict';

export const renderHangul = (text) => {
  if (!text) return text;
  return text.replace(/([\u3131-\uD79D]+)/g, match =>
    `<span class="korean-click hangul-display" onclick="window.playAudio(event,'${match}')" role="button" aria-label="Ascolta ${match}">${match}</span>`
  );
};

export const haptic = (pattern) => {
  if ('vibrate' in navigator) {
    Array.isArray(pattern) ? navigator.vibrate(pattern) : navigator.vibrate(pattern || 10);
  }
};

export const showToast = (msg, isError = false, isSuccess = false) => {
  document.querySelector('.toast')?.remove();
  const toast = document.createElement('div');
  const bg = isError ? 'bg-red-500' : isSuccess ? 'bg-green-500' : 'bg-gray-800';
  const icon = isError ? '⚠️' : isSuccess ? '✅' : 'ℹ️';
  toast.className = `toast ${bg} text-white`;
  toast.innerHTML = `<span>${icon}</span><span>${msg}</span>`;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translate(-50%, -20px)';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
};

export const formatTime = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

export const getRomeSecondsUntilMidnight = () => {
  const now = new Date();
  const rome = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Rome' }));
  const midnight = new Date(rome);
  midnight.setHours(24, 0, 0, 0);
  return Math.round((midnight - rome) / 1000);
};

export const detectFormality = (text) => {
  if (!text) return null;
  if (/습니다|십니다|이십니다|하십니다/.test(text)) return 'formal';
  if (/아요|어요|예요|이에요|해요/.test(text)) return 'polite';
  if (/야|아|어|해|지|나|라/.test(text)) return 'informal';
  return 'neutral';
};

// Expose globally for inline onclick handlers
window.renderHangul = renderHangul;
window.haptic = haptic;
window.showToast = showToast;
