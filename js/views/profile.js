/* ===== views/profile.js — User profile, stats, badges ===== */
'use strict';

import { state, getXPLevel } from '../modules/state.js';

export const renderProfile = () => {
  const xpData = getXPLevel(state.xp);
  const earnedBadges = (window.BADGES || []).filter(b => state.unlockedBadges.includes(b.id));

  const skills = [
    { label: 'Basi & Saluti', pct: Math.min(state.completedDays.filter(d => d <= 5).length * 20, 100), color: 'bg-pink-500' },
    { label: 'Vita Quotidiana', pct: Math.min(state.completedDays.filter(d => d > 5 && d <= 15).length * 10, 100), color: 'bg-blue-500' },
    { label: 'Passioni & Hobby', pct: Math.min(state.completedDays.filter(d => d > 15 && d <= 25).length * 10, 100), color: 'bg-green-500' },
    { label: 'Avanzato', pct: Math.min(state.completedDays.filter(d => d > 25).length * 5, 100), color: 'bg-purple-500' },
  ];

  return `
  <div class="max-w-md mx-auto animate-pop">
    <div class="bg-white dark:bg-slate-800 rounded-[2rem] korean-shadow p-6 md:p-10 border border-blue-50 dark:border-slate-700 relative overflow-hidden">
      <div class="hangul-watermark">나</div>

      <div class="avatar-ring w-24 h-24 mx-auto mb-5">
        <div class="w-full h-full rounded-full bg-pink-100 dark:bg-pink-900/40 text-pink-500 flex items-center justify-center border-2 border-white dark:border-slate-800">
          <span class="text-4xl">🌸</span>
        </div>
      </div>

      <h2 class="text-2xl font-black text-gray-900 dark:text-white text-center mb-1">Profilo di Studio</h2>
      <p class="text-gray-500 dark:text-gray-400 text-center font-bold text-sm mb-3">Il tuo viaggio in Corea è al sicuro qui.</p>
      <div class="flex justify-center mb-6">
        <span class="badge badge-gold">${xpData.title} — ${state.xp} XP</span>
      </div>

      <!-- Name -->
      <div class="mb-5">
        <label class="block text-[10px] font-black text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-widest">Nome Studente</label>
        <input type="text" value="${state.profileName}" onchange="window.updateProfileName(this.value)"
          class="w-full border-2 border-gray-200 dark:border-slate-600 rounded-xl p-3 text-lg font-black text-gray-800 dark:text-gray-200 dark:bg-slate-700 focus:border-pink-500 outline-none transition-colors min-h-[50px]" />
      </div>

      <!-- Stats -->
      <div class="bg-gray-900 dark:bg-slate-950 rounded-2xl p-5 mb-5 flex justify-between items-center text-white">
        <div>
          <p class="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">Giorni Completati</p>
          <p class="text-4xl font-black text-pink-400">${state.completedDays.length}</p>
        </div>
        <div class="text-right">
          <p class="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">Streak attivo</p>
          <p class="text-4xl font-black text-orange-400">${state.streak} 🔥</p>
        </div>
      </div>

      <!-- Skills -->
      <div class="bg-gray-50 dark:bg-slate-750 rounded-2xl p-4 mb-5 border border-gray-100 dark:border-slate-700">
        <p class="text-[10px] font-black text-gray-800 dark:text-gray-300 uppercase tracking-widest mb-3 flex items-center gap-2">
          <i data-lucide="bar-chart-2" class="w-4 h-4 text-blue-500"></i> Competenze
        </p>
        ${skills.map(s => `
          <div class="mb-2.5">
            <div class="flex justify-between text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">
              <span>${s.label}</span><span>${s.pct}%</span>
            </div>
            <div class="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-1.5">
              <div class="${s.color} h-1.5 rounded-full" style="width:${s.pct}%"></div>
            </div>
          </div>`).join('')}
      </div>

      <!-- Badges -->
      ${earnedBadges.length > 0 ? `
      <div class="mb-5">
        <p class="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3">🏅 Badge Sbloccati (${earnedBadges.length})</p>
        <div class="flex flex-wrap gap-2">
          ${earnedBadges.map(b => `
            <div class="badge badge-gold text-[11px] badge-pop" title="${b.desc}">${b.icon} ${b.name}</div>`).join('')}
        </div>
      </div>` : ''}

      <!-- Reset -->
      <button onclick="window.handleSwitchAccount()" class="w-full bg-white dark:bg-slate-750 border-2 border-gray-200 dark:border-slate-600 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 hover:text-red-600 text-gray-500 dark:text-gray-400 py-3 rounded-2xl font-black text-sm transition-all flex justify-center items-center gap-2 outline-none">
        <i data-lucide="trash-2" class="w-5 h-5"></i> Resetta Percorso
      </button>
    </div>
  </div>`;
};
