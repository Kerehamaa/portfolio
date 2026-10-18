// Move safely: course engine. Reusable pieces, all fed by course-data.js:
// ProgressBar, SectionNav, FlipCards, Steps, Scenario, Quiz, Results.
(() => {
  const C = window.COURSE;
  const S = window.SOURCES;
  const LEVELS = C.levels.length;
  const KEY = 'move-safely-v1';

  // ---------- Icons (inline SVG, no emoji) ----------
  const svg = (d, size = 20) => `<svg class="icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
  const ICON = {
    star: svg('<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>'),
    info: svg('<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>'),
    shield: svg('<path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z"/>'),
    check: svg('<path d="M5 12.5l4.5 4.5L19 7.5"/>'),
    x: svg('<path d="M6 6l12 12M18 6L6 18"/>'),
    next: svg('<path d="M5 12h14M13 6l6 6-6 6"/>'),
    back: svg('<path d="M19 12H5M11 6l-6 6 6 6"/>'),
    flip: svg('<path d="M4 12a8 8 0 0 1 14-5.3L20 9M20 4v5h-5M20 12a8 8 0 0 1-14 5.3L4 15M4 20v-5h5"/>', 16),
    trophy: svg('<path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8 20h8M10 17h4"/>', 28),
    restart: svg('<path d="M4 12a8 8 0 1 0 3-6.2M4 4v4h4"/>'),
  };

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  // ---------- State (saved in this browser only) ----------
  const fresh = () => ({ done: Array(LEVELS).fill(false), flipped: {}, scenario: { tried: [], solved: false, bonus: false }, quiz: { picked: {} } });
  let state = fresh();
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    if (saved && Array.isArray(saved.done) && saved.done.length === LEVELS) state = Object.assign(fresh(), saved);
  } catch (e) { /* private mode or blocked storage: start fresh */ }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* ignore */ } };

  const quizBlock = () => C.levels[LEVELS - 1].blocks.find((b) => b.type === 'quiz');
  const maxPoints = () => LEVELS * C.points.level + quizBlock().questions.length * C.points.question + C.points.scenario;
  const points = () => {
    const q = quizBlock();
    const right = Object.entries(state.quiz.picked).filter(([i, p]) => q.questions[i].answer === p).length;
    return state.done.filter(Boolean).length * C.points.level + right * C.points.question + (state.scenario.bonus ? C.points.scenario : 0);
  };

  // ---------- Elements ----------
  const screen = document.getElementById('screen');
  const nav = document.getElementById('nav');
  const pointsEl = document.getElementById('points');
  const progressEl = document.getElementById('progress');
  let hint = document.createElement('p');
  hint.className = 'nav-hint';
  hint.setAttribute('aria-live', 'polite');
  nav.after(hint);

  let current = 0; // 0..LEVELS-1 are levels, LEVELS is the results screen
  let lastPoints = points();

  // ---------- ProgressBar ----------
  function ProgressBar() {
    const doneCount = state.done.filter(Boolean).length;
    const pct = Math.round((doneCount / LEVELS) * 100);
    const label = current < LEVELS ? `Level ${current + 1} of ${LEVELS}` : 'Course complete';
    progressEl.innerHTML = `
      <div class="progress-label"><span>${label}</span><span>${pct}% done</span></div>
      <div class="progress-track" role="progressbar" aria-label="Course progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}">
        <div class="progress-fill" style="width:${pct}%"></div>
      </div>`;
  }

  function updatePoints() {
    const p = points();
    pointsEl.textContent = `${p} pts`;
    if (p > lastPoints) {
      pointsEl.classList.remove('bump');
      void pointsEl.offsetWidth;
      pointsEl.classList.add('bump');
    }
    lastPoints = p;
  }

  // ---------- Blocks ----------
  function TextBlock(b) { return `<p>${b.html}</p>`; }
  function ListBlock(b) { return `<ul>${b.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`; }
  function Callout(b) {
    return `<div class="callout ${b.tone || ''}">
      ${ICON[b.icon] || ''}
      <div>
        <h2>${esc(b.title)}</h2>
        <p>${b.html}</p>
        ${b.items ? ListBlock(b) : ''}
        ${b.after ? `<p>${b.after}</p>` : ''}
      </div>
    </div>`;
  }
  function Steps(b) {
    return `<ol class="steps">${b.items.map((s, i) => `
      <li><span class="n" aria-hidden="true">${i + 1}</span><span><strong>${esc(s.title)}</strong>${esc(s.text)}</span></li>`).join('')}
    </ol>`;
  }

  // FlipCard: a real button; aria-pressed says which side is showing.
  function FlipCards(b, lv) {
    const key = (i) => `${lv}-${i}`;
    const html = `<div class="flip-grid">${b.cards.map((c, i) => {
      const on = !!state.flipped[key(i)];
      return `<button type="button" class="flip" data-flip="${i}" aria-pressed="${on}">
        <span class="flip-inner">
          <span class="face front" aria-hidden="${on}">
            <span class="num">${i + 1} of ${b.cards.length}</span>
            <strong>${esc(c.front)}</strong>
            <span class="hint">${ICON.flip} Flip card</span>
          </span>
          <span class="face back" aria-hidden="${!on}">
            <span>${esc(c.back)}</span>
            <span class="hint">${ICON.flip} Flip back</span>
          </span>
        </span>
      </button>`;
    }).join('')}</div>
    <p class="flip-count" aria-live="polite"></p>`;
    const after = (root) => {
      const count = root.querySelector('.flip-count');
      const total = b.cards.length;
      const refresh = () => {
        const n = b.cards.filter((_, i) => state.flipped[key(i)]).length;
        count.textContent = n === total ? 'All five checked. Nice work.' : `${n} of ${total} cards checked`;
      };
      root.querySelectorAll('.flip').forEach((btn) => {
        btn.addEventListener('click', () => {
          const i = btn.dataset.flip;
          const on = btn.getAttribute('aria-pressed') !== 'true';
          btn.setAttribute('aria-pressed', String(on));
          btn.querySelector('.front').setAttribute('aria-hidden', String(on));
          btn.querySelector('.back').setAttribute('aria-hidden', String(!on));
          if (on) state.flipped[key(i)] = true;
          save();
          refresh();
          SectionNav();
        });
      });
      refresh();
    };
    const ready = () => b.cards.every((_, i) => state.flipped[key(i)]);
    return { html, after, ready, blocked: 'Flip all five cards to unlock the next level.' };
  }

  // Scenario: choices with feedback; wrong ones can be retried; bonus if the best one is picked first.
  function Scenario(b) {
    const letters = 'ABC';
    const html = `<div class="situation">${esc(b.situation)}</div>
      <div class="choices" role="group" aria-label="Your choices">${b.choices.map((c, i) => `
        <button type="button" class="choice" data-choice="${i}"><span class="letter" aria-hidden="true">${letters[i]}</span><span>${esc(c.text)}</span></button>`).join('')}
      </div>
      <div class="feedback" aria-live="polite"></div>`;
    const after = (root) => {
      const fb = root.querySelector('.feedback');
      const paint = (shown) => {
        root.querySelectorAll('.choice').forEach((btn) => {
          const i = +btn.dataset.choice;
          btn.classList.toggle('wrong', state.scenario.tried.includes(i) && !b.choices[i].best);
          btn.classList.toggle('right', state.scenario.solved && !!b.choices[i].best);
          btn.classList.toggle('dim', state.scenario.solved && !b.choices[i].best);
          if (state.scenario.solved) btn.setAttribute('aria-disabled', 'true');
        });
        if (shown != null) {
          const c = b.choices[shown];
          const extra = c.best && state.scenario.bonus ? ` +${C.points.scenario} bonus points.` : '';
          fb.className = 'feedback ' + (c.best ? 'good' : 'bad');
          fb.innerHTML = `${c.best ? ICON.check : ICON.x}<span>${esc(c.feedback)}${extra}</span>`;
        }
      };
      root.querySelectorAll('.choice').forEach((btn) => {
        btn.addEventListener('click', () => {
          if (state.scenario.solved) return;
          const i = +btn.dataset.choice;
          if (b.choices[i].best) {
            state.scenario.bonus = state.scenario.tried.length === 0;
            state.scenario.solved = true;
          }
          if (!state.scenario.tried.includes(i)) state.scenario.tried.push(i);
          save();
          paint(i);
          updatePoints();
          SectionNav();
        });
      });
      const best = b.choices.findIndex((c) => c.best);
      paint(state.scenario.solved ? best : state.scenario.tried.length ? state.scenario.tried[state.scenario.tried.length - 1] : null);
    };
    return { html, after, ready: () => state.scenario.solved, blocked: 'Find the safest choice to unlock the last level.' };
  }

  // Quiz: one try per question, feedback straight away, score at the end.
  function Quiz(b) {
    const letters = 'ABC';
    const html = b.questions.map((q, qi) => `
      <fieldset class="question" data-q="${qi}">
        <legend><span class="q-count">Question ${qi + 1} of ${b.questions.length}</span>${esc(q.q)}</legend>
        <div class="choices">${q.options.map((o, oi) => `
          <button type="button" class="choice" data-o="${oi}"><span class="letter" aria-hidden="true">${letters[oi]}</span><span>${esc(o)}</span></button>`).join('')}
        </div>
        <div class="feedback" aria-live="polite"></div>
      </fieldset>`).join('');
    const after = (root) => {
      const paint = (fs, qi) => {
        const q = b.questions[qi];
        const picked = state.quiz.picked[qi];
        if (picked == null) return;
        fs.querySelectorAll('.choice').forEach((btn) => {
          const oi = +btn.dataset.o;
          btn.setAttribute('aria-disabled', 'true');
          btn.classList.toggle('right', oi === q.answer);
          btn.classList.toggle('wrong', oi === picked && picked !== q.answer);
          btn.classList.toggle('dim', oi !== q.answer && oi !== picked);
        });
        const ok = picked === q.answer;
        const fb = fs.querySelector('.feedback');
        fb.className = 'feedback ' + (ok ? 'good' : 'bad');
        fb.innerHTML = `${ok ? ICON.check : ICON.x}<span>${ok ? `Correct, +${C.points.question} points. ` : `Not quite. The answer is ${letters[q.answer]}. `}${esc(q.feedback)}</span>`;
      };
      root.querySelectorAll('.question').forEach((fs) => {
        const qi = +fs.dataset.q;
        fs.querySelectorAll('.choice').forEach((btn) => {
          btn.addEventListener('click', () => {
            if (state.quiz.picked[qi] != null) return;
            state.quiz.picked[qi] = +btn.dataset.o;
            save();
            paint(fs, qi);
            updatePoints();
            SectionNav();
          });
        });
        paint(fs, qi);
      });
    };
    const ready = () => b.questions.every((_, qi) => state.quiz.picked[qi] != null);
    return { html, after, ready, blocked: 'Answer all five questions to see your results.' };
  }

  const BLOCKS = { text: TextBlock, list: ListBlock, callout: Callout, steps: Steps, flipcards: FlipCards, scenario: Scenario, quiz: Quiz };

  function Sources(keys) {
    if (!keys.length) return '';
    return `<div class="sources">Sources
      <ul>${keys.map((k) => `<li><a href="${S[k].url}" target="_blank" rel="noopener">${esc(S[k].label)}</a></li>`).join('')}</ul>
    </div>`;
  }

  // ---------- Screens ----------
  let gates = [];

  function LevelScreen(lv) {
    const level = C.levels[lv];
    gates = [];
    const parts = level.blocks.map((b) => {
      const out = BLOCKS[b.type](b, lv);
      if (typeof out === 'string') return { html: out };
      gates.push(out);
      return out;
    });
    screen.innerHTML = `
      <span class="level-tag">Level ${lv + 1}</span>
      <h1 tabindex="-1">${esc(level.heading)}</h1>
      ${parts.map((p) => p.html).join('')}
      ${Sources(level.sources)}`;
    parts.forEach((p) => p.after && p.after(screen));
  }

  function ResultsScreen() {
    gates = [];
    const p = points();
    const max = maxPoints();
    const q = quizBlock();
    const right = Object.entries(state.quiz.picked).filter(([i, pk]) => q.questions[i].answer === pk).length;
    screen.innerHTML = `
      <span class="level-tag">Complete</span>
      <h1 tabindex="-1">You finished Move safely</h1>
      <div class="score">
        <span style="color:var(--q-600)">${ICON.trophy}</span>
        <div class="big">${p}</div>
        <div class="of">of ${max} points</div>
        <div class="badge-row">
          <span class="badge">${right} of ${q.questions.length} quiz answers right</span>
          <span class="badge">${state.scenario.bonus ? 'Scenario bonus earned' : 'Scenario solved'}</span>
        </div>
      </div>
      <h2 style="font-size:1.15rem;font-weight:800;margin:0 0 8px">Remember</h2>
      ${ListBlock({ items: C.summary })}
      <div class="callout note">${ICON.info}<div><h2>Sample course</h2><p>This was a sample made for a portfolio, not accredited training. Your workplace's own training and procedures always come first.</p></div></div>
      ${Sources(['W1', 'W2', 'ACC'])}`;
  }

  // ---------- SectionNav ----------
  function SectionNav() {
    const atResults = current === LEVELS;
    const blockedGate = gates.find((g) => !g.ready());
    const backBtn = current > 0 && !atResults
      ? `<button type="button" class="btn secondary" data-go="back">${ICON.back} Back</button>` : '';
    let primary;
    if (atResults) {
      primary = `<button type="button" class="btn secondary" data-go="restart">${ICON.restart} Start again</button>
        <a class="btn primary" href="https://portfolio.kerehama.nz">Back to portfolio</a>`;
    } else {
      const label = C.levels[current].next;
      primary = `<button type="button" class="btn primary" data-go="next" aria-disabled="${!!blockedGate}">${esc(label)} ${ICON.next}</button>`;
    }
    nav.innerHTML = backBtn + primary;
    hint.textContent = blockedGate ? blockedGate.blocked : '';
    nav.querySelectorAll('[data-go]').forEach((btn) => btn.addEventListener('click', () => {
      const go = btn.dataset.go;
      if (go === 'back') show(current - 1);
      if (go === 'restart') { state = fresh(); save(); lastPoints = 0; show(0); }
      if (go === 'next') {
        const g = gates.find((x) => !x.ready());
        if (g) { hint.textContent = ''; void hint.offsetWidth; hint.textContent = g.blocked; return; }
        state.done[current] = true;
        save();
        show(current + 1);
      }
    }));
  }

  // Furthest screen the learner is allowed to open (no skipping ahead).
  const furthest = () => {
    const firstUndone = state.done.indexOf(false);
    return firstUndone === -1 ? LEVELS : firstUndone;
  };

  function show(n, fromHash) {
    current = Math.max(0, Math.min(n, furthest()));
    const hash = current === LEVELS ? '#results' : `#level-${current + 1}`;
    if (location.hash !== hash) history[fromHash ? 'replaceState' : 'pushState'](null, '', hash);
    if (current === LEVELS) ResultsScreen(); else LevelScreen(current);
    document.title = (current === LEVELS ? 'Results' : `Level ${current + 1}`) + ' | Move safely';
    ProgressBar();
    updatePoints();
    SectionNav();
    window.scrollTo(0, 0);
    if (!fromHash || n !== 0) screen.querySelector('h1').focus({ preventScroll: true });
  }

  const fromLocation = () => {
    const m = location.hash.match(/^#level-(\d+)$/);
    if (location.hash === '#results') return LEVELS;
    if (m) return +m[1] - 1;
    return furthest() === LEVELS ? LEVELS : furthest();
  };

  window.addEventListener('popstate', () => show(fromLocation(), true));
  show(fromLocation(), true);
})();
