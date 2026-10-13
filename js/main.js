/**
 * EL GOUNA — Retro Mediterranean Modernism
 * Interactive Motion Engine, Concierge Generator, Soundscape & UI Controls
 */

document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initCounters();
  initHeroParallax();
  initLiveDispatch();
  initInteractiveMap();
  initItineraryBuilder();
  initImageLightbox();
  initSearchModal();
  initBookmarks();
  initOceanSoundscape();
  initMobileNav();
  initBackToTop();
  initSmoothNavHighlight();
});

/* ==========================================================================
   1. Scroll Reveal Animations (IntersectionObserver)
   ========================================================================== */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-fade');
  
  if (!('IntersectionObserver' in window)) {
    revealElements.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   2. Number Counters with Smooth Easing
   ========================================================================== */
function initCounters() {
  const counterElements = document.querySelectorAll('[data-counter]');
  if (!counterElements.length) return;

  const counterObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const endValue = parseFloat(target.getAttribute('data-counter'));
        const suffix = target.getAttribute('data-suffix') || '';
        const duration = parseInt(target.getAttribute('data-duration') || '1800', 10);
        animateCounter(target, endValue, suffix, duration);
        obs.unobserve(target);
      }
    });
  }, { threshold: 0.3 });

  counterElements.forEach(el => counterObserver.observe(el));
}

function animateCounter(element, target, suffix, duration) {
  let startTimestamp = null;
  const startValue = 0;
  
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    // Easing: easeOutExpo
    const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    const currentValue = Math.floor(easeProgress * (target - startValue) + startValue);
    
    element.textContent = currentValue + suffix;
    
    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      element.textContent = target + suffix;
    }
  };
  
  window.requestAnimationFrame(step);
}

/* ==========================================================================
   3. Hero Visual Parallax & 3D Tilt
   ========================================================================== */
