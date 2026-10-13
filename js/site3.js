/**
 * SITE 3: RED SEA TRAVEL GAZETTE & RESORT ARCHIVE (1978–1988)
 * Interactive Script: Vintage Ledger Counters, Soundings Chart Filter, & Prospectus Generator
 */

document.addEventListener('DOMContentLoaded', () => {
  initVintageReveals();
  initLedgerCounters();
  initSoundingsFilter();
  initTelegraphProspectus();
});

/* 1. Vintage Scroll Reveals */
function initVintageReveals() {
  const reveals = document.querySelectorAll('.vintage-reveal');
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

/* 2. Hotel Ledger Numbers Counter */
function initLedgerCounters() {
  const ledgerValues = document.querySelectorAll('.vintage-card .font-headline-lg');
  if (!ledgerValues.length) return;

  const obs = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const rawText = el.textContent.trim();
        const target = parseInt(rawText, 10);
        if (isNaN(target)) return;

        let current = 0;
        const duration = 1500;
        const startTime = performance.now();

        function update(now) {
          const progress = Math.min((now - startTime) / duration, 1);
          const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
          const val = Math.floor(ease * target);
          el.textContent = val < 10 && target < 10 ? `0${val}` : `${val}`;

          if (progress < 1) {
            requestAnimationFrame(update);
          } else {
            el.textContent = rawText;
          }
        }
        requestAnimationFrame(update);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.25 });

  ledgerValues.forEach(v => obs.observe(v));
}

/* 3. Soundings Chart Channel Filter */
function initSoundingsFilter() {
  const filterBtns = document.querySelectorAll('#map-section button, section:has(img[data-location]) button');
  const chartPins = document.querySelectorAll('.absolute.shadow.flex.items-center');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('bg-maroon', 'text-pure-white');
        b.classList.add('bg-soft-cream', 'text-deep-ink');
      });
      btn.classList.remove('bg-soft-cream', 'text-deep-ink');
      btn.classList.add('bg-maroon', 'text-pure-white');

      const text = btn.textContent.toLowerCase();
      chartPins.forEach(pin => {
        if (text.includes('all')) {
          pin.style.display = 'flex';
          pin.style.transform = 'scale(1.05)';
        } else if (text.includes('marina') && pin.textContent.toLowerCase().includes('marina')) {
          pin.style.display = 'flex';
          pin.style.transform = 'scale(1.2)';
        } else if (text.includes('kite') && pin.textContent.toLowerCase().includes('mangroovy')) {
          pin.style.display = 'flex';
          pin.style.transform = 'scale(1.2)';
        } else if (text.includes('coral') && pin.textContent.toLowerCase().includes('golf')) {
          pin.style.display = 'flex';
          pin.style.transform = 'scale(1.2)';
        } else {
          pin.style.display = text.includes('all') ? 'flex' : 'none';
        }
      });
    });
  });
}

/* 4. Vintage Telegraph Prospectus Booking Feedback */
function initTelegraphProspectus() {
  const form = document.querySelector('form[onsubmit*="prospectus has been telegraphed"]');
  if (!form) return;

  form.onsubmit = null;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'TELEGRAPHING WIRE...';
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = 'PROSPECTUS DISPATCHED ✦';
      btn.classList.add('bg-teal');
      alert('✦ DISPATCH CONFIRMED ✦\nYour individual Red Sea itinerary prospectus has been wired to the El Gouna Concierge Desk. Formal sea mail dossier scheduled for departure.');
      setTimeout(() => {
        btn.textContent = originalText;
        btn.classList.remove('bg-teal');
        btn.disabled = false;
      }, 3500);
    }, 700);
  });
}
