/* ===== views/dashboard.js — Main learning dashboard ===== */
'use strict';

import { state, getXPLevel } from '../modules/state.js';

export const renderDashboard = () => {
  const totalProgress = Math.min((state.completedDays.length / 45) * 100, 100);
  const xpData = getXPLevel(state.xp);
  const xpProgress = xpData.next ? Math.min((state.xp / xpData.next) * 100, 100) : 100;
  const nextDay = (() => { for (let i = 1; i <= 45; i++) if (!state.completedDays.includes(i)) return i; return null; })();
  const wotd = (window.WOTD_POOL || [])[state.wotdIndex ?? 0];

  return `
  <div class="max-w-4xl mx-auto relative">
    <div class="hangul-watermark">가자</div>

    <!-- Hero Header -->
    <header class="bg-gradient-to-br from-pink-400 via-pink-300 to-blue-400 text-white rounded-2xl md:rounded-[2rem] p-6 md:p-10 mb-6 korean-shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden" aria-label="Progresso generale">
      <div class="absolute top-0 right-0 opacity-10 text-[120px] font-black" style="font-family:'Noto Sans KR'">화</div>
      <div class="z-10 w-full">
        <h1 class="text-2xl md:text-4xl font-black mb-2 tracking-tight flex items-center gap-2">
          <span>Studio in Corso</span> <span>🌸</span>
        </h1>
        <p class="text-pink-50 text-sm md:text-base font-bold mb-4">Il tuo percorso per parlare coreano in 45 giorni.</p>
        <div class="w-full max-w-md bg-white/20 h-3 rounded-full overflow-hidden border border-white/30" role="progressbar" aria-valuenow="${Math.round(totalProgress)}" aria-valuemin="0" aria-valuemax="100">
          <div class="bg-white h-full transition-all duration-1000 rounded-full" style="width:${totalProgress}%"></div>
        </div>
        <p class="text-xs font-bold mt-1.5 text-white/80">${Math.round(totalProgress)}% Completato • ${totalProgress === 100 ? '화이팅! 🎉' : 'Forza Sara! ✊'}</p>
      </div>
      <div class="flex gap-2 w-full md:w-auto z-10 shrink-0">
        ${[
          { icon: 'flame', val: `${state.streak} Streak`, color: state.streak > 0 ? 'text-orange-400 animate-pulse' : 'text-white/30' },
          { icon: 'award', val: `${state.completedDays.length}/45`, color: 'text-yellow-300' },
          { icon: 'zap', val: `${state.xp} XP`, color: 'text-yellow-200' },
        ].map(({ icon, val, color }) => `
          <div class="flex-1 md:flex-none flex flex-col items-center bg-white/20 p-3 rounded-2xl border border-white/20 min-w-[70px]">
            <i data-lucide="${icon}" class="${color} w-6 h-6 mb-1"></i>
            <span class="font-black text-xs">${val}</span>
          </div>`).join('')}
      </div>
    </header>

    <!-- XP Level -->
    <div class="bg-white dark:bg-slate-800 rounded-2xl p-4 mb-5 border border-gray-100 dark:border-slate-700 shadow-sm flex items-center gap-4">
      <div class="p-2 bg-yellow-50 dark:bg-yellow-900/30 rounded-xl shrink-0">
        <i data-lucide="zap" class="w-5 h-5 text-yellow-500"></i>
      </div>
      <div class="flex-1">
        <div class="flex justify-between items-center mb-1">
          <span class="font-black text-gray-800 dark:text-gray-200 text-sm">${xpData.title}</span>
          <span class="text-xs font-black text-gray-400">${state.xp} XP${xpData.next ? ` / ${xpData.next}` : ''}</span>
        </div>
        <div class="w-full bg-gray-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
          <div class="xp-bar bg-gradient-to-r from-yellow-400 to-pink-500 h-full rounded-full" style="width:${xpProgress}%"></div>
        </div>
      </div>
    </div>

    <!-- Word of the Day -->
    ${wotd ? `
    <div class="wotd-card rounded-2xl p-5 mb-5 border border-pink-100 dark:border-pink-900/30 shadow-sm">
      <div class="flex items-center justify-between gap-3">
        <div class="flex items-center gap-3 flex-1">
          <div class="text-2xl">✨</div>
          <div>
            <p class="text-[10px] font-black text-pink-500 uppercase tracking-widest mb-0.5">${wotd.category} — Parola del Giorno</p>
            <p class="text-2xl font-black text-gray-900 dark:text-white" style="font-family:'Noto Sans KR'">${wotd.hangul}</p>
            <p class="text-xs font-bold text-blue-500">${wotd.romaji} — <span class="text-gray-600 dark:text-gray-400">${wotd.eng}</span></p>
          </div>
        </div>
        <div class="flex flex-col items-end gap-2">
          <button onclick="window.playAudio(event,'${wotd.hangul}')" class="shrink-0 bg-white dark:bg-slate-700 border-2 border-pink-200 dark:border-pink-700 text-pink-500 p-2.5 rounded-xl shadow-sm hover:bg-pink-50 transition-all hover:scale-110 outline-none" aria-label="Ascolta pronuncia">
            <i data-lucide="volume-2" class="w-5 h-5"></i>
          </button>
          <div class="text-right">
            <p class="text-[9px] text-gray-400 font-bold">Reset alle 00:00 🕛</p>
            <p class="text-[11px] font-black text-pink-500 tabular-nums" id="wotd-timer">--:--:--</p>
          </div>
        </div>
      </div>
      <div class="mt-3"><div class="wotd-timer-bar" id="wotd-timer-bar" style="width:100%"></div></div>
    </div>` : ''}

    <!-- Next Lesson CTA -->
    ${nextDay ? `
    <div class="bg-gray-900 dark:bg-slate-950 rounded-2xl p-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
      <div class="flex items-center gap-3">
        <div class="p-2.5 bg-pink-500 rounded-xl shrink-0"><i data-lucide="play" class="w-5 h-5 text-white"></i></div>
        <div>
          <p class="text-gray-400 text-[10px] font-black uppercase tracking-widest">Prossima Lezione</p>
          <p class="font-black text-white text-base">${window.COURSE_DATA.find(d => d.day === nextDay)?.title || `Giorno ${nextDay}`}</p>
        </div>
      </div>
      <button onclick="window.startDay(${nextDay})" class="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-xl font-black shadow-lg shadow-pink-500/30 transition-all hover:scale-105 w-full sm:w-auto outline-none flex items-center justify-center gap-2">
        Inizia Ora <i data-lucide="arrow-right" class="w-5 h-5"></i>
      </button>
    </div>` : `
    <div class="bg-gradient-to-r from-pink-500 to-yellow-400 rounded-2xl p-5 mb-6 text-center text-white shadow-xl">
      <p class="text-3xl mb-1">🎉</p>
      <p class="font-black text-xl">Corso Completato, ${state.profileName}! 화이팅!</p>
      <p class="text-sm opacity-90 font-bold mt-1">Sei pronta per la Corea 🇰🇷</p>
    </div>`}

    <!-- Map Unlock Preview -->
    <div class="bg-white dark:bg-slate-800 rounded-2xl p-5 mb-6 border border-blue-50 dark:border-slate-700 shadow-sm">
      <div class="flex items-center justify-between mb-3">
        <h3 class="font-black text-gray-800 dark:text-gray-200 flex items-center gap-2 text-sm">
          <i data-lucide="map-pin" class="w-4 h-4 text-pink-500"></i> Korea Tour Sbloccato
        </h3>
        <span class="text-xs font-black text-pink-500">${(window.MAP_REGIONS || []).filter(r => state.completedDays.includes(r.unlocksAtDay)).length} / ${(window.MAP_REGIONS || []).length}</span>
      </div>
      <div class="flex gap-1.5 flex-wrap mb-2">
        ${(window.MAP_REGIONS || []).map(r => `
          <span title="${state.completedDays.includes(r.unlocksAtDay) ? r.name : `Sblocca al Giorno ${r.unlocksAtDay}`}"
            class="text-xl cursor-default transition-all ${state.completedDays.includes(r.unlocksAtDay) ? '' : 'grayscale opacity-30'}">${r.icon}</span>`).join('')}
      </div>
      <button onclick="window.changeView('explore')" class="text-xs font-black text-blue-500 hover:text-pink-500 transition-colors flex items-center gap-1 outline-none">
        Vai al Korea Tour <i data-lucide="arrow-right" class="w-3 h-3"></i>
      </button>
    </div>

    <!-- Syllabus -->
    <div class="bg-white dark:bg-slate-800 rounded-2xl md:rounded-[2rem] korean-shadow p-5 md:p-10 mb-8 border border-blue-50 dark:border-slate-700">
      <div class="flex justify-between items-center mb-6 border-b-2 border-gray-100 dark:border-slate-700 pb-4">
        <h2 class="text-xl md:text-2xl font-black text-gray-800 dark:text-gray-200 flex items-center gap-2">
          <i data-lucide="map" class="text-blue-400 w-6 h-6"></i> Syllabus
        </h2>
      </div>
      <div class="space-y-5 relative before:absolute before:inset-0 before:ml-[1.35rem] before:-translate-x-px before:h-full before:w-1 before:bg-gradient-to-b before:from-pink-200 before:via-blue-200 before:to-gray-200 before:rounded-full">
        ${(window.COURSE_DATA || []).map(dayData => {
          const isCompleted = state.completedDays.includes(dayData.day);
          const isLocked = dayData.day > 1 && !state.completedDays.includes(dayData.day - 1);
          const needsReview = isCompleted && (state.mistakesRecord[dayData.day] || []).length > 0;

          let circleClass = 'bg-pink-500 text-white shadow-lg shadow-pink-500/40 border-4 border-white dark:border-slate-800';
          let circleContent = dayData.day;
          if (isCompleted) { circleClass = 'bg-blue-500 text-white shadow-md border-4 border-blue-100 dark:border-blue-900'; circleContent = `<i data-lucide="check" class="w-5 h-5"></i>`; }
          else if (isLocked) { circleClass = 'bg-gray-200 dark:bg-slate-700 text-gray-400 dark:text-slate-500 border-4 border-white dark:border-slate-800'; }

          return `
            <div class="relative flex items-center justify-between ${isLocked ? 'opacity-50' : ''}">
              <div class="flex items-center justify-center w-10 h-10 rounded-full shrink-0 z-10 font-black text-sm ${circleClass}">
                ${circleContent}
              </div>
              <div class="syllabus-card w-[calc(100%-3.5rem)] ${isLocked ? 'locked' : ''}"
                ${!isLocked ? `onclick="window.startDay(${dayData.day})" role="button" tabindex="0" onkeydown="if(event.key==='Enter') window.startDay(${dayData.day})"` : ''}>
                <div class="flex justify-between items-center gap-3">
                  <div class="flex-1 min-w-0">
                    <span class="text-[10px] font-black text-pink-500 uppercase tracking-widest block mb-0.5">${dayData.topic}</span>
                    <h3 class="font-black text-gray-800 dark:text-gray-200 leading-tight text-base truncate">${dayData.title}</h3>
                    <p class="text-[11px] text-gray-400 font-bold mt-1 flex items-center gap-1">
                      <i data-lucide="clock" class="w-3 h-3"></i> ${dayData.exercises.length} esercizi
                    </p>
                    <div class="flex flex-wrap gap-1.5 mt-1.5">
                      ${isCompleted && !needsReview ? `<span class="badge badge-blue text-[10px]">✓ Completato</span>` : ''}
                      ${needsReview ? `<span class="badge badge-orange text-[10px]">↺ Ripasso</span>` : ''}
                      ${isLocked ? `<span class="badge text-[10px] bg-gray-100 dark:bg-slate-700 text-gray-400 dark:text-slate-400">🔒 Bloccato</span>` : ''}
                    </div>
                  </div>
                  ${!isLocked ? `
                  <div class="p-3 rounded-full transition-all shrink-0 ${isCompleted ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600' : 'bg-pink-500 text-white shadow-md shadow-pink-500/30'}">
                    <i data-lucide="${needsReview ? 'rotate-ccw' : 'play'}" class="w-5 h-5"></i>
                  </div>` : ''}
                </div>
              </div>
            </div>`;
        }).join('')}
      </div>
    </div>
  </div>`;
};
