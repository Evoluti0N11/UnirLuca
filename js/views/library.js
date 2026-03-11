/* ===== views/library.js — Dictionary + Translator ===== */
'use strict';

import { state } from '../modules/state.js';
import { detectFormality } from '../modules/utils.js';

export const renderLibrary = () => {
  const formality = detectFormality(state.transResult);
  const formalityLabel = {
    formal: '<span class="formality-badge formality-formal">🎩 Formale</span>',
    polite: '<span class="formality-badge formality-informal">🌸 Educato/Polite</span>',
    informal: '<span class="formality-badge formality-informal">😊 Informale</span>',
    neutral: '<span class="formality-badge formality-neutral">• Neutrale</span>',
  }[formality] || '';

  return `
  <div class="max-w-3xl mx-auto animate-pop">
    <h1 class="text-2xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
      <i data-lucide="book-marked" class="w-7 h-7 text-blue-500"></i> Guida & Dizionario
    </h1>

    <!-- TRANSLATOR -->
    <div class="bg-white dark:bg-slate-800 rounded-2xl p-5 mb-5 border border-gray-100 dark:border-slate-700 shadow-sm">
      <h2 class="font-black text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2 text-base">
        <i data-lucide="languages" class="w-5 h-5 text-blue-500"></i> Traduttore con Rilevamento Formalità
      </h2>
      <div class="flex gap-2 mb-3">
        <input type="text" id="transInput" placeholder="Italiano, Inglese... → 한국어"
          class="flex-1 border-2 border-gray-200 dark:border-slate-600 rounded-xl px-4 py-3 font-bold text-gray-800 dark:text-gray-200 dark:bg-slate-700 focus:border-pink-400 outline-none transition-colors text-base"
          onkeyup="if(event.key==='Enter') window.runTranslation()" />
        <button onclick="window.runTranslation()" class="bg-pink-500 hover:bg-pink-600 text-white px-4 rounded-xl font-black shadow-md transition-all hover:scale-105 outline-none flex items-center justify-center min-w-[52px]" aria-label="Traduci">
          ${state.transLoading
            ? '<i data-lucide="loader-2" class="animate-spin w-5 h-5"></i>'
            : '<i data-lucide="search" class="w-5 h-5"></i>'}
        </button>
      </div>
      ${state.transResult && state.transResult !== 'Traducendo...' ? `
      <div class="bg-pink-50 dark:bg-pink-900/20 border border-pink-100 dark:border-pink-800 rounded-xl p-4">
        <div class="flex justify-between items-start gap-3">
          <div class="flex-1">
            <p class="text-xl md:text-2xl font-black text-gray-900 dark:text-white mb-1" style="font-family:'Noto Sans KR'">${state.transResult}</p>
            ${state.transRomaji ? `<p class="text-sm font-bold text-blue-500">${state.transRomaji}</p>` : ''}
            ${formalityLabel}
          </div>
          <button onclick="window.playAudio(event,'${state.transResult}')" class="shrink-0 w-10 h-10 bg-white dark:bg-slate-700 border border-pink-200 dark:border-pink-700 text-pink-500 rounded-xl flex items-center justify-center shadow-sm hover:bg-pink-50 transition-all outline-none">
            <i data-lucide="volume-2" class="w-5 h-5"></i>
          </button>
        </div>
      </div>` : ''}
    </div>

    <!-- DICTIONARY -->
    <div class="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-gray-100 dark:border-slate-700 shadow-sm">
      <h2 class="font-black text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2 text-base">
        <i data-lucide="search" class="w-5 h-5 text-blue-500"></i> Dizionario Interattivo
      </h2>
      <div class="relative mb-3">
        <i data-lucide="search" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"></i>
        <input type="search" placeholder="Cerca parola... (한국어 or italiano)" value="${state.dictSearch}"
          oninput="window.updateDictSearch(this.value)"
          class="w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-slate-600 rounded-xl font-bold text-gray-800 dark:text-gray-200 dark:bg-slate-700 focus:border-pink-400 outline-none transition-colors text-sm" />
      </div>
      <div class="flex gap-2 overflow-x-auto mb-4 pb-3 scroll-smooth snap-x" id="dict-categories">
        <button onclick="window.updateDictCategory('all')" data-cat="all" class="dict-cat-btn shrink-0 px-3 py-1.5 rounded-full text-xs font-black transition-all outline-none ${state.dictCategory === 'all' ? 'bg-pink-500 text-white shadow-md' : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400'}">
          Tutti
        </button>
        ${(window.DICTIONARY || []).map(s => `
          <button onclick="window.updateDictCategory('${s.category}')" data-cat="${s.category}" class="dict-cat-btn shrink-0 px-3 py-1.5 rounded-full text-xs font-black transition-all outline-none ${state.dictCategory === s.category ? 'bg-pink-500 text-white shadow-md' : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400'}">
            ${s.category}
          </button>`).join('')}
      </div>
      <div id="dict-content"></div>
    </div>
  </div>`;
};

export const buildDictHtml = () => {
  const search = state.dictSearch.toLowerCase();
  const cat = state.dictCategory;
  let html = '';

  (window.DICTIONARY || []).forEach(section => {
    if (cat !== 'all' && section.category !== cat) return;
    const filtered = section.words.filter(w =>
      !search ||
      w.hangul.includes(state.dictSearch) ||
      w.romaji.toLowerCase().includes(search) ||
      w.eng.toLowerCase().includes(search)
    );
    if (filtered.length === 0) return;

    html += `
      <div class="mb-6">
        <h3 class="font-black text-gray-800 dark:text-gray-200 text-sm uppercase tracking-widest mb-3 flex items-center gap-2">
          <span>${section.category}</span>
          <span class="text-gray-400 text-xs font-normal">(${filtered.length})</span>
        </h3>
        <div class="space-y-2">
          ${filtered.map(w => `
            <div class="dict-entry bg-white dark:bg-slate-800 rounded-xl p-4 flex items-center justify-between gap-3 shadow-sm border border-gray-100 dark:border-slate-700 cursor-pointer" onclick="window.playAudio(event,'${w.hangul}')">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-0.5">
                  <span class="text-xl font-black" style="font-family:'Noto Sans KR'">${w.hangul}</span>
                  <span class="formality-badge ${w.formal ? 'formality-formal' : 'formality-informal'}">${w.formal ? 'Formale' : 'Informale'}</span>
                </div>
                <p class="text-blue-500 font-bold text-xs">${w.romaji}</p>
                <p class="text-gray-600 dark:text-gray-400 font-bold text-sm">${w.eng}</p>
                ${w.example ? `<p class="text-gray-400 dark:text-gray-500 text-xs mt-1 italic">"${w.example}"</p>` : ''}
              </div>
              <button class="shrink-0 w-10 h-10 bg-pink-50 dark:bg-pink-900/30 text-pink-500 rounded-full flex items-center justify-center hover:bg-pink-100 transition-all" aria-label="Ascolta">
                <i data-lucide="volume-2" class="w-4 h-4"></i>
              </button>
            </div>`).join('')}
        </div>
      </div>`;
  });

  return html || `<p class="text-gray-400 font-bold text-center py-12">🔍 Nessun risultato per "${state.dictSearch}"</p>`;
};

export const renderDictContent = () => {
  const container = document.getElementById('dict-content');
  if (!container) return;
  container.innerHTML = buildDictHtml();
  if (window.lucide) lucide.createIcons();
};
