/* ===== map.js — Leaflet interactive map ===== */
'use strict';

import { state } from './state.js';

let myMap = null;

export const initMap = () => {
  const container = document.getElementById('korea-map');
  if (!container) return;
  if (myMap) { myMap.remove(); myMap = null; }

  myMap = L.map('korea-map', { zoomControl: false, scrollWheelZoom: false }).setView([36.5, 127.5], 7);
  L.control.zoom({ position: 'topright' }).addTo(myMap);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap',
    className: 'map-tiles',
  }).addTo(myMap);

  (window.MAP_REGIONS || []).forEach(region => {
    const isUnlocked = state.completedDays.includes(region.unlocksAtDay);
    const isNew = state.newlyUnlockedLocation?.name === region.name;
    const borderColor = isNew ? '#4ade80' : (isUnlocked ? '#f472b6' : '#d1d5db');
    const iconHtml = isUnlocked
      ? `<div class="${isNew ? 'unlock-glow' : 'animate-bounce-slow'} border-4" style="border-color:${borderColor}">${region.icon}</div>`
      : `<div class="border-4" style="border-color:${borderColor}">🔒</div>`;

    const icon = L.divIcon({ className: 'custom-map-icon', html: iconHtml, iconSize: [44, 44], iconAnchor: [22, 22], popupAnchor: [0, -25] });
    const marker = L.marker([region.lat, region.lng], { icon }).addTo(myMap);

    const popupContent = isUnlocked
      ? `<div class="p-0 text-center min-w-[260px]">
          <img src="${region.image}" alt="${region.name}" class="w-full h-32 object-cover rounded-t-xl" onerror="this.src='https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=400&q=80'" loading="lazy" />
          <div class="px-3 pb-3">
            <h3 class="font-black text-lg mt-2 mb-1">${region.name}</h3>
            <p class="text-xs text-gray-600 mb-2">${region.desc.substring(0, 80)}...</p>
            <div class="flex flex-wrap gap-1 mb-2 justify-center">
              ${region.keywords.map(kw => `<span class="bg-pink-50 text-pink-600 px-2 py-0.5 rounded text-[10px] font-bold">${kw}</span>`).join('')}
            </div>
            ${(region.phrases || []).slice(0, 2).map(ph => `
              <div class="flex items-center gap-2 mb-1 bg-gray-50 rounded-lg p-1.5">
                <div class="text-left flex-1">
                  <p class="text-sm font-black" style="font-family:'Noto Sans KR'">${ph.hangul}</p>
                  <p class="text-[10px] text-blue-500">${ph.romaji} — ${ph.eng}</p>
                </div>
                <button onclick="window.playAudio(event,'${ph.hangul}')" class="p-1.5 bg-pink-100 text-pink-600 rounded-full text-xs">🔊</button>
              </div>`).join('')}
          </div>
        </div>`
      : `<div class="p-4 text-center min-w-[200px]">
          <div class="text-3xl mb-2">🔒</div>
          <h3 class="font-black text-base mb-1">${region.name}</h3>
          <p class="text-xs text-gray-500 mb-2">${region.desc.substring(0, 60)}...</p>
          <p class="text-xs font-black text-pink-600 bg-pink-50 px-3 py-2 rounded-xl">Completa il Giorno ${region.unlocksAtDay}</p>
        </div>`;

    marker.bindPopup(popupContent);
  });
};

// Expose globally
window.initMap = initMap;
