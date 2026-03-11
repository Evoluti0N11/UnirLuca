/* ===== actions.js — All user-driven state mutations ===== */
'use strict';

import { state, saveProgress, computeStreak, computeXP, checkNewBadges } from './state.js';
import { renderApp } from './renderer.js';
import { renderDictContent } from '../views/library.js';
import { haptic, showToast } from './utils.js';
import { handleSpeechRecognition, triggerSpeechFallback, playAudio } from './audio.js';

/* ---- Navigation ---- */
window.changeView = (view) => {
  haptic(20);
  state.isTransitioning = true;
  renderApp();
  setTimeout(() => {
    state.currentView = view;
    state.isTransitioning = false;
    renderApp();
  }, 250);
};

window.startDay = (dayNum) => {
  haptic(40);
  state.isTransitioning = true;
  renderApp();
  setTimeout(() => {
    state.activeDay = dayNum;
    state.currentView = 'theory';
    state.gameStep = 0; state.score = 0; state.combo = 0;
    state.selectedAnswer = null; state.showFeedback = false;
    state.fallbackActive = false; state.currentMistakes = [];
    state.builderSelectedWords = [];
    state.builderAvailableWords = [];
    state.isTransitioning = false;
    renderApp();
  }, 250);
};

window.startGame = () => {
  state.isTransitioning = true;
  renderApp();
  setTimeout(() => {
    state.currentView = 'game';
    state.isTransitioning = false;
    renderApp();
  }, 250);
};

window.enterApp = () => {
  state.showHomepage = false;
  state.currentView = 'dashboard';
  saveProgress();
  renderApp();
};

/* ---- Exercise handlers ---- */
window.handleMultipleChoiceAnswer = (index) => {
  if (state.showFeedback) return;
  const ex = window.COURSE_DATA.find(d => d.day === state.activeDay).exercises[state.gameStep];
  if (ex.optionsHangul?.[index]) playAudio(null, ex.optionsHangul[index]);
  state.selectedAnswer = index;
  state.showFeedback = true;
  if (index === ex.answer) {
    state.score++; state.combo++;
    haptic([30, 50, 30]);
    if (state.combo >= 3) showToast(`🔥 Combo x${state.combo}!`);
  } else {
    state.combo = 0;
    state.currentMistakes.push(ex.conceptTag);
    haptic(100);
  }
  renderApp();
};

window.handleFallbackAnswer = (index) => {
  if (state.showFeedback) return;
  const ex = window.COURSE_DATA.find(d => d.day === state.activeDay).exercises[state.gameStep];
  const correct = ex.expectedRomaji[0];
  const isCorrect = state.fallbackOptions[index] === correct;
  if (isCorrect) {
    playAudio(null, ex.expectedHangul[0]);
    state.selectedAnswer = true; state.score++; state.combo++;
    state.showFeedback = true;
    haptic([30, 50, 30]);
    ex._fb = 'Ottima scelta! Ascolta come si pronuncia correttamente.';
  } else {
    state.selectedAnswer = false; state.combo = 0;
    state.currentMistakes.push(ex.conceptTag);
    state.showFeedback = true;
    haptic(100);
    ex._fb = `Quella non era la pronuncia esatta. La romanizzazione corretta era: "${correct}". Ascoltala bene!`;
  }
  renderApp();
};

window.handleSpeechRecognition = handleSpeechRecognition;
window.triggerSpeechFallback = triggerSpeechFallback;

/* ---- Sentence builder ---- */
window.handleBuilderClick = (index, fromPool) => {
  if (state.showFeedback) return;
  haptic(15);
  if (fromPool) {
    const word = state.builderAvailableWords[index];
    if (word !== null) {
      state.builderSelectedWords.push({ word, originalIndex: index });
      state.builderAvailableWords[index] = null;
    }
  } else {
    const item = state.builderSelectedWords[index];
    state.builderAvailableWords[item.originalIndex] = item.word;
    state.builderSelectedWords.splice(index, 1);
  }
  renderApp();
};

window.checkBuilderAnswer = () => {
  if (state.showFeedback) return;
  const ex = window.COURSE_DATA.find(d => d.day === state.activeDay).exercises[state.gameStep];
  const userSentence = state.builderSelectedWords.map(i => i.word).join(' ');
  const correctSentence = ex.correct_order.join(' ');
  state.selectedAnswer = (userSentence === correctSentence);
  state.showFeedback = true;
  if (state.selectedAnswer) {
    state.score++; state.combo++;
    haptic([30, 50, 30]);
    if (state.combo >= 3) showToast(`🔥 Combo x${state.combo}!`);
  } else {
    state.combo = 0;
    state.currentMistakes.push(ex.conceptTag);
    haptic(100);
  }
  renderApp();
};

