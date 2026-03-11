/* ===== views/lesson.js — Theory, Game, Result screens ===== */
'use strict';

import { state } from '../modules/state.js';

const EXERCISE_TYPE_INFO = {
  multiple_choice: { label: 'Scelta Multipla', icon: 'list', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800' },
  listen:          { label: 'Ascolto', icon: 'headphones', color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800' },
  speak:           { label: 'Pronuncia', icon: 'mic', color: 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 border-pink-200 dark:border-pink-800' },
  conversation:    { label: 'Conversazione', icon: 'message-circle', color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800' },
  fill_blank:      { label: 'Completa la Frase', icon: 'type', color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800' },
  sentence_builder:{ label: 'Costruttore', icon: 'layers', color: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800' },
};

/* ---- Theory ---- */
export const renderTheory = () => {
  const lesson = window.COURSE_DATA.find(d => d.day === state.activeDay);
  if (!lesson) return '<p>Lezione non trovata.</p>';

  return `
  <div class="max-w-3xl mx-auto animate-pop">
    <button onclick="window.changeView('dashboard')" class="text-gray-500 dark:text-gray-400 mb-5 flex items-center hover:text-gray-800 dark:hover:text-white font-black text-sm transition-colors px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 w-fit outline-none">
      <i data-lucide="arrow-left" class="w-5 h-5 mr-2"></i> Torna al Percorso
    </button>

    <div class="bg-white dark:bg-slate-800 rounded-2xl md:rounded-[2rem] korean-shadow overflow-hidden border border-blue-50 dark:border-slate-700">
      <div class="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 md:p-10 relative overflow-hidden">
        <i data-lucide="book-open" class="absolute right-0 bottom-0 w-32 h-32 opacity-10 translate-x-6 translate-y-6"></i>
        <span class="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-black tracking-widest uppercase mb-4 inline-block border border-white/30">
          Giorno ${lesson.day} • Teoria
        </span>
        <h2 class="text-2xl md:text-3xl font-black leading-tight">${lesson.title}</h2>
      </div>

      <div class="p-5 md:p-10 space-y-7 md:space-y-10">
        <div class="flex gap-4 items-start bg-pink-50 dark:bg-pink-900/20 p-5 rounded-2xl border border-pink-100 dark:border-pink-800">
          <i data-lucide="quote" class="text-pink-500 shrink-0 w-7 h-7 mt-1"></i>
          <p class="leading-relaxed font-bold text-pink-900 dark:text-pink-200 text-sm md:text-base">${lesson.theory.intro}</p>
        </div>

        <div>
          <h3 class="font-black text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2 text-lg">
            <div class="p-1.5 bg-blue-100 dark:bg-blue-900/40 rounded-xl text-blue-600"><i data-lucide="brain" class="w-5 h-5"></i></div>
            Il Concetto Base
          </h3>
          <p class="text-gray-600 dark:text-gray-300 font-bold leading-relaxed text-sm md:text-base">${lesson.theory.concept}</p>
        </div>

        ${lesson.day <= 5 ? `
        <div class="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-4 border-2 border-amber-200 dark:border-amber-800 flex gap-3 items-start">
          <span class="text-xl shrink-0">📌</span>
          <div>
            <h3 class="font-black text-amber-900 dark:text-amber-300 mb-1 text-sm md:text-base">Formale vs Informale</h3>
            <p class="text-amber-800 dark:text-amber-400 font-bold text-xs md:text-sm leading-relaxed">Con <strong>sconosciuti, negozianti, taxisti</strong> → usa frasi con <strong>-요 (-yo)</strong> o <strong>-니다 (-nida)</strong>. Con <strong>amici della tua età</strong> → puoi togliere il -요. Per i tuoi primi giorni: usa sempre la forma con -요, non sbagli mai!</p>
          </div>
        </div>` : ''}

        <div>
          <h3 class="font-black text-gray-800 dark:text-gray-200 mb-4 text-lg border-b-2 border-gray-100 dark:border-slate-700 pb-3">Frasi Chiave 📝</h3>
          <p class="text-xs font-bold text-pink-500 mb-4 bg-pink-50 dark:bg-pink-900/20 p-3 rounded-xl border border-pink-100 dark:border-pink-800 flex gap-2 items-center">
            <i data-lucide="mouse-pointer-click" class="w-4 h-4 shrink-0"></i>
            Tocca le parole coreane per ascoltare la pronuncia!
          </p>
          <div class="space-y-3">
            ${lesson.theory.examples.map(ex => `
              <div class="bg-white dark:bg-slate-750 border-2 border-gray-100 dark:border-slate-600 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm hover:shadow-md hover:border-pink-200 dark:hover:border-pink-700 transition-all group card-hover">
                <div>
                  <p class="text-xl md:text-2xl font-black text-gray-900 dark:text-white mb-1 group-hover:text-pink-600 transition-colors hangul-display">${window.renderHangul(ex.hangul)}</p>
                  <p class="text-blue-500 font-bold text-sm mb-1">${ex.romaji}</p>
                  <p class="text-gray-700 dark:text-gray-300 font-black text-sm md:text-base mb-1">"${ex.eng}"</p>
                  ${ex.context ? `<p class="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-slate-700 p-2 rounded-lg font-bold border border-gray-100 dark:border-slate-600 mt-1 inline-block">${ex.context}</p>` : ''}
                </div>
                <button onclick="window.playAudio(event,'${ex.hangul}')" class="flex items-center justify-center gap-2 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 border-2 border-blue-100 dark:border-blue-800 text-blue-700 dark:text-blue-400 px-4 py-2.5 rounded-xl transition-all hover:scale-105 shrink-0 w-full sm:w-auto outline-none min-h-[44px]" aria-label="Ascolta ${ex.eng}">
                  <i data-lucide="volume-2" class="w-5 h-5"></i><span class="font-black text-sm">Ascolta</span>
                </button>
              </div>`).join('')}
          </div>
        </div>

        ${lesson.theory.builderRule ? `
        <div class="bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl p-5 border border-indigo-100 dark:border-indigo-800 flex gap-4 items-start">
          <i data-lucide="link" class="text-indigo-500 shrink-0 w-7 h-7 mt-1"></i>
          <div>
            <h3 class="font-black text-indigo-900 dark:text-indigo-300 mb-1 text-base">Conversation Builder 🔗</h3>
            <p class="text-indigo-800 dark:text-indigo-400 font-bold leading-relaxed text-sm md:text-base">${lesson.theory.builderRule}</p>
          </div>
        </div>` : ''}

        <div class="bg-green-50 dark:bg-green-900/20 rounded-2xl p-5 border border-green-100 dark:border-green-800 flex gap-4 items-start">
          <i data-lucide="leaf" class="text-green-600 shrink-0 w-7 h-7 mt-1"></i>
          <div>
            <h3 class="font-black text-green-900 dark:text-green-300 mb-1 text-base">Dettaglio Culturale 🎎</h3>
            <p class="text-green-800 dark:text-green-400 font-bold leading-relaxed text-sm md:text-base">${lesson.theory.culture}</p>
          </div>
        </div>
      </div>

      <div class="p-5 md:p-8 bg-gray-50 dark:bg-slate-750 border-t-2 border-gray-100 dark:border-slate-700 flex justify-end">
        <button onclick="window.startGame()" class="bg-pink-500 hover:bg-pink-600 text-white px-8 py-4 rounded-2xl font-black text-lg shadow-lg shadow-pink-500/30 flex items-center justify-center gap-3 transition-all hover:scale-105 w-full md:w-auto outline-none">
          Inizia la Pratica (${lesson.exercises.length} Es) <i data-lucide="play-circle" class="w-7 h-7"></i>
        </button>
      </div>
    </div>
  </div>`;
};

/* ---- Sentence Builder helpers ---- */
const renderBuilderExercise = (exercise, isAnswered) => {
  if (state.builderAvailableWords.length === 0 && !state.showFeedback) {
    state.builderAvailableWords = [...exercise.shuffled_blocks];
  }

  const selectedHtml = `
    <div class="min-h-[56px] bg-white dark:bg-slate-700 border-2 border-dashed ${isAnswered ? (state.selectedAnswer ? 'border-green-400 bg-green-50 dark:bg-green-900/20' : 'border-rose-400 bg-rose-50 dark:bg-rose-900/20') : 'border-pink-300 dark:border-pink-700'} rounded-2xl p-3 flex flex-wrap gap-2 mb-4 transition-all">
      ${state.builderSelectedWords.length === 0
        ? '<p class="text-gray-400 dark:text-gray-500 text-sm font-bold w-full text-center">Tocca le parole per costruire la frase →</p>'
        : state.builderSelectedWords.map((item, i) => `
          <button ${isAnswered ? 'disabled' : `onclick="window.handleBuilderClick(${i}, false)"`}
            class="px-3 py-1.5 bg-pink-500 text-white rounded-xl font-black text-base shadow-md transition-all hover:bg-pink-600 hover:scale-105 outline-none" style="font-family:'Noto Sans KR'">
            ${item.word}
          </button>`).join('')}
    </div>`;

  const poolHtml = `
    <div class="flex flex-wrap gap-2 justify-center mt-2">
      ${state.builderAvailableWords.map((word, i) =>
        word === null
          ? `<div class="px-3 py-1.5 min-w-[50px] h-[42px] bg-gray-100 dark:bg-slate-700 rounded-xl opacity-30"></div>`
          : `<button ${isAnswered ? 'disabled' : `onclick="window.handleBuilderClick(${i}, true)"`}
              class="px-3 py-1.5 bg-white dark:bg-slate-700 border-2 border-gray-200 dark:border-slate-600 hover:border-pink-400 dark:hover:border-pink-600 hover:bg-pink-50 dark:hover:bg-pink-900/20 rounded-xl font-black text-base transition-all hover:scale-105 text-gray-800 dark:text-gray-200 shadow-sm outline-none" style="font-family:'Noto Sans KR'">
              ${word}
            </button>`).join('')}
    </div>`;

  const checkBtn = !isAnswered ? `
    <button onclick="window.checkBuilderAnswer()"
      class="mt-5 w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-2xl font-black text-base transition-all hover:scale-105 shadow-lg outline-none flex items-center justify-center gap-2 ${state.builderSelectedWords.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}"
      ${state.builderSelectedWords.length === 0 ? 'disabled' : ''}>
      <i data-lucide="check-circle" class="w-5 h-5"></i> Controlla la Frase
    </button>` : '';

  return selectedHtml + poolHtml + checkBtn;
};

/* ---- Game ---- */
export const renderGame = () => {
  const lesson = window.COURSE_DATA.find(d => d.day === state.activeDay);
  if (!lesson) return '<p>Errore caricamento lezione.</p>';

  const exercise = lesson.exercises[state.gameStep];
  const isAnswered = state.showFeedback;
  const isCorrect = state.selectedAnswer === true ||
    (typeof state.selectedAnswer === 'number' && state.selectedAnswer === exercise.answer);
  const progressWidth = ((state.gameStep + (isAnswered ? 1 : 0)) / lesson.exercises.length) * 100;
  const typeInfo = EXERCISE_TYPE_INFO[exercise.type] || EXERCISE_TYPE_INFO.multiple_choice;

  const contextHtml = exercise.context ? `
    <div class="bg-gray-50 dark:bg-slate-750 border border-gray-100 dark:border-slate-700 rounded-2xl p-4 mb-6 text-sm font-bold text-gray-700 dark:text-gray-300 flex gap-3 items-start">
      <i data-lucide="message-square" class="text-gray-400 shrink-0 w-5 h-5 mt-0.5"></i>
      <span>${exercise.context}</span>
    </div>` : '';

  // Build exercise HTML by type
  let exerciseHtml = '';

  if (['multiple_choice', 'listen', 'conversation', 'fill_blank'].includes(exercise.type)) {
    exerciseHtml = '<div class="space-y-3 w-full">' +
      (exercise.options || []).map((opt, i) => {
        let optCls = 'bg-white dark:bg-slate-750 border-gray-200 dark:border-slate-600 hover:border-pink-400 hover:bg-pink-50 dark:hover:bg-pink-900/20 text-gray-800 dark:text-gray-200';
        let iconHtml = '';
        if (isAnswered) {
          if (i === exercise.answer) {
            optCls = 'bg-green-50 dark:bg-green-900/20 border-green-400 text-green-900 dark:text-green-200 pointer-events-none';
            iconHtml = '<i data-lucide="check-circle" class="w-5 h-5 text-green-500 shrink-0"></i>';
          } else if (i === state.selectedAnswer) {
            optCls = 'bg-rose-50 dark:bg-rose-900/20 border-rose-400 text-rose-900 dark:text-rose-200 pointer-events-none';
            iconHtml = '<i data-lucide="x-circle" class="w-5 h-5 text-rose-500 shrink-0"></i>';
          } else {
            optCls = 'opacity-50 pointer-events-none bg-white dark:bg-slate-750 border-gray-200 dark:border-slate-600 text-gray-600 dark:text-gray-400';
          }
        }
        const hangulOpt = exercise.optionsHangul?.[i] ? `<span class="text-blue-500 text-sm font-black" style="font-family:'Noto Sans KR'">${exercise.optionsHangul[i]}</span>` : '';
        return `
          <button onclick="window.handleMultipleChoiceAnswer(${i})" class="w-full text-left p-4 rounded-2xl border-2 ${optCls} font-black text-base md:text-lg transition-all shadow-sm flex items-center justify-between min-h-[60px] outline-none" ${isAnswered ? 'disabled' : ''}>
            <div class="flex flex-col gap-0.5">
              <span>${opt}</span>
              ${hangulOpt}
            </div>
            <div class="flex items-center ml-2">${iconHtml}</div>
          </button>`;
      }).join('') + '</div>';
  } else if (exercise.type === 'sentence_builder') {
    exerciseHtml = renderBuilderExercise(exercise, isAnswered);
  } else if (exercise.type === 'speak') {
    if (state.fallbackActive && !isAnswered) {
      exerciseHtml = `
        <div class="space-y-3 w-full animate-pop">
          <p class="text-xs font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 p-3 rounded-xl border border-orange-200 dark:border-orange-800 flex items-start gap-2">
            <i data-lucide="info" class="w-4 h-4 shrink-0 mt-0.5"></i> Scegli la <b>pronuncia fonetica esatta</b>!
          </p>
          ${state.fallbackOptions.map((opt, i) => `
            <button onclick="window.handleFallbackAnswer(${i})" class="w-full text-left p-4 rounded-2xl border-2 border-gray-200 dark:border-slate-600 hover:border-pink-400 hover:bg-pink-50 dark:hover:bg-pink-900/20 font-black text-lg transition-all shadow-sm flex items-center justify-between text-gray-800 dark:text-gray-200 min-h-[60px] outline-none">
              <span>${opt}</span> <i data-lucide="ear" class="w-5 h-5 text-pink-400 shrink-0"></i>
            </button>`).join('')}
        </div>`;
    } else {
      const btnCls = state.isRecording
        ? 'bg-pink-500 scale-110 shadow-2xl shadow-pink-500/50 recording-pulse border-white border-4'
        : (isAnswered ? 'bg-gray-200 dark:bg-slate-700 text-gray-400' : 'bg-blue-500 hover:bg-blue-600 text-white shadow-xl hover:scale-105 border-4 border-blue-200');
      const msg = state.isRecording ? 'Ti sto ascoltando... 👂' : (isAnswered ? 'Analisi completata.' : 'Tocca per parlare');
      exerciseHtml = `
        <div class="flex flex-col items-center justify-center mt-6 space-y-5 bg-gray-50 dark:bg-slate-750 p-6 rounded-3xl border-2 border-dashed border-gray-200 dark:border-slate-600 min-h-[240px] relative">
          <button ${isAnswered || state.isRecording ? 'disabled' : ''}
            onmousedown="window.handleSpeechRecognition(event)"
            ontouchstart="window.handleSpeechRecognition(event)"
            class="relative w-28 h-28 rounded-full flex items-center justify-center transition-all ${btnCls} no-select outline-none"
            aria-label="Parla in coreano">
            <i data-lucide="mic" class="w-12 h-12 ${state.isRecording ? 'animate-bounce' : ''}"></i>
          </button>
          <p class="text-gray-600 dark:text-gray-400 font-black text-center text-base">${msg}</p>
          ${(!isAnswered && !state.isRecording) ? `
          <button onclick="window.triggerSpeechFallback()" class="absolute bottom-3 right-3 text-[10px] font-bold text-gray-400 hover:text-gray-600 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 px-3 py-2 rounded-lg shadow-sm transition-colors outline-none">
            Alternativa
          </button>` : ''}
        </div>`;
    }
  }

  const feedbackCls = isCorrect
    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-900 dark:text-green-200'
    : 'bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200';
  const iconCls = isCorrect ? 'bg-green-500' : 'bg-rose-500';
  const btnFeedCls = isCorrect ? 'bg-green-500 hover:bg-green-600 shadow-green-500/30' : 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/30';
  const btnText = state.gameStep === lesson.exercises.length - 1 ? 'Termina Lezione 🏁' : 'Prossima Domanda →';
  const feedbackMsg = exercise._fb || (isCorrect ? 'Ottima risposta, vai avanti così!' : exercise.feedback_incorrect);
  const correctBuilderText = (!isCorrect && exercise.type === 'sentence_builder')
    ? `<p class="mt-2 text-sm">La frase corretta era: <strong class="font-black text-rose-600 dark:text-rose-400" style="font-family:'Noto Sans KR'">${exercise.correct_order.join(' ')}</strong></p>`
    : '';

  return `
  <div class="max-w-2xl mx-auto animate-pop">
    <div class="flex justify-between items-center mb-4 px-1">
      <div class="flex items-center gap-2 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
        <i data-lucide="flame" class="w-5 h-5 ${state.combo > 1 ? 'text-orange-500 animate-pulse' : 'text-gray-300'}"></i>
        <span class="font-black text-sm ${state.combo > 1 ? 'text-orange-600' : 'text-gray-400'}">${state.combo}x</span>
      </div>
      <span class="font-black text-gray-500 dark:text-gray-400 text-sm bg-white dark:bg-slate-800 px-3 py-1.5 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">${state.gameStep + 1} / ${lesson.exercises.length}</span>
    </div>

    <div class="mb-5 bg-white dark:bg-slate-800 p-2 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
      <div class="bg-gray-100 dark:bg-slate-700 h-3 rounded-xl overflow-hidden">
        <div class="bg-gradient-to-r from-blue-400 to-pink-500 h-full transition-all duration-700 ease-out rounded-xl" style="width:${progressWidth}%"></div>
      </div>
    </div>

    <div class="bg-white dark:bg-slate-800 rounded-2xl md:rounded-[2rem] korean-shadow p-5 md:p-10 min-h-[440px] flex flex-col border border-blue-50 dark:border-slate-700 relative overflow-hidden">
      <div class="flex-grow z-10">
        <div class="flex justify-center mb-6">
          <span class="${typeInfo.color} text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border flex items-center gap-2">
            <i data-lucide="${typeInfo.icon}" class="w-3 h-3"></i> ${typeInfo.label}
          </span>
        </div>

        ${exercise.type === 'listen' ? `
        <div class="flex justify-center mb-5">
          <button onclick="window.playAudio(event,'${exercise.audioHangul}')"
            class="flex items-center gap-3 bg-pink-500 hover:bg-pink-600 text-white px-8 py-4 rounded-full transition-all hover:scale-105 shadow-xl shadow-pink-500/30 outline-none" aria-label="Riproduci audio">
            <i data-lucide="volume-2" class="w-7 h-7 animate-pulse"></i>
            <span class="font-black text-lg">Riproduci Audio</span>
          </button>
        </div>` : ''}

        ${contextHtml}
        <h2 class="text-xl md:text-2xl font-black text-gray-800 dark:text-gray-200 mb-6 text-center leading-snug">${exercise.question}</h2>
        ${exerciseHtml}
      </div>

      <div class="mt-6 transition-all duration-500 z-10 ${isAnswered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}">
        <div class="p-4 md:p-6 rounded-2xl flex flex-col sm:flex-row gap-4 items-start shadow-sm border-2 ${feedbackCls}">
          <div class="p-2.5 rounded-full text-white shrink-0 shadow-md ${iconCls}">
            <i data-lucide="${isCorrect ? 'check' : 'alert-circle'}" class="w-5 h-5"></i>
          </div>
          <div class="flex-grow w-full">
            <h4 class="font-black text-xl mb-1">${isCorrect ? 'Perfetto, Sara! 🎉' : 'Oops, non ti arrendere! 💪'}</h4>
            <p class="font-bold text-sm mb-2">${feedbackMsg}</p>
            ${correctBuilderText}
            ${!isCorrect && exercise.tip ? `
            <div class="bg-white/50 dark:bg-black/20 p-3 rounded-xl border border-white/40 mt-2 text-xs font-bold text-gray-700 dark:text-gray-300">
              💡 <strong>Hint del Sensei:</strong> ${exercise.tip}
            </div>` : ''}
          </div>
        </div>
        <button onclick="window.nextQuestion()" class="w-full mt-4 py-4 rounded-2xl font-black text-lg text-white shadow-xl transition-all hover:scale-[1.02] ${btnFeedCls} outline-none">
          ${btnText}
        </button>
      </div>
    </div>
  </div>`;
};

/* ---- Result ---- */
export const renderResult = () => {
  const lesson = window.COURSE_DATA.find(d => d.day === state.activeDay);
  const total = lesson.exercises.length;
  const isPerfect = state.score === total;
  const pct = Math.round((state.score / total) * 100);

  if (isPerfect) {
    setTimeout(() => {
      if (window.confetti) confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors: ['#f472b6', '#60a5fa', '#fbbf24'] });
    }, 200);
  }

  return `
  <div class="max-w-lg mx-auto animate-pop">
    <div class="bg-white dark:bg-slate-800 rounded-[2rem] korean-shadow p-8 md:p-10 text-center border border-blue-50 dark:border-slate-700 relative overflow-hidden">
      <div class="hangul-watermark">${isPerfect ? '완' : '노력'}</div>

      <div class="text-7xl mb-4">${isPerfect ? '🏆' : pct >= 70 ? '⭐' : '💪'}</div>
      <h2 class="text-3xl font-black text-gray-900 dark:text-white mb-1">${isPerfect ? 'Perfetta!' : pct >= 70 ? 'Ottimo!' : 'Non Mollare!'}</h2>
      <p class="text-gray-500 dark:text-gray-400 font-bold mb-6 text-sm">Giorno ${lesson.day} — ${lesson.title}</p>

      <!-- Score ring -->
      <div class="relative w-32 h-32 mx-auto mb-6">
        <svg viewBox="0 0 120 120" class="w-full h-full -rotate-90">
          <circle cx="60" cy="60" r="50" fill="none" stroke="#e5e7eb" stroke-width="10"/>
          <circle cx="60" cy="60" r="50" fill="none"
            stroke="${isPerfect ? '#22c55e' : pct >= 70 ? '#f472b6' : '#f97316'}"
            stroke-width="10" stroke-linecap="round"
            stroke-dasharray="${2 * Math.PI * 50}"
            stroke-dashoffset="${2 * Math.PI * 50 * (1 - pct / 100)}"
            style="transition: stroke-dashoffset 1s ease-out;"/>
        </svg>
        <div class="absolute inset-0 flex flex-col items-center justify-center">
          <span class="text-3xl font-black text-gray-900 dark:text-white">${state.score}</span>
          <span class="text-xs font-bold text-gray-400">/ ${total}</span>
        </div>
      </div>

      <div class="flex gap-3 mb-6 justify-center">
        ${[
          { bg: 'bg-orange-50 dark:bg-orange-900/20 border-orange-100 dark:border-orange-800', val: state.streak, label: 'Streak 🔥', color: 'text-orange-600' },
          { bg: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-100 dark:border-yellow-800', val: `+${isPerfect ? 120 : 80} XP`, label: 'Guadagnati ⚡', color: 'text-yellow-600' },
          { bg: 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800', val: `${pct}%`, label: 'Score 🎯', color: 'text-blue-600' },
        ].map(({ bg, val, label, color }) => `
          <div class="${bg} rounded-2xl p-3 text-center flex-1 border">
            <p class="text-xl font-black ${color}">${val}</p>
            <p class="text-[10px] text-gray-500 font-bold uppercase">${label}</p>
          </div>`).join('')}
      </div>

      ${state.newlyUnlockedLocation ? `
      <div class="bg-gradient-to-r from-green-400 to-blue-500 text-white p-4 rounded-2xl mb-5 shadow-lg animate-pop">
        <p class="text-2xl mb-1">🗺️</p>
        <p class="font-black text-lg">Nuova Location Sbloccata!</p>
        <p class="text-white/80 font-bold text-sm">${state.newlyUnlockedLocation.icon} ${state.newlyUnlockedLocation.name}</p>
        <p class="text-white/70 text-xs mt-1">${state.newlyUnlockedLocation.unlockMsg}</p>
      </div>` : ''}

      ${state.currentMistakes.length > 0 ? `
      <div class="bg-rose-50 dark:bg-rose-900/20 border-2 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-300 p-4 rounded-2xl mb-5 text-left">
        <p class="font-black text-sm mb-2 flex items-center gap-2"><i data-lucide="book-open" class="w-4 h-4"></i> Punti deboli da ripassare:</p>
        <div class="flex flex-wrap gap-1.5">
          ${[...new Set(state.currentMistakes)].map(m => `<span class="badge badge-orange text-[10px]">${m}</span>`).join('')}
        </div>
      </div>` : ''}

      <div class="flex flex-col gap-3">
        <button onclick="window.changeView('dashboard')" class="w-full bg-gray-900 dark:bg-slate-950 text-white py-4 rounded-2xl font-black text-lg shadow-xl hover:scale-105 transition-all outline-none">
          🗺️ Torna al Percorso
        </button>
        ${state.completedDays.length < 45 ? `
        <button onclick="window.startDay(${Math.min(state.activeDay + 1, 45)})" class="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-2xl font-black shadow-md hover:scale-105 transition-all outline-none flex items-center justify-center gap-2">
          Prossima Lezione <i data-lucide="arrow-right" class="w-5 h-5"></i>
        </button>` : ''}
      </div>
    </div>
  </div>`;
};
