/* ===== views/explore.js — Korea Tour map view ===== */
'use strict';

import { state } from '../modules/state.js';

export const renderExplore = () => {
  const unlockedCount = (window.MAP_REGIONS || []).filter(r => state.completedDays.includes(r.unlocksAtDay)).length;
  const nextToUnlock = (window.MAP_REGIONS || []).find(r => !state.completedDays.includes(r.unlocksAtDay));
  const total = (window.MAP_REGIONS || []).length;

  return `
  <div class="max-w-5xl mx-auto animate-pop">
    <div class="bg-white dark:bg-slate-800 rounded-2xl md:rounded-[2rem] p-6 md:p-10 mb-6 korean-shadow border border-blue-50 dark:border-slate-700 text-center relative overflow-hidden">
      <div class="absolute inset-0 pointer-events-none" style="background:radial-gradient(circle at 50% 0%, rgba(244,114,182,0.08), transparent 70%)"></div>
      <h1 class="text-2xl md:text-4xl font-black text-gray-900 dark:text-white mb-2 flex justify-center items-center gap-3">
        <i data-lucide="map" class="w-8 h-8 text-blue-500"></i> Korea Tour 🇰🇷
      </h1>
      <p class="text-gray-500 dark:text-gray-400 text-sm md:text-base font-bold mb-5">Esplora le location. Completa le lezioni per sbloccare nuove destinazioni!</p>
      <div class="bg-gray-50 dark:bg-slate-750 rounded-2xl p-4 border border-gray-100 dark:border-slate-700">
        <div class="flex justify-between items-center mb-2">
          <span class="text-xs font-black text-gray-600 dark:text-gray-400 uppercase tracking-widest">Location Sbloccate</span>
          <span class="text-sm font-black text-pink-500">${unlockedCount} / ${total}</span>
        </div>
        <div class="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden mb-2">
          <div class="bg-gradient-to-r from-pink-400 to-blue-400 h-full rounded-full transition-all duration-1000" style="width:${(unlockedCount / (total || 1)) * 100}%"></div>
        </div>
        <div class="flex gap-1 flex-wrap justify-center mt-2">
          ${(window.MAP_REGIONS || []).map(r => `
            <span class="text-lg ${state.completedDays.includes(r.unlocksAtDay) ? '' : 'grayscale opacity-30'}" title="${r.name}">${r.icon}</span>`).join('')}
        </div>
        ${nextToUnlock
          ? `<p class="text-[10px] font-bold text-gray-400 dark:text-gray-500 mt-2">Prossimo sblocco: <strong class="text-pink-500">${nextToUnlock.name}</strong> al Giorno ${nextToUnlock.unlocksAtDay}</p>`
          : `<p class="text-[10px] font-bold text-green-600 mt-2">🎉 Tutte le location sbloccate!</p>`}
      </div>
    </div>

    <!-- Map -->
    <div class="w-full h-[380px] md:h-[550px] rounded-2xl md:rounded-[2rem] shadow-xl border-4 border-white dark:border-slate-700 mb-8 relative overflow-hidden bg-gray-100 flex items-center justify-center">
      <div id="korea-map" class="absolute inset-0 z-10"></div>
      <i data-lucide="loader-2" class="animate-spin w-8 h-8 text-gray-400 absolute z-0"></i>
    </div>

    <!-- Location Cards -->
    <div class="location-cards-grid">
      ${(window.MAP_REGIONS || []).map(region => {
        const isUnlocked = state.completedDays.includes(region.unlocksAtDay);
        return `
          <div class="location-card ${isUnlocked ? '' : 'locked'} ${region.isAnimal ? 'animal-location-card' : ''}">
            <div class="h-40 relative w-full overflow-hidden bg-gray-200 dark:bg-slate-700">
              ${isUnlocked
                ? `<img src="${region.image}" alt="${region.name}" class="w-full h-full object-cover transition-transform duration-700 hover:scale-105" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=400'" />`
                : `<div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 dark:from-slate-700 dark:to-slate-600"><i data-lucide="lock" class="w-10 h-10 text-gray-400 dark:text-slate-500"></i></div>`}
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
              <span class="absolute bottom-3 left-3 text-3xl">${region.icon}</span>
              ${!isUnlocked ? `<div class="absolute top-2 right-2 bg-black/60 text-white text-[10px] font-black px-2 py-1 rounded-full">🔒 Giorno ${region.unlocksAtDay}</div>` : ''}
            </div>
            <div class="p-4 flex-1 flex flex-col">
              <h2 class="text-lg font-black text-gray-800 dark:text-gray-200 mb-2">${region.name}</h2>
              ${!isUnlocked
                ? `<div class="flex-1 flex items-center justify-center">
                     <div class="bg-gray-50 dark:bg-slate-750 border border-gray-200 dark:border-slate-600 rounded-xl p-4 text-center w-full">
                       <p class="text-sm font-bold text-gray-500 dark:text-gray-400">Completa il <strong class="text-pink-500">Giorno ${region.unlocksAtDay}</strong> per sbloccare!</p>
                       <button onclick="window.changeView('dashboard')" class="mt-2 text-xs font-black text-pink-500 underline outline-none">Vai alle Lezioni →</button>
                     </div>
                   </div>`
                : `<p class="text-gray-600 dark:text-gray-400 text-sm font-bold mb-3 flex-1">${region.desc}</p>
                   ${region.phrases ? `
                   <div class="bg-pink-50 dark:bg-pink-900/20 border border-pink-100 dark:border-pink-800 rounded-xl p-3 mb-3">
                     <p class="text-[10px] font-black text-pink-500 uppercase tracking-widest mb-2">🗣️ Frasi Utili</p>
                     ${region.phrases.map(ph => `
                       <div class="flex items-center justify-between gap-2 mb-1.5">
                         <div>
                           <p class="text-sm font-black text-gray-800 dark:text-gray-200" style="font-family:'Noto Sans KR'">${ph.hangul}</p>
                           <p class="text-[10px] text-blue-500 font-bold">${ph.romaji} — <span class="text-gray-500 dark:text-gray-400">${ph.eng}</span></p>
                         </div>
                         <button onclick="window.playAudio(event,'${ph.hangul}')" class="shrink-0 w-8 h-8 bg-white dark:bg-slate-700 border border-pink-200 dark:border-pink-700 text-pink-500 rounded-full flex items-center justify-center text-xs shadow-sm">🔊</button>
                       </div>`).join('<hr class="border-pink-100 dark:border-pink-900 my-1">')}
                   </div>` : ''}
                   <div class="flex flex-wrap gap-1.5">
                     ${region.keywords.map(kw => `<span class="badge badge-blue text-[10px]">${kw}</span>`).join('')}
                   </div>`}
            </div>
          </div>`;
      }).join('')}
    </div>
  </div>`;
};