/* ---- Progress / lesson completion ---- */
window.nextQuestion = () => {
  haptic(20);
  const lesson = window.COURSE_DATA.find(d => d.day === state.activeDay);
  if (state.gameStep >= lesson.exercises.length - 1) {
    const prevDays = [...state.completedDays];
    if (!state.completedDays.includes(state.activeDay)) {
      state.completedDays.push(state.activeDay);
      state.completedDays.sort((a, b) => a - b);
    }
    if (state.currentMistakes.length > 0) state.mistakesRecord[state.activeDay] = state.currentMistakes;
    else delete state.mistakesRecord[state.activeDay];

    state.streak = computeStreak(state.completedDays);
    state.xp = computeXP(state.completedDays, state.mistakesRecord);

    const newUnlocks = (window.MAP_REGIONS || []).filter(r =>
      state.completedDays.includes(r.unlocksAtDay) && !prevDays.includes(r.unlocksAtDay)
    );
    state.newlyUnlockedLocation = newUnlocks[0] || null;

    const newBadges = checkNewBadges();
    saveProgress();
    state.currentView = 'result';
    state.isTransitioning = false;
    renderApp();
    if (newBadges.length > 0) {
      setTimeout(() => {
        newBadges.forEach((b, i) => setTimeout(() => showToast(`${b.icon} Badge sbloccato: ${b.name}!`, false, true), i * 1500));
      }, 1000);
    }
  } else {
    state.gameStep++;
    state.selectedAnswer = null;
    state.showFeedback = false;
    state.fallbackActive = false;
    state.builderSelectedWords = [];
    state.builderAvailableWords = [];
    renderApp();
  }
};

/* ---- Translator ---- */
window.runTranslation = async () => {
  haptic();
  const inputEl = document.getElementById('transInput');
  if (!inputEl?.value.trim()) return;
  const text = inputEl.value.trim();
  state.transLoading = true;
  state.transResult = 'Traducendo...';
  state.transRomaji = '';
  renderApp();
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=ko&dt=t&dt=rm&q=${encodeURIComponent(text)}`;
    const res = await fetch(url);
    const data = await res.json();
    let koText = '', romajiText = '';
    if (data?.[0]) {
      data[0].forEach(item => {
        if (item[0] && typeof item[0] === 'string' && item[0] !== 'null') koText += item[0];
        if (item[2] && typeof item[2] === 'string') romajiText += item[2];
        else if (item[3] && typeof item[3] === 'string') romajiText += item[3];
      });
      if (!romajiText && data[0].length > 1) {
        const last = data[0][data[0].length - 1];
        if (last && typeof last[2] === 'string') romajiText = last[2];
      }
      state.transResult = koText || 'Impossibile tradurre.';
      state.transRomaji = romajiText.trim();
    }
  } catch {
    state.transResult = 'Errore di rete. Riprova.';
    showToast('Errore di rete durante la traduzione.', true);
  }
  state.transLoading = false;
  renderApp();
};

/* ---- Dictionary ---- */
window.updateDictSearch = (val) => {
  state.dictSearch = val;
  renderDictContent();
};

window.updateDictCategory = (val) => {
  state.dictCategory = val;
  document.querySelectorAll('.dict-cat-btn').forEach(btn => {
    btn.className = btn.dataset.cat === val
      ? 'dict-cat-btn shrink-0 px-3 py-1.5 rounded-full text-xs font-black transition-all outline-none bg-pink-500 text-white shadow-md'
      : 'dict-cat-btn shrink-0 px-3 py-1.5 rounded-full text-xs font-black transition-all outline-none bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-600';
  });
  renderDictContent();
};

/* ---- Settings / Profile ---- */
window.toggleDarkMode = () => {
  state.isDarkMode = !state.isDarkMode;
  document.documentElement.classList.toggle('dark', state.isDarkMode);
  saveProgress();
  renderApp();
};

window.updateProfileName = (val) => {
  state.profileName = val || 'Sara';
  saveProgress();
};

window.updateHangulSize = (val) => {
  state.hangulScale = parseFloat(val);
  document.documentElement.style.setProperty('--hangul-scale', state.hangulScale);
  saveProgress();
};

window.handleSwitchAccount = () => {
  if (!confirm(`Sei sicura di voler resettare tutto il progresso di ${state.profileName}? Questa azione è irreversibile!`)) return;
  state.completedDays = [];
  state.mistakesRecord = {};
  state.unlockedBadges = [];
  state.streak = 0; state.xp = 0;
  saveProgress();
  showToast('Progresso resettato.', false, true);
  renderApp();
};

/* ---- Swipe navigation ---- */
let touchStartX = 0, touchStartY = 0;
window.handleTouchStart = (e) => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
};
window.handleTouchEnd = (e) => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  const dy = e.changedTouches[0].clientY - touchStartY;
  if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 60) {
    const views = ['dashboard', 'explore', 'library', 'profile'];
    const idx = views.indexOf(state.currentView);
    if (dx < 0 && idx < views.length - 1) window.changeView(views[idx + 1]);
    else if (dx > 0 && idx > 0) window.changeView(views[idx - 1]);
  }
};
