/* ===== state.js — Central state & persistence ===== */
'use strict';

export const state = {
  builderSelectedWords: [],
  builderAvailableWords: [],
  currentView: 'home',
  activeDay: null,
  gameStep: 0,
  score: 0,
  combo: 0,
  selectedAnswer: null,
  showFeedback: false,
  isRecording: false,
  fallbackActive: false,
  fallbackOptions: [],
  completedDays: [],
  mistakesRecord: {},
  streak: 0,
  xp: 0,
  profileName: 'Sara',
  wotdIndex: null,
  isDarkMode: false,
  hangulScale: 1,
  mapUnlockSeen: [],
  newlyUnlockedLocation: null,
  isTransitioning: false,
  transResult: '',
  transRomaji: '',
  transLoading: false,
  currentMistakes: [],
  dictSearch: '',
  dictCategory: 'all',
  showHomepage: true,
  unlockedBadges: [],
  wotdTimeLeft: 0,
  wotdTimerInterval: null,
};

const SAVE_KEY = 'sara_korean_save_v4';

export const computeStreak = (days) => {
  if (!days?.length) return 0;
  const sorted = [...days].sort((a, b) => a - b);
  let streak = 1;
  for (let i = sorted.length - 1; i > 0; i--) {
    if (sorted[i] === sorted[i - 1] + 1) streak++;
    else break;
  }
  return streak;
};

export const computeXP = (days, mistakes) => {
  let xp = 0;
  days.forEach(d => { xp += (mistakes[d] || []).length === 0 ? 120 : 80; });
  return xp;
};

export const getXPLevel = (xp) => {
  if (xp < 200) return { level: 1, title: '🌱 Principiante', next: 200 };
  if (xp < 500) return { level: 2, title: '🌸 Studente', next: 500 };
  if (xp < 1000) return { level: 3, title: '⚔️ Avventuriera', next: 1000 };
  if (xp < 2000) return { level: 4, title: '🎮 Semi-Pro', next: 2000 };
  if (xp < 3500) return { level: 5, title: '🏆 Esperta', next: 3500 };
  return { level: 6, title: '👑 Campionessa Coreana', next: null };
};

export const checkNewBadges = () => {
  const newBadges = [];
  (window.BADGES || []).forEach(badge => {
    if (!state.unlockedBadges.includes(badge.id) && badge.condition(state)) {
      state.unlockedBadges.push(badge.id);
      newBadges.push(badge);
    }
  });
  return newBadges;
};

export const saveProgress = () => {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify({
      completedDays: state.completedDays,
      mistakesRecord: state.mistakesRecord,
      profileName: state.profileName,
      hangulScale: state.hangulScale,
      mapUnlockSeen: state.mapUnlockSeen,
      isDarkMode: state.isDarkMode,
      unlockedBadges: state.unlockedBadges,
      showHomepage: state.showHomepage,
      version: window.APP_VERSION,
    }));
  } catch (e) { console.warn('Save error', e); }
};

export const loadProgress = () => {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      state.completedDays = data.completedDays || [];
      state.mistakesRecord = data.mistakesRecord || {};
      if (data.profileName) state.profileName = data.profileName;
      if (data.hangulScale) {
        state.hangulScale = data.hangulScale;
        document.documentElement.style.setProperty('--hangul-scale', state.hangulScale);
      }
      state.mapUnlockSeen = data.mapUnlockSeen || [];
      state.isDarkMode = data.isDarkMode || false;
      state.unlockedBadges = data.unlockedBadges || [];
      state.showHomepage = data.showHomepage !== false;
    }
    // Migrate old save keys
    if (!raw) {
      for (const k of ['sara_korean_save_v3', 'sara_korean_save_v2']) {
        const old = localStorage.getItem(k);
        if (old) {
          const d = JSON.parse(old);
          state.completedDays = d.completedDays || [];
          state.mistakesRecord = d.mistakesRecord || {};
          if (d.profileName) state.profileName = d.profileName;
          break;
        }
      }
    }
    state.streak = computeStreak(state.completedDays);
    state.xp = computeXP(state.completedDays, state.mistakesRecord);
    const dayOfYear = Math.floor(Date.now() / 86400000);
    state.wotdIndex = dayOfYear % (window.WOTD_POOL || [1]).length;
    if (state.isDarkMode) document.documentElement.classList.add('dark');
  } catch (e) { console.warn('Load error', e); }
};
