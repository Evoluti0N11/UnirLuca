/* ===== renderer.js — Central render orchestrator ===== */
'use strict';

import { state } from './state.js';
import { renderTransitionOverlay, renderHeader, renderBottomNav } from '../views/layout.js';
import { renderHome } from '../views/home.js';
import { renderDashboard } from '../views/dashboard.js';
import { renderTheory, renderGame, renderResult } from '../views/lesson.js';
import { renderExplore } from '../views/explore.js';
import { renderLibrary, renderDictContent } from '../views/library.js';
import { renderProfile } from '../views/profile.js';
import { startWotdTimer } from './timer.js';

const VIEW_MAP = {
  home: renderHome,
  dashboard: renderDashboard,
  theory: renderTheory,
  game: renderGame,
  result: renderResult,
  explore: renderExplore,
  library: renderLibrary,
  profile: renderProfile,
};

export const renderApp = () => {
  const root = document.getElementById('root');
  if (!root) return;

  const renderFn = VIEW_MAP[state.currentView];
  const content = renderFn ? renderFn() : '';

  root.innerHTML = `
    ${renderTransitionOverlay()}
    ${renderHeader()}
    <main id="main-content"
      class="flex-1 overflow-y-auto overscroll-y-contain w-full hide-scroll"
      style="background-color: inherit;"
      ontouchstart="window.handleTouchStart(event)"
      ontouchend="window.handleTouchEnd(event)"
      role="main" aria-label="Contenuto principale">
      <div class="max-w-[100vw] mx-auto ${state.currentView === 'home' ? '' : 'p-4 md:p-8'} w-full relative animate-fadein">
        ${content}
      </div>
    </main>
    ${renderBottomNav()}
  `;

  if (window.lucide) lucide.createIcons();

  if (state.currentView === 'explore' && !state.isTransitioning) {
    setTimeout(window.initMap, 100);
  }
  if (state.currentView === 'library') {
    renderDictContent();
  }
  if (state.currentView === 'dashboard') {
    startWotdTimer();
  }
};
