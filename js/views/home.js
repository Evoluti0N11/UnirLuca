/* ===== views/home.js — Homepage / splash screen ===== */
'use strict';

import { state } from '../modules/state.js';

export const renderHome = () => `
  <div class="min-h-screen korea-pattern hero-gradient relative overflow-hidden flex flex-col items-center justify-center text-white p-6">
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-10 left-5 text-8xl opacity-10 font-black" style="font-family:'Noto Sans KR'">한</div>
      <div class="absolute bottom-10 right-5 text-8xl opacity-10 font-black" style="font-family:'Noto Sans KR'">국</div>
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[200px] opacity-5 font-black" style="font-family:'Noto Sans KR'">어</div>
    </div>

    <div class="relative z-10 text-center max-w-sm mx-auto animate-pop">
      <div class="mb-6">
        <div class="avatar-ring w-28 h-28 mx-auto">
          <div class="w-full h-full rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-5xl border-4 border-white/30">🌸</div>
        </div>
      </div>

      <p class="text-pink-200 text-sm font-black uppercase tracking-widest mb-2">Annyeong!</p>
      <h1 class="text-4xl font-black mb-2 leading-tight">Ciao, <span class="text-yellow-300">${state.profileName}</span>! 👋</h1>
      <p class="text-white/80 font-bold mb-2">Il tuo percorso per parlare</p>
      <div class="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30 mb-6">
        <span style="font-family:'Noto Sans KR'" class="text-xl font-black">한국어</span>
        <span class="text-white/70 text-sm">in 45 giorni</span>
      </div>

      <div class="flex gap-3 mb-8 justify-center">
        ${[
          { val: state.completedDays.length, label: 'Giorni' },
          { val: state.streak, label: 'Streak 🔥' },
          { val: state.xp, label: 'XP ⚡' },
        ].map(({ val, label }) => `
          <div class="bg-white/15 backdrop-blur-sm rounded-2xl p-3 text-center border border-white/20 flex-1">
            <div class="text-2xl font-black text-yellow-300">${val}</div>
            <div class="text-[10px] uppercase tracking-wider opacity-80">${label}</div>
          </div>`).join('')}
      </div>

      <button onclick="window.enterApp()"
        class="w-full bg-white text-pink-600 py-4 rounded-2xl font-black text-lg shadow-2xl shadow-black/20 hover:scale-105 transition-transform flex items-center justify-center gap-3 outline-none">
        ${state.completedDays.length > 0 ? '🚀 Continua il Percorso' : '🌸 Inizia il Percorso'}
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
