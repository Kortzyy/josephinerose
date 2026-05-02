/* ═══════════════════════════════════════════════════
   BIRTHDAY WEBSITE — script.js
═══════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── 1. FLOATING PETALS ── */
  const PETALS = ['🌸', '🌷', '✿', '❀', '✦', '🌺', '💮', '🌹'];
  const petalContainer = document.getElementById('petals');

  function spawnPetal() {
    const el = document.createElement('div');
    el.className = 'petal';
    el.textContent = PETALS[Math.floor(Math.random() * PETALS.length)];
    el.style.left = Math.random() * 100 + 'vw';
    el.style.fontSize = (0.7 + Math.random() * 1.1) + 'rem';
    const dur = 8 + Math.random() * 10;
    el.style.animationDuration = dur + 's';
    el.style.animationDelay    = (Math.random() * 5) + 's';
    el.style.opacity           = (0.3 + Math.random() * 0.4).toString();
    petalContainer.appendChild(el);
    setTimeout(() => el.remove(), (dur + 5) * 1000);
  }
  for (let i = 0; i < 18; i++) setTimeout(spawnPetal, i * 400);
  setInterval(spawnPetal, 1800);


  /* ── 2. NAV SCROLL EFFECT ── */
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });


  /* ── 3. HAMBURGER MENU ── */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.querySelector('.nav-links');
  hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => navLinks.classList.remove('open'))
  );


  /* ── 4. SCROLL REVEAL ── */
  const revealEls = document.querySelectorAll(
    '.home-text, .home-headline-wrap, .about-grid, ' +
    '.fact-card, .about-quote, .masonry-item, ' +
    '.msg-card, .section-tag, .section-title'
  );
  revealEls.forEach((el, i) => {
    el.classList.add('reveal');
    if (i % 3 === 1) el.classList.add('reveal-delay-1');
    if (i % 3 === 2) el.classList.add('reveal-delay-2');
  });
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  revealEls.forEach(el => revealObs.observe(el));


  /* ── 5. GALLERY LIGHTBOX ── */
  const masonryItems = Array.from(document.querySelectorAll('.masonry-item'));
  const lightbox     = document.getElementById('lightbox');
  const lbImg        = document.getElementById('lbImg');
  const lbCaption    = document.getElementById('lbCaption');
  const lbCounter    = document.getElementById('lbCounter');
  const lbClose      = document.getElementById('lbClose');
  const lbPrev       = document.getElementById('lbPrev');
  const lbNext       = document.getElementById('lbNext');
  const lbBackdrop   = document.getElementById('lbBackdrop');

  let current = 0;

  // Build image list from masonry items
  const gallery = masonryItems.map(item => {
    const img = item.querySelector('img');
    return {
      src:     img.src,
      alt:     img.alt,
      caption: item.querySelector('.gallery-overlay span')?.textContent || ''
    };
  });

  function openLightbox(index) {
    current = index;
    updateLightbox();
    // Lock scroll without jumping the page back to top
    const scrollY = window.scrollY;
    document.body.style.position   = 'fixed';
    document.body.style.top        = `-${scrollY}px`;
    document.body.style.width      = '100%';
    document.body.dataset.scrollY  = scrollY;
    lightbox.classList.add('lb-open');
    document.body.classList.add('lb-is-open');
    lbClose.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('lb-open');
    document.body.classList.remove('lb-is-open');
    // Restore scroll position exactly where user was
    const scrollY = parseInt(document.body.dataset.scrollY || '0', 10);
    document.body.style.position = '';
    document.body.style.top      = '';
    document.body.style.width    = '';
    window.scrollTo(0, scrollY);
    setTimeout(() => { lbImg.src = ''; }, 300);
  }

  function updateLightbox() {
    const item = gallery[current];
    // Reset animation
    lbImg.style.animation = 'none';
    lbImg.offsetHeight; // reflow
    lbImg.style.animation = '';
    lbImg.src     = item.src;
    lbImg.alt     = item.alt;
    lbCaption.textContent = item.caption;
    lbCounter.textContent = `${current + 1} / ${gallery.length}`;
  }

  function showNext() {
    current = (current + 1) % gallery.length;
    updateLightbox();
  }

  function showPrev() {
    current = (current - 1 + gallery.length) % gallery.length;
    updateLightbox();
  }

  // Open on click
  masonryItems.forEach((item, i) =>
    item.addEventListener('click', () => openLightbox(i))
  );

  lbClose.addEventListener('click', closeLightbox);
  lbBackdrop.addEventListener('click', closeLightbox);
  lbNext.addEventListener('click', (e) => { e.stopPropagation(); showNext(); });
  lbPrev.addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });

  // Keyboard
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('lb-open')) return;
    if (e.key === 'Escape')     { closeLightbox(); }
    if (e.key === 'ArrowRight') { showNext(); }
    if (e.key === 'ArrowLeft')  { showPrev(); }
  });

  // Touch / swipe support
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });
  lightbox.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) {
      dx < 0 ? showNext() : showPrev();
    }
  }, { passive: true });


  /* ── 6. ACTIVE NAV HIGHLIGHT ── */
  const sections   = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');

  const sectionObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navAnchors.forEach(a => a.classList.remove('active'));
        const a = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
        if (a) a.classList.add('active');
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(s => sectionObs.observe(s));


  /* ── 7. CURSOR SPARKLE (desktop only) ── */
  if (window.matchMedia('(hover: hover)').matches) {
    const sparkles = ['✦', '✧', '·', '⋆'];
    let sparkleTimeout;

    if (!document.getElementById('sparkleKf')) {
      const s = document.createElement('style');
      s.id = 'sparkleKf';
      s.textContent = `
        @keyframes sparkleOut {
          0%   { opacity: 0.9; transform: translate(-50%,-50%) scale(1); }
          100% { opacity: 0;   transform: translate(-50%,-130%) scale(0.2); }
        }`;
      document.head.appendChild(s);
    }

    document.addEventListener('mousemove', e => {
      if (sparkleTimeout) return;
      sparkleTimeout = setTimeout(() => { sparkleTimeout = null; }, 80);
      const sp = document.createElement('div');
      sp.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
      sp.style.cssText = `
        position:fixed;left:${e.clientX}px;top:${e.clientY}px;
        pointer-events:none;z-index:9999;
        font-size:${0.5 + Math.random() * 0.8}rem;
        color:var(--gold);opacity:0.9;
        transform:translate(-50%,-50%);
        animation:sparkleOut 0.7s forwards ease-out;`;
      document.body.appendChild(sp);
      setTimeout(() => sp.remove(), 700);
    });
  }


  /* ── 8. CONFETTI BURST on load ── */
  window.addEventListener('load', () => {
    if (!document.getElementById('confettiKf')) {
      const s = document.createElement('style');
      s.id = 'confettiKf';
      s.textContent = `
        @keyframes confettiBurst {
          0%   { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }`;
      document.head.appendChild(s);
    }
    const pieces = ['🌸','🎉','✨','🎊','💛','🌷','🥂','💕'];
    for (let i = 0; i < 30; i++) {
      setTimeout(() => {
        const p = document.createElement('div');
        p.textContent = pieces[Math.floor(Math.random() * pieces.length)];
        p.style.cssText = `
          position:fixed;left:${Math.random()*100}vw;top:-40px;
          z-index:9990;font-size:${1 + Math.random()*1.2}rem;
          pointer-events:none;
          animation:confettiBurst ${2+Math.random()*3}s ease-in forwards;`;
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 5000);
      }, i * 100);
    }
  });

})();