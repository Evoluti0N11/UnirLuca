/* ===== views/home.js — Homepage / splash screen ===== */
'use strict';

import { state } from '../modules/state.js';

const getGreeting = () => {
  const saved = localStorage.getItem('sara_last_lesson_date');
  const daysSince = saved
    ? Math.floor((Date.now() - new Date(saved).getTime()) / 86400000)
    : null;
  const n = state.completedDays.length;

  if (n === 0) return { emoji: '🌸', text: 'Inizia il tuo viaggio in Corea!' };
  if (daysSince === null || daysSince === 0) return { emoji: '🚀', text: 'Pronta per la prossima lezione?' };
  if (daysSince === 1) return { emoji: '✨', text: 'Bentornata! Sei in forma?' };
  if (daysSince <= 3) return { emoji: '😊', text: `Sono ${daysSince} giorni — ripartiamo insieme!` };
  if (daysSince <= 7) return { emoji: '😅', text: `${daysSince} giorni senza Hangul… la Corea sente la tua mancanza!` };
  return { emoji: '😿', text: `${daysSince} giorni! I tuoi Hangul ti aspettano — 화이팅!` };
};

export const renderHome = () => {
  const { emoji, text } = getGreeting();
  const n = state.completedDays.length;
  return `
  <div class="min-h-screen korea-pattern hero-gradient relative overflow-hidden flex flex-col items-center justify-center text-white p-6">
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-10 left-5 text-8xl opacity-10 font-black" style="font-family:'Noto Sans KR'">한</div>
      <div class="absolute bottom-10 right-5 text-8xl opacity-10 font-black" style="font-family:'Noto Sans KR'">국</div>
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[200px] opacity-5 font-black" style="font-family:'Noto Sans KR'">어</div>
    </div>

    <div class="relative z-10 text-center max-w-sm mx-auto animate-pop">
      <div class="mb-6">
        <div class="avatar-ring w-28 h-28 mx-auto">
          <div class="w-full h-full rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-5xl border-4 border-white/30">${n === 0 ? '🌸' : emoji}</div>
        </div>
      </div>

      <p class="text-pink-200 text-sm font-black uppercase tracking-widest mb-2">Annyeong!</p>
      <h1 class="text-4xl font-black mb-2 leading-tight">Ciao, <span class="text-yellow-300">${state.profileName}</span>! 👋</h1>

      <p class="text-white/90 font-bold mb-5 text-sm px-2">${text}</p>

      <div class="flex gap-3 mb-8 justify-center">
        ${[
          { val: n,            label: 'Lezioni',   icon: '📖' },
          { val: state.streak, label: 'Streak',    icon: '🔥' },
          { val: state.xp,     label: 'XP',        icon: '⚡' },
        ].map(({ val, label, icon }) => `
          <div class="bg-white/15 backdrop-blur-sm rounded-2xl p-3 text-center border border-white/20 flex-1">
            <div class="text-lg mb-0.5">${icon}</div>
            <div class="text-2xl font-black text-yellow-300">${val}</div>
            <div class="text-[10px] uppercase tracking-wider opacity-80">${label}</div>
          </div>`).join('')}
      </div>

      ${n > 0 ? `
      <div class="mb-5">
        <div class="flex justify-between text-xs text-white/60 mb-1.5">
          <span>Progresso totale</span>
          <span>${n}/45 lezioni</span>
        </div>
        <div class="w-full bg-white/20 rounded-full h-2.5">
          <div class="bg-gradient-to-r from-yellow-300 to-pink-300 h-2.5 rounded-full transition-all" style="width:${Math.round(n/45*100)}%"></div>
        </div>
      </div>` : ''}

      <button onclick="window.enterApp()"
        class="w-full bg-white text-pink-600 py-4 rounded-2xl font-black text-lg shadow-2xl shadow-black/20 hover:scale-105 transition-transform flex items-center justify-center gap-3 outline-none">
        ${n === 0 ? '🌸 Inizia il Percorso' : '🚀 Continua il Percorso'}
        <i data-lucide="arrow-right" class="w-5 h-5"></i>
      </button>

      <p class="mt-4 text-white/50 text-xs">Personalizzato per te • Basato sulle tue passioni</p>

      <div class="flex flex-wrap gap-2 justify-center mt-4">
        ${['💪 Gym', '🎮 LoL', '🎭 Cosplay', '📺 K-Drama', '🐾 Animali'].map(p =>
          `<span class="bg-white/10 border border-white/20 text-white/80 px-3 py-1 rounded-full text-xs font-bold">${p}</span>`
        ).join('')}
      </div>
    </div>
  </div>`;
};
