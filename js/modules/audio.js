/* ===== audio.js — Speech synthesis & recognition ===== */
'use strict';

import { showToast } from './utils.js';
import { state } from './state.js';

// Avoid circular import — renderApp is registered on window by app.js boot
const renderApp = () => window._renderApp && window._renderApp();

let speechTimeout = null;

export const playAudio = (e, text) => {
  if (e) { e.stopPropagation(); e.preventDefault(); }
  if (!text || !window.speechSynthesis) {
    showToast('Audio non supportato dal browser.', true);
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ko-KR';
  utterance.rate = 0.85;
  utterance.pitch = 1.0;

  const trySpeak = () => {
    const voices = window.speechSynthesis.getVoices();
    const koVoices = voices.filter(v => v.lang.startsWith('ko'));
    if (koVoices.length > 0) {
      let best = koVoices.find(v => /Google.*Korean|Korean.*Google/i.test(v.name));
      if (!best) best = koVoices.find(v => /Yuna|Somi|Female|여성/i.test(v.name));
      if (!best) best = koVoices[0];
      utterance.voice = best;
    }
    window.speechSynthesis.speak(utterance);
  };

  window.speechSynthesis.getVoices().length === 0
    ? (window.speechSynthesis.onvoiceschanged = trySpeak)
    : trySpeak();
};

export const handleSpeechRecognition = (e) => {
  if (e) e.preventDefault();
  if (state.selectedAnswer !== null || state.isRecording) return;
  window.haptic(50);
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) { triggerSpeechFallback(); return; }

  const recognition = new SR();
  recognition.lang = 'ko-KR';
  recognition.interimResults = false;
  recognition.maxAlternatives = 3;
  recognition.continuous = false;
  state.isRecording = true;
  renderApp();

  speechTimeout = setTimeout(() => {
    if (state.isRecording) { recognition.stop(); triggerSpeechFallback(); }
  }, 8000);

  recognition.onresult = (event) => {
    clearTimeout(speechTimeout);
    state.isRecording = false;
    const ex = window.COURSE_DATA.find(d => d.day === state.activeDay).exercises[state.gameStep];
    let isMatch = false;
    for (let r = 0; r < event.results[0].length; r++) {
      const raw = event.results[0][r].transcript.toLowerCase().trim();
      const clean = raw.replace(/[.,!?。、！？\s~]/g, '');
      if (ex.expectedHangul.some(k => clean.includes(k.replace(/\s/g, '')))) { isMatch = true; break; }
      if (ex.expectedRomaji.some(r2 => clean.includes(r2.replace(/\s/g, '')))) { isMatch = true; break; }
    }
    const rawTranscript = event.results[0][0].transcript;
    state.selectedAnswer = isMatch;
    state.showFeedback = true;
    if (isMatch) { state.score++; state.combo++; window.haptic([30, 50, 30]); }
    else {
      state.combo = 0;
      ex.feedback_incorrect = `Hai detto: "${rawTranscript}". Non ti ho capito bene, riprova scandendo ogni sillaba!`;
      state.currentMistakes.push(ex.conceptTag);
      window.haptic(100);
    }
    renderApp();
  };

  recognition.onerror = (ev) => {
    clearTimeout(speechTimeout);
    state.isRecording = false;
    if (ev.error === 'not-allowed') showToast('Accesso al microfono negato.', true);
    else triggerSpeechFallback();
  };

  recognition.onend = () => {
    if (state.isRecording) { state.isRecording = false; triggerSpeechFallback(); }
  };

  recognition.start();
};

export const triggerSpeechFallback = () => {
  window.haptic();
  if (speechTimeout) clearTimeout(speechTimeout);
  state.isRecording = false;
  state.fallbackActive = true;
  const ex = window.COURSE_DATA.find(d => d.day === state.activeDay).exercises[state.gameStep];
  const correct = ex.expectedRomaji[0];
  const opt1 = correct.replace(/[aeiou]/g, m => ({ a: 'e', e: 'i', i: 'o', o: 'u', u: 'a' })[m] || m);
  const opt2 = correct.replace(/k|g|t|d|p|b/g, m => ({ k: 'g', g: 'k', t: 'd', d: 't', p: 'b', b: 'p' })[m] || m);
  state.fallbackOptions = [correct, opt1, opt2].sort(() => Math.random() - 0.5);
  renderApp();
};

// Expose globally for inline handlers
window.playAudio = playAudio;
window.handleSpeechRecognition = handleSpeechRecognition;
window.triggerSpeechFallback = triggerSpeechFallback;
