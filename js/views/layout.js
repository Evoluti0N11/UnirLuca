/* ===== views/layout.js — App shell: header, nav, overlay ===== */
'use strict';

import { state } from '../modules/state.js';

const NAV_ITEMS = [
  { view: 'dashboard', label: 'Percorso' },
  { view: 'explore',   label: 'Tour 🇰🇷' },
  { view: 'library',   label: 'Dizionario' },
  { view: 'profile',   label: 'Profilo' },
];

export const renderTransitionOverlay = () =>
  state.isTransitioning ? `
  <div class="fixed inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm z-[10000] flex items-center justify-center animate-fadein">
    <div class="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-2xl flex flex-col items-center">
      <i data-lucide="loader-2" class="animate-spin text-pink-500 w-10 h-10 mb-2"></i>
      <span class="font-black text-gray-500 dark:text-gray-300 text-xs uppercase tracking-widest">Caricamento</span>
    </div>
  </div>` : '';

export const renderHeader = () => {
  if (state.currentView === 'home') return '';
  const isGameView = ['theory', 'game', 'result'].includes(state.currentView);
  return `
  <header class="app-top-bar w-full bg-white/97 dark:bg-slate-900/97 backdrop-blur-md border-b border-gray-100 dark:border-slate-800 z-[9000] flex-shrink-0 pt-safe transition-colors" role="banner">
    <div class="max-w-5xl mx-auto px-4 py-2.5 flex justify-between items-center gap-4">
      <button onclick="window.changeView('dashboard')" class="font-black text-pink-500 flex items-center gap-2 outline-none hover:scale-105 transition-transform shrink-0">
        <span class="text-xl">🌸</span>
        <span class="hidden sm:inline text-sm">Annyeong, ${state.profileName}!</span>
      </button>
      ${!isGameView ? `
      <nav class="desktop-nav-tabs" aria-label="Navigazione desktop">
        ${NAV_ITEMS.map(it => `
          <button onclick="window.changeView('${it.view}')" class="${state.currentView === it.view ? 'active' : ''}">
            ${it.label}
          </button>`).join('')}
      </nav>` : ''}
      <div class="flex items-center gap-2 shrink-0">
        <span class="hidden sm:flex items-center gap-1 text-xs font-black text-orange-500 bg-orange-50 dark:bg-orange-900/30 px-2 py-1 rounded-full border border-orange-100 dark:border-orange-900">
          <i data-lucide="flame" class="w-3 h-3"></i> ${state.streak}
        </span>
        <button onclick="window.toggleDarkMode()"
          class="p-2 rounded-full bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 transition-all hover:scale-110 outline-none"
          aria-label="Modalità ${state.isDarkMode ? 'chiara' : 'scura'}">
          <i data-lucide="${state.isDarkMode ? 'sun' : 'moon'}" class="w-4 h-4 ${state.isDarkMode ? 'text-yellow-400' : 'text-slate-500'}"></i>
        </button>
      </div>
    </div>
  </header>`;
};

export const renderBottomNav = () => {
  if (['home', 'theory', 'game', 'result'].includes(state.currentView)) return '';
  return `
  <nav class="bottom-nav" aria-label="Navigazione principale" role="navigation">
    ${NAV_ITEMS.map(({ view, label }) => `
      <button onclick="window.changeView('${view}')" class="${state.currentView === view ? 'active' : ''}" aria-label="${label}">
        <i data-lucide="${view === 'dashboard' ? 'map' : view === 'explore' ? 'globe' : view === 'library' ? 'book-open' : 'user'}" class="w-5 h-5 mb-0.5"></i>
        <span>${label.split(' ')[0]}</span>
      </button>`).join('')}
  </nav>`;
};