function initHeroParallax() {
  const heroSection = document.getElementById('hero');
  const heroCard = document.querySelector('.hero-tilt-card');
  const heroStamp = document.querySelector('.stamp-badge');
  
  if (!heroSection || !heroCard) return;

  heroSection.addEventListener('mousemove', (e) => {
    const rect = heroSection.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const deltaX = (x - centerX) / centerX;
    const deltaY = (y - centerY) / centerY;
    
    const rotateY = deltaX * 7;
    const rotateX = -deltaY * 7;
    
    heroCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.01)`;
    if (heroStamp) {
      heroStamp.style.transform = `rotate(${-12 + deltaX * 10}deg) translate(${deltaX * 6}px, ${deltaY * 6}px)`;
    }
  });

  heroSection.addEventListener('mouseleave', () => {
    heroCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
    if (heroStamp) {
      heroStamp.style.transform = 'rotate(-12deg)';
    }
  });
}

/* ==========================================================================
   4. Live Teletype Dispatch Ticker
   ========================================================================== */
function initLiveDispatch() {
  const timeElem = document.getElementById('ticker-live-time');
  const windElem = document.getElementById('ticker-wind');
  
  function updateClock() {
    const now = new Date();
    // Red Sea / Hurghada Time (UTC+3)
    const options = { timeZone: 'Africa/Cairo', hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' };
    const timeStr = now.toLocaleTimeString('en-GB', options);
    if (timeElem) timeElem.textContent = `${timeStr} EEST`;
  }
  
  updateClock();
  setInterval(updateClock, 1000);

  // Slight thermal breeze simulation
  let windSpeed = 18;
  setInterval(() => {
    const variation = (Math.random() * 2 - 1).toFixed(1);
    windSpeed = Math.max(14, Math.min(24, parseFloat(windSpeed) + parseFloat(variation))).toFixed(1);
    if (windElem) {
      windElem.textContent = `WIND: ${windSpeed} KNOTS NNE (THERMAL BREEZE)`;
    }
  }, 12000);
}

/* ==========================================================================
   5. Interactive Archipelago Map & Hotspots
   ========================================================================== */
const MAP_HOTSPOTS = [
  {
    id: 'pin-abutig',
    name: 'Abu Tig Marina',
    category: 'marina',
    x: '34%',
    y: '32%',
    coords: '27.3970° N, 33.6780° E',
    desc: 'Deep-water yacht berths, luxury dining promenade, and sunset aperitifs.',
    img: 'assets/photos/abu-tig-marina.jpg',
    tag: 'District 01 · 42 Restaurants'
  },
  {
    id: 'pin-mangroovy',
    name: 'Mangroovy Beach Lagoon',
    category: 'kite',
    x: '72%',
    y: '58%',
    coords: '27.4120° N, 33.6690° E',
    desc: 'Expansive shallow sandbars, flat turquoise water, and world-class kite clubs.',
    img: 'assets/photos/el-gouna-4.jpg',
    tag: 'Kiteboarding Capital'
  },
  {
    id: 'pin-golf',
    name: 'PGA Championship Golf',
    category: 'activity',
    x: '52%',
    y: '48%',
    coords: '27.3850° N, 33.6730° E',
    desc: '18-hole championship desert links designed by Gene Bates and Fred Couples.',
    img: 'assets/photos/Golf_course_El_Gouna_2012.jpg',
    tag: '18 Holes · Lagoon Fairways'
  },
  {
    id: 'pin-zeytouna',
    name: 'Zeytouna Coral Jetty',
    category: 'reef',
    x: '82%',
    y: '36%',
    coords: '27.3910° N, 33.6820° E',
    desc: '600-meter wooden footbridge dropping straight into the reef wall teeming with marine life.',
    img: 'assets/photos/El_Gouna_New_Marina_R05.jpg',
    tag: 'Snorkeling Barrier Wall'
  },
  {
    id: 'pin-tamrhenna',
    name: 'Downtown Tamr Henna',
    category: 'heritage',
    x: '42%',
    y: '68%',
    coords: '27.3880° N, 33.6660° E',
    desc: 'Nubian domed alleyways, artisanal spice souks, and lively evening cafes.',
    img: 'assets/photos/El_Gouna_Library_R02.jpg',
    tag: 'Souks & Cultural Center'
  }
];

function initInteractiveMap() {
  const mapContainer = document.getElementById('map-pins-container');
  const filterBtns = document.querySelectorAll('.map-filter-btn');
  const infoCard = document.getElementById('map-info-card');
  if (!mapContainer) return;

  // Render Pins
  renderMapPins('all');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('bg-maroon', 'text-pure-white');
        b.classList.add('bg-soft-cream', 'text-deep-ink');
      });
      btn.classList.remove('bg-soft-cream', 'text-deep-ink');
      btn.classList.add('bg-maroon', 'text-pure-white');

      const filter = btn.getAttribute('data-filter') || 'all';
      renderMapPins(filter);
    });
  });

  function renderMapPins(filter) {
    mapContainer.innerHTML = '';
    const filtered = MAP_HOTSPOTS.filter(spot => {
      if (filter === 'all') return true;
      if (filter === 'marina') return spot.category === 'marina';
      if (filter === 'kite') return spot.category === 'kite';
      if (filter === 'reef') return spot.category === 'reef';
      return true;
    });

    filtered.forEach((spot, idx) => {
      const pin = document.createElement('div');
      pin.className = `map-marker group absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 transition-all duration-300 ${idx === 0 ? 'active-pin' : ''}`;
      pin.style.left = spot.x;
      pin.style.top = spot.y;
      
      let badgeBg = 'bg-maroon';
      let icon = 'location_on';
      if (spot.category === 'marina') { badgeBg = 'bg-maroon'; icon = 'sailing'; }
      if (spot.category === 'kite') { badgeBg = 'bg-teal'; icon = 'surfing'; }
      if (spot.category === 'reef') { badgeBg = 'bg-secondary'; icon = 'scuba_diving'; }
      if (spot.category === 'activity') { badgeBg = 'bg-sunset-orange'; icon = 'sports_golf'; }

      pin.innerHTML = `
        <div class="${badgeBg} text-pure-white px-2.5 py-1 rounded-md text-xs font-label-sm uppercase tracking-wider flex items-center gap-1.5 shadow-lg border border-pure-white/40 group-hover:scale-110 transition-transform">
          <span class="material-symbols-outlined text-[15px]">${icon}</span>
          <span class="font-bold">${spot.name}</span>
        </div>
      `;

      pin.addEventListener('click', (e) => {
        e.stopPropagation();
        document.querySelectorAll('.map-marker').forEach(m => m.classList.remove('active-pin'));
        pin.classList.add('active-pin');
        showMapInfo(spot);
      });

      mapContainer.appendChild(pin);
    });

    // Show initial spotlight
    if (filtered.length > 0) {
      showMapInfo(filtered[0]);
    }
  }

  function showMapInfo(spot) {
    if (!infoCard) return;
    infoCard.innerHTML = `
      <div class="flex flex-col sm:flex-row items-center gap-4 bg-pure-white p-4 rounded-lg editorial-border shadow-lg animate-fadeIn">
        <div class="w-full sm:w-28 h-20 rounded overflow-hidden flex-shrink-0">
          <img src="${spot.img}" alt="${spot.name}" class="w-full h-full object-cover">
        </div>
        <div class="space-y-1 flex-grow">
          <div class="flex items-center justify-between">
            <h4 class="font-headline-sm text-headline-sm text-maroon font-bold">${spot.name}</h4>
            <span class="text-[11px] font-label-sm bg-sand-peach/60 text-maroon px-2 py-0.5 rounded font-bold uppercase">${spot.tag}</span>
          </div>
          <p class="text-xs text-deep-ink/80 leading-relaxed">${spot.desc}</p>
          <div class="text-[10px] font-label-sm text-teal tracking-wider pt-1 flex items-center gap-2">
            <span>📍 ${spot.coords}</span>
            <span>·</span>
            <a href="#itinerary" class="text-maroon font-bold hover:underline">Include in Itinerary →</a>
          </div>
        </div>
      </div>
    `;
  }
}

/* ==========================================================================
   6. Custom Itinerary Generator with Rich Results Modal
   ========================================================================== */
function initItineraryBuilder() {
  const form = document.getElementById('itinerary-form');
  const resultModal = document.getElementById('itinerary-modal');
  const modalClose = document.getElementById('close-itinerary-modal');
  const modalBody = document.getElementById('itinerary-modal-content');
  if (!form || !resultModal) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const persona = form.querySelector('[name="persona"]')?.value || 'Watersports & High Adrenaline';
    const district = form.querySelector('[name="district"]')?.value || 'Abu Tig Marina';
    const duration = form.querySelector('[name="duration"]')?.value || 'The Full Week (7 Nights)';
    
    // Checked amenities
    const checkedBoxes = Array.from(form.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.dataset.label || cb.nextElementSibling.textContent.trim());

    // Show Loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = `
      <span class="inline-block animate-spin mr-2">⟳</span> Curating Archipelago Journey...
    `;
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      renderItineraryResult({ persona, district, duration, amenities: checkedBoxes });
      resultModal.classList.add('active');
    }, 800);
  });

  if (modalClose) {
    modalClose.addEventListener('click', () => {
      resultModal.classList.remove('active');
    });
  }

  resultModal.addEventListener('click', (e) => {
    if (e.target === resultModal) {
      resultModal.classList.remove('active');
    }
  });

  function renderItineraryResult(data) {
    if (!modalBody) return;

    let dayPlans = [];
    if (data.persona.includes('Watersports')) {
      dayPlans = [
        { day: 'Day 1: Arrival & Lagoon Settling', text: 'Private HRG airport transfer to your villa. Evening sunset drink at Club 88 Marina.' },
        { day: 'Day 2: Flat-Water Kiting & Foiling', text: 'Morning clinic at Mangroovy Lagoon with certified pro instructors. Afternoon dockside lunch.' },
        { day: 'Day 3: Outer Reef Boat Cruise', text: 'Private catamaran charter to Sha’ab El Erg (Dolphin House) for open-water snorkeling with wild dolphins.' }
      ];
    } else if (data.persona.includes('Quiet Luxury')) {
      dayPlans = [
        { day: 'Day 1: Sanctuary Welcome', text: 'Check-in at The Chedi private beachfront pavilion. Ayurvedic thalasso ritual.' },
        { day: 'Day 2: Private Lagoon Sailing', text: 'Electric wooden gondola tour through the 19 islands, followed by tasting dinner at La Maison Bleue.' },
        { day: 'Day 3: Sunrise Yoga & Bedouin Dusk', text: 'Open-air yoga shala overlooking turquoise channels, followed by private Bedouin desert dinner.' }
      ];
    } else {
      dayPlans = [
        { day: 'Day 1: Marina Arrival', text: 'Check-in at waterfront boutique suite. Quayside dinner at The Smokery with fresh oysters.' },
        { day: 'Day 2: Island Discovery & Golf', text: '18-Hole round at Steigenberger Golf Resort, afternoon souk shopping in Downtown Tamr Henna.' },
        { day: 'Day 3: Coral Nursery & Sunset Aperitivo', text: 'Eco-tour at Red Sea coral laboratory followed by artisanal cocktails at Bartender Abu Tig.' }
      ];
    }

    modalBody.innerHTML = `
      <div class="space-y-6">
        <div class="border-b border-muted-sand pb-4 flex justify-between items-start">
          <div>
            <span class="text-xs font-label-sm uppercase tracking-widest text-sunset-orange font-bold">BESPOKE ARCHIPELAGO BLUEPRINT</span>
            <h3 class="font-headline-lg text-headline-lg text-maroon font-serif mt-1">Your Custom El Gouna Journey</h3>
            <p class="text-xs font-label-md uppercase text-deep-ink/70">REFERENCE #EG-${Math.floor(100000 + Math.random() * 900000)} · VALIDATED FOR ${data.duration.toUpperCase()}</p>
          </div>
          <div class="stamp-badge bg-sand-peach/40 px-3 py-1.5 rounded text-center text-maroon font-label-sm uppercase font-bold text-[11px]">
            CONCIERGE<br>VERIFIED
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-soft-cream/60 p-4 rounded-lg editorial-border text-center text-xs">
          <div>
            <div class="text-deep-ink/60 uppercase font-label-sm">TRAVEL PERSONA</div>
            <div class="font-bold text-maroon text-sm mt-0.5">${data.persona}</div>
          </div>
          <div>
            <div class="text-deep-ink/60 uppercase font-label-sm">PRIMARY DISTRICT</div>
            <div class="font-bold text-teal text-sm mt-0.5">${data.district}</div>
          </div>
          <div>
            <div class="text-deep-ink/60 uppercase font-label-sm">LENGTH OF STAY</div>
            <div class="font-bold text-sunset-orange text-sm mt-0.5">${data.duration}</div>
          </div>
        </div>

        <div class="space-y-3">
          <h4 class="font-label-md text-label-md uppercase text-maroon font-bold tracking-wider">Curated Day-By-Day Itinerary</h4>
          <div class="space-y-2.5">
            ${dayPlans.map(dp => `
              <div class="p-3 bg-warm-ivory rounded editorial-border flex items-start gap-3">
                <span class="material-symbols-outlined text-sunset-orange text-lg mt-0.5">check_circle</span>
                <div>
                  <div class="font-bold text-maroon text-xs uppercase font-label-md">${dp.day}</div>
                  <div class="text-xs text-deep-ink mt-0.5">${dp.text}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        ${data.amenities.length > 0 ? `
          <div class="pt-2">
            <h4 class="font-label-md text-label-md uppercase text-maroon font-bold tracking-wider mb-2">Requested Bespoke Inclusions</h4>
            <div class="flex flex-wrap gap-2">
              ${data.amenities.map(a => `
                <span class="px-2.5 py-1 bg-pure-white border border-muted-sand rounded text-xs font-label-sm uppercase text-teal font-semibold flex items-center gap-1">
                  <span>✦</span> ${a}
                </span>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <div class="pt-4 border-t border-muted-sand flex flex-col sm:flex-row items-center justify-between gap-3">
          <div class="text-xs text-deep-ink/70">
            A copy has been dispatched to <strong>concierge@elgouna.com</strong>.
          </div>
          <div class="flex gap-2 w-full sm:w-auto">
            <button onclick="window.print()" class="px-4 py-2 border border-maroon text-maroon hover:bg-maroon hover:text-pure-white rounded font-label-md text-label-md uppercase font-bold transition-colors">
              Print Itinerary
            </button>
            <button onclick="alert('Booking reservation initiated. The Guest Relations Desk will contact you within 2 hours.'); document.getElementById('itinerary-modal').classList.remove('active');" class="px-6 py-2 bg-maroon hover:bg-sunset-orange text-pure-white rounded font-label-md text-label-md uppercase font-bold transition-colors shadow">
              Confirm & Book
            </button>
          </div>
        </div>
      </div>
    `;
  }
}

/* ==========================================================================
   7. Interactive Image Lightbox Modal
   ========================================================================== */
function initImageLightbox() {
  const images = document.querySelectorAll('img[data-alt]');
  const lightbox = document.getElementById('image-lightbox');
  const lightboxImg = document.getElementById('lightbox-image');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.getElementById('close-lightbox');

  if (!lightbox || !lightboxImg) return;

  images.forEach(img => {
    // Add clickable container class
    const parent = img.parentElement;
    if (parent && !img.closest('#map-pins-container') && !img.closest('.brand-logo-img')) {
      parent.classList.add('zoomable-image-container');
      parent.addEventListener('click', (e) => {
        // Prevent opening if clicking a link or button
        if (e.target.closest('a') || e.target.closest('button')) return;
        
        lightboxImg.src = img.src;
        if (lightboxCaption) {
          lightboxCaption.textContent = img.getAttribute('data-alt') || img.alt || 'El Gouna, Red Sea, Egypt';
        }
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    }
  });

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-backdrop')) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}

/* ==========================================================================
   8. Search Modal with Real-time Filtering
   ========================================================================== */
const SEARCH_DIRECTORY = [
  { title: 'Abu Tig Marina', type: 'District', desc: 'Promenade, yacht berths, and boutique bistros.', link: '#explore' },
  { title: 'Downtown Tamr Henna', type: 'District', desc: 'Nubian domed souks, shisha terraces, and spices.', link: '#explore' },
  { title: 'Mangroovy Beach Lagoon', type: 'Activity', desc: 'Flat-water kiteboarding, foiling, and beach clubs.', link: '#explore' },
  { title: 'The Chedi El Gouna', type: 'Accommodation', desc: '5-Star Asian minimalist beachfront villas.', link: '#stays' },
  { title: 'Casa Cook El Gouna', type: 'Accommodation', desc: 'Bohemian chic adults-only desert retreat.', link: '#stays' },
  { title: 'Steigenberger Golf Resort', type: 'Accommodation', desc: 'Michael Graves architecture & 18-hole links.', link: '#stays' },
  { title: 'Sha’ab El Erg (Dolphin House)', type: 'Marine Life', desc: 'Wild Indo-Pacific bottlenose dolphin sanctuary.', link: '#marine' },
  { title: 'The Wrecks of Abu Nuhas', type: 'Marine Life', desc: 'Victorian Carnatic & Giannis D shipwreck diving.', link: '#marine' },
  { title: 'Club 88 Pool & Lounge', type: 'Nightlife', desc: 'Cosmopolitan sunset aperitivo and ocean beats.', link: '#nightlife' },
  { title: 'Bartender Abu Tig', type: 'Nightlife', desc: 'Speakeasy botanicals & Mediterranean amari.', link: '#nightlife' },
  { title: 'PGA Championship Golf', type: 'Sport', desc: '18-hole desert fairway designed by Fred Couples.', link: '#activities' },
  { title: 'Eastern Desert Expeditions', type: 'Safari', desc: 'High-speed buggies and Bedouin night stargazing.', link: '#activities' }
];

function initSearchModal() {
  const searchTriggers = document.querySelectorAll('[aria-label="Search destination"]');
  const searchModal = document.getElementById('search-modal');
  const closeSearchBtn = document.getElementById('close-search-modal');
  const searchInput = document.getElementById('site-search-input');
  const resultsContainer = document.getElementById('search-results-list');

  if (!searchModal) return;

  function openSearch() {
    searchModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    setTimeout(() => searchInput?.focus(), 150);
    renderResults(SEARCH_DIRECTORY);
  }

  function closeSearch() {
    searchModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  searchTriggers.forEach(btn => btn.addEventListener('click', openSearch));
  if (closeSearchBtn) closeSearchBtn.addEventListener('click', closeSearch);

  searchModal.addEventListener('click', (e) => {
    if (e.target === searchModal) closeSearch();
  });

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      searchModal.classList.contains('active') ? closeSearch() : openSearch();
    }
    if (e.key === 'Escape' && searchModal.classList.contains('active')) {
      closeSearch();
    }
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      if (!q) {
        renderResults(SEARCH_DIRECTORY);
        return;
      }
      const filtered = SEARCH_DIRECTORY.filter(item => 
        item.title.toLowerCase().includes(q) || 
        item.type.toLowerCase().includes(q) || 
        item.desc.toLowerCase().includes(q)
      );
      renderResults(filtered);
    });
  }

  function renderResults(list) {
    if (!resultsContainer) return;
    if (list.length === 0) {
      resultsContainer.innerHTML = `
        <div class="py-8 text-center text-deep-ink/60">
          <p class="font-headline-sm text-sm">No archipelago records found matching your query.</p>
        </div>
      `;
      return;
    }

    resultsContainer.innerHTML = list.map(item => `
      <a href="${item.link}" onclick="document.getElementById('search-modal').classList.remove('active'); document.body.style.overflow='';" class="p-3.5 bg-warm-ivory hover:bg-sand-peach/30 rounded editorial-border flex items-center justify-between transition-colors group">
        <div>
          <div class="flex items-center gap-2">
            <span class="font-bold text-maroon group-hover:text-sunset-orange transition-colors text-sm">${item.title}</span>
            <span class="text-[10px] font-label-sm uppercase px-1.5 py-0.5 rounded bg-pure-white border border-muted-sand text-teal font-semibold">${item.type}</span>
          </div>
          <p class="text-xs text-deep-ink/70 mt-0.5">${item.desc}</p>
        </div>
        <span class="material-symbols-outlined text-maroon group-hover:translate-x-1 transition-transform text-sm">arrow_forward</span>
      </a>
    `).join('');
  }
}

/* ==========================================================================
   9. Saved Bookmarks Drawer & Persistence
   ========================================================================== */
function initBookmarks() {
  let bookmarks = JSON.parse(localStorage.getItem('elgona_saved_places') || '[]');
  const bookmarkTriggers = document.querySelectorAll('[aria-label="Saved Itinerary"]');
  const drawer = document.getElementById('bookmarks-drawer');
  const closeBtn = document.getElementById('close-bookmarks-drawer');
  const listContainer = document.getElementById('bookmarks-list');
  const countBadge = document.getElementById('bookmarks-count');

  updateBookmarkUI();

  // Attach bookmark actions to all cards
  const cards = document.querySelectorAll('.editorial-card, [id="explore"] .bg-pure-white, [id="stays"] .bg-pure-white');
  cards.forEach(card => {
    const title = card.querySelector('h3')?.textContent?.trim();
    if (!title) return;

    // Check if card already has a bookmark button
    if (!card.querySelector('.card-bookmark-btn')) {
      const btn = document.createElement('button');
      btn.className = 'card-bookmark-btn absolute top-3 right-3 w-8 h-8 rounded-full bg-pure-white/90 backdrop-blur-sm editorial-border text-deep-ink hover:text-sunset-orange flex items-center justify-center transition-colors shadow z-10';
      btn.title = 'Save to Archipelago List';
      btn.innerHTML = `<span class="material-symbols-outlined text-sm">bookmark_border</span>`;

      // Check state
      if (bookmarks.some(b => b.title === title)) {
        btn.classList.add('text-maroon');
        btn.innerHTML = `<span class="material-symbols-outlined text-sm">bookmark</span>`;
      }

      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleBookmark(title, card);
      });

      card.appendChild(btn);
    }
  });

  function toggleBookmark(title, card) {
    const exists = bookmarks.some(b => b.title === title);
    const btn = card?.querySelector('.card-bookmark-btn');

    if (exists) {
      bookmarks = bookmarks.filter(b => b.title !== title);
      if (btn) {
        btn.classList.remove('text-maroon');
        btn.innerHTML = `<span class="material-symbols-outlined text-sm">bookmark_border</span>`;
      }
    } else {
      const subtitle = card?.querySelector('p')?.textContent?.trim()?.slice(0, 80) + '...' || 'El Gouna Experience';
      bookmarks.push({ title, subtitle, date: new Date().toLocaleDateString() });
      if (btn) {
        btn.classList.add('text-maroon');
        btn.innerHTML = `<span class="material-symbols-outlined text-sm">bookmark</span>`;
      }
      showToast(`Saved "${title}" to your itinerary!`);
    }

    localStorage.setItem('elgona_saved_places', JSON.stringify(bookmarks));
    updateBookmarkUI();
  }

  function updateBookmarkUI() {
    if (countBadge) {
      countBadge.textContent = bookmarks.length;
      countBadge.style.display = bookmarks.length > 0 ? 'inline-flex' : 'none';
    }

    if (!listContainer) return;

    if (bookmarks.length === 0) {
      listContainer.innerHTML = `
        <div class="py-12 text-center text-deep-ink/60 space-y-2">
          <span class="material-symbols-outlined text-3xl text-muted-sand">bookmark_border</span>
          <p class="font-headline-sm text-sm">No saved places yet.</p>
          <p class="text-xs">Tap the bookmark badge on any district, hotel, or activity card to add it here.</p>
        </div>
      `;
      return;
    }

    listContainer.innerHTML = bookmarks.map((b, i) => `
      <div class="p-3 bg-warm-ivory rounded editorial-border flex justify-between items-center gap-3">
        <div>
          <h5 class="font-bold text-maroon text-xs uppercase">${b.title}</h5>
          <p class="text-[11px] text-deep-ink/70 mt-0.5 line-clamp-1">${b.subtitle}</p>
        </div>
        <button onclick="removeBookmark(${i})" class="text-xs text-maroon hover:text-error p-1" title="Remove">
          <span class="material-symbols-outlined text-sm">delete</span>
        </button>
      </div>
    `).join('');
  }

  window.removeBookmark = function(index) {
    bookmarks.splice(index, 1);
    localStorage.setItem('elgona_saved_places', JSON.stringify(bookmarks));
    updateBookmarkUI();
  };

  bookmarkTriggers.forEach(btn => {
    btn.addEventListener('click', () => {
      if (drawer) {
        drawer.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (closeBtn && drawer) {
    closeBtn.addEventListener('click', () => {
      drawer.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  if (drawer) {
    drawer.addEventListener('click', (e) => {
      if (e.target === drawer) {
        drawer.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }
}

/* ==========================================================================
   10. Synthetic Ocean Waves Audio Experience (Web Audio API)
   ========================================================================== */
function initOceanSoundscape() {
  const audioBtn = document.getElementById('ambient-sound-toggle');
  if (!audioBtn) return;

  let audioCtx = null;
  let isPlaying = false;
  let gainNode = null;
  let noiseNode = null;
  let filterNode = null;
  let lfoNode = null;

  audioBtn.addEventListener('click', () => {
    if (!isPlaying) {
      startOceanWaves();
    } else {
      stopOceanWaves();
    }
  });

  function startOceanWaves() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();

      // Buffer for pink/brown soothing sea noise
      const bufferSize = audioCtx.sampleRate * 2;
      const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99 * b0 + white * 0.05;
        b1 = 0.95 * b1 + white * 0.1;
        b2 = 0.85 * b2 + white * 0.2;
        output[i] = (b0 + b1 + b2) * 0.25;
      }

      noiseNode = audioCtx.createBufferSource();
      noiseNode.buffer = noiseBuffer;
      noiseNode.loop = true;

      // Low pass filter for muffled deep water sound
      filterNode = audioCtx.createBiquadFilter();
      filterNode.type = 'lowpass';
      filterNode.frequency.value = 420;

      // LFO to simulate rolling ocean waves swelling in and out
      lfoNode = audioCtx.createOscillator();
      lfoNode.frequency.value = 0.12; // 8-second wave period
      const lfoGain = audioCtx.createGain();
      lfoGain.gain.value = 260;
      lfoNode.connect(lfoGain);
      lfoGain.connect(filterNode.frequency);

      gainNode = audioCtx.createGain();
      gainNode.gain.setValueAtTime(0.01, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.2, audioCtx.currentTime + 2);

      noiseNode.connect(filterNode);
      filterNode.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      noiseNode.start();
      lfoNode.start();
      isPlaying = true;

      audioBtn.classList.add('audio-playing');
      audioBtn.setAttribute('title', 'Pause Mediterranean Sea Breeze');
      showToast('Mediterranean Sea Breeze Ambient Sound Started');
    } catch (err) {
      console.warn('Web Audio error:', err);
    }
  }

  function stopOceanWaves() {
    if (gainNode && audioCtx) {
      gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.8);
      setTimeout(() => {
        if (noiseNode) noiseNode.stop();
        if (lfoNode) lfoNode.stop();
        if (audioCtx) audioCtx.close();
        isPlaying = false;
        audioBtn.classList.remove('audio-playing');
        audioBtn.setAttribute('title', 'Listen to Mediterranean Sea Breeze');
      }, 850);
    }
  }
}

/* ==========================================================================
   11. Mobile Slide-Over Navigation Drawer
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const drawer = document.getElementById('mobile-drawer');
  const closeBtn = document.getElementById('close-mobile-drawer');
  const navLinks = drawer ? drawer.querySelectorAll('a') : [];

  if (!toggleBtn || !drawer) return;

  function openDrawer() {
    drawer.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('active');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

  drawer.addEventListener('click', (e) => {
    if (e.target === drawer) closeDrawer();
  });

  navLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

/* ==========================================================================
   12. Back To Top Floating Compass
   ========================================================================== */
function initBackToTop() {
  const btn = document.getElementById('back-to-top-btn');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 450) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ==========================================================================
   13. Active Nav Link on Scroll
   ========================================================================== */
function initSmoothNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('header nav a');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('border-b-2', 'border-maroon', 'text-maroon', 'font-bold');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('border-b-2', 'border-maroon', 'text-maroon', 'font-bold');
      }
    });
  });
}

/* ==========================================================================
   Helper: Minimalist Toast Notification
   ========================================================================== */
function showToast(message) {
  let toast = document.getElementById('editorial-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'editorial-toast';
    toast.className = 'fixed bottom-6 left-6 z-50 bg-deep-ink text-warm-ivory px-4 py-2.5 rounded-lg editorial-border shadow-2xl font-label-md text-xs uppercase tracking-wider flex items-center gap-2 transform translate-y-12 opacity-0 transition-all duration-300 pointer-events-none';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<span class="material-symbols-outlined text-sunset-orange text-sm">stars</span> ${message}`;
  toast.classList.remove('translate-y-12', 'opacity-0');
  toast.classList.add('translate-y-0', 'opacity-100');

  setTimeout(() => {
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('translate-y-12', 'opacity-0');
  }, 3200);
}
