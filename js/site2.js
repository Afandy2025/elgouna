/**
 * SITE 2: COASTAL EUPHORIA / Y2K CYBER-EDITORIAL
 * Interactive JavaScript Engine: Dynamic Folio Builder, Vibe Shuffle, & Bouncy Physics
 */

document.addEventListener('DOMContentLoaded', () => {
  initY2KReveals();
  initDynamicFolio();
  initVibeShuffler();
  initStickerSoundEffects();
});

/* 1. Bouncy Scroll Reveals */
function initY2KReveals() {
  const reveals = document.querySelectorAll('.y2k-reveal, .y2k-stagger');
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries, o) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          o.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    reveals.forEach(r => obs.observe(r));
  } else {
    reveals.forEach(r => r.classList.add('is-visible'));
  }
}

/* 2. Interactive Summer Folio Builder */
function initDynamicFolio() {
  let vibe = 'CHILL & DUNE';
  let crew = 'COASTAL DUO';
  let days = 'ONE WEEK (7D)';

  const plans = {
    'CHILL & DUNE': [
      { d: 'DAYS 01 - 02: ARRIVE & CHILL', t: 'Casa Cook check-in, sunset session at Zeytouna Pier, dockside dinner at Abu Tig.' },
      { d: 'DAYS 03 - 04: LAGOON DRIFT & SPA', t: 'Overwater hammock sessions, private catamaran sunset cruise, and thalasso ritual.' },
      { d: 'DAYS 05 - 07: DESERT DUSK', t: 'Bedouin stargazing dinner in the Eastern dunes, quiet midnight swim at North Beach.' }
    ],
    'KITE THRILL': [
      { d: 'DAYS 01 - 02: WIND CHECK & RIG', t: 'Mangroovy beach camp setup, 18-knot flat-water freestyle runs, afternoon recovery spritz.' },
      { d: 'DAYS 03 - 04: HYDROFOIL LAB', t: 'Pro hydrofoil wing clinic at Fanadir channel, speed runs, gear swap at Makani.' },
      { d: 'DAYS 05 - 07: REEF DOWNWINDER', t: '25km coastal downwind safari from Tavila sandbar to Mangroovy beach party.' }
    ],
    'NIGHT BEATS': [
      { d: 'DAYS 01 - 02: HARBOR WARMUP', t: 'Waterfront aperitivo at Bartender, dockside dining at The Smokery, Moods warmup set.' },
      { d: 'DAYS 03 - 04: CLUB 88 SUNSET', t: 'Pool daybed sessions, international guest selector house set till 2AM.' },
      { d: 'DAYS 05 - 07: SECRET DESERT RAVE', t: 'Open-air granite canyon stage party under the stars, sunrise lagoon swim.' }
    ],
    'FOOD CRUSH': [
      { d: 'DAYS 01 - 02: SOURDOUGH & CATCH', t: 'Artisanal morning bakery run at Tamr Henna, whole grilled sea bass at quayside 07:00 dock.' },
      { d: 'DAYS 03 - 04: OYSTERS & VINTAGES', t: 'Yellowfin tuna sashimi pairing, natural wine tasting at Abu Tig cellar.' },
      { d: 'DAYS 05 - 07: CHEF\'S TABLE', t: 'Private lagoon villa dinner with local Sinai herb infusions and wood-fired Neapolitan pizza.' }
    ]
  };

  function setupToggle(selector, cb) {
    const btns = document.querySelectorAll(selector);
    btns.forEach(b => {
      b.addEventListener('click', () => {
        btns.forEach(x => {
          x.classList.remove('bg-primary-container', 'bg-secondary', 'bg-deep-ink', 'text-warm-ivory');
          x.classList.add('bg-warm-ivory', 'text-deep-ink');
        });
        b.classList.remove('bg-warm-ivory', 'text-deep-ink');
        b.classList.add('bg-primary-container', 'text-warm-ivory');
        cb(b.textContent.trim());
        render();
      });
    });
  }

  setupToggle('.itinerary-vibe-btn', v => { vibe = v; });
  setupToggle('.itinerary-crew-btn', c => { crew = c; });
  setupToggle('.itinerary-days-btn', d => { days = d; });

  function render() {
    const titleEl = document.getElementById('folio-title');
    const tagEl = document.getElementById('folio-tag');
    const daysContainer = document.getElementById('folio-days');

    if (titleEl) titleEl.textContent = `${vibe} // ${crew}`;
    if (tagEl) tagEl.textContent = days;

    if (daysContainer && plans[vibe]) {
      daysContainer.innerHTML = plans[vibe].map(item => `
        <div class="p-3 bg-off-white border-2 border-deep-ink/20 rounded sticker-shadow-sm transition-all hover:scale-[1.01]">
          <span class="font-label-sm text-label-sm uppercase text-primary font-bold">${item.d}</span>
          <p class="font-body-sm text-body-sm text-deep-ink mt-0.5">${item.t}</p>
        </div>
      `).join('');
    }
  }
}

/* 3. Vibe Shuffler with Elastic Animation */
function initVibeShuffler() {
  const shuffleBtn = document.querySelector('button[onclick*="Shuffled vibes matrix"]');
  const matrixGrid = document.querySelector('#vibes .grid');
  if (!shuffleBtn || !matrixGrid) return;

  shuffleBtn.onclick = null; // replace alert
  shuffleBtn.addEventListener('click', () => {
    const cards = Array.from(matrixGrid.children);
    cards.forEach(c => {
      c.style.transform = 'scale(0.8) rotate(4deg)';
      c.style.opacity = '0.4';
    });

    setTimeout(() => {
      for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        matrixGrid.appendChild(cards[j]);
      }
      cards.forEach(c => {
        c.style.transform = '';
        c.style.opacity = '1';
      });
    }, 280);
  });
}

/* 4. Subtle Tactile Audio Feedback */
function initStickerSoundEffects() {
  const buttons = document.querySelectorAll('.sticker-shadow, .sticker-shadow-sm, .sticker-shadow-lg');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Gentle synthetic pop using AudioContext
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.09);
      } catch (e) {}
    });
  });
}
