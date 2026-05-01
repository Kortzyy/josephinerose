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
    el.style.animationDelay = (Math.random() * 5) + 's';
    el.style.opacity = (0.3 + Math.random() * 0.4).toString();
    petalContainer.appendChild(el);
    setTimeout(() => el.remove(), (dur + 5) * 1000);
  }

  // spawn initial petals
  for (let i = 0; i < 18; i++) {
    setTimeout(spawnPetal, i * 400);
  }
  // keep spawning continuously
  setInterval(spawnPetal, 1800);


  /* ── 2. NAV SCROLL EFFECT ── */
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });


  /* ── 3. HAMBURGER MENU ── */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.querySelector('.nav-links');

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  // close on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });


  /* ── 4. SCROLL REVEAL ── */
  const revealEls = document.querySelectorAll(
    '.home-text, .home-headline-wrap, .about-grid, ' +
    '.fact-card, .about-quote, .gallery-item, ' +
    '.msg-card, .section-tag, .section-title'
  );

  revealEls.forEach((el, i) => {
    el.classList.add('reveal');
    if (i % 3 === 1) el.classList.add('reveal-delay-1');
    if (i % 3 === 2) el.classList.add('reveal-delay-2');
  });

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealEls.forEach(el => revealObserver.observe(el));


  /* ── 5. GALLERY LIGHTBOX ── */
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox     = document.getElementById('lightbox');
  const lbImg        = document.getElementById('lbImg');
  const lbClose      = document.getElementById('lbClose');
  const lbPrev       = document.getElementById('lbPrev');
  const lbNext       = document.getElementById('lbNext');

  let currentIndex = 0;

  // build array of image sources
  const images = Array.from(galleryItems).map(item => ({
    src: item.querySelector('img').src,
    alt: item.querySelector('img').alt,
  }));

  function openLightbox(index) {
    currentIndex = index;
    lbImg.src = images[index].src;
    lbImg.alt = images[index].alt;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    lbImg.src = '';
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % images.length;
    lbImg.src = images[currentIndex].src;
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    lbImg.src = images[currentIndex].src;
  }

  galleryItems.forEach((item, i) => {
    item.addEventListener('click', () => openLightbox(i));
  });

  lbClose.addEventListener('click', closeLightbox);
  lbNext.addEventListener('click', showNext);
  lbPrev.addEventListener('click', showPrev);

  // close on backdrop click
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowRight')  showNext();
    if (e.key === 'ArrowLeft')   showPrev();
  });


  /* ── 6. ACTIVE NAV LINK HIGHLIGHT ── */
  const sections   = document.querySelectorAll('section[id], footer');
  const navAnchors = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navAnchors.forEach(a => a.style.color = '');
          const id = entry.target.id;
          const active = document.querySelector(`.nav-links a[href="#${id}"]`);
          if (active) active.style.color = 'var(--gold)';
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach(s => sectionObserver.observe(s));


  /* ── 7. SMOOTH SPARKLE ON CURSOR (Desktop only) ── */
  if (window.matchMedia('(hover: hover)').matches) {
    const sparkles = ['✦', '✧', '·', '⋆'];
    let sparkleTimeout;

    document.addEventListener('mousemove', (e) => {
      if (sparkleTimeout) return;
      sparkleTimeout = setTimeout(() => { sparkleTimeout = null; }, 80);

      const sp = document.createElement('div');
      sp.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
      sp.style.cssText = `
        position: fixed;
        left: ${e.clientX}px;
        top: ${e.clientY}px;
        pointer-events: none;
        z-index: 9999;
        font-size: ${0.5 + Math.random() * 0.8}rem;
        color: var(--gold);
        opacity: 0.9;
        transform: translate(-50%, -50%);
        animation: sparkleOut 0.7s forwards ease-out;
      `;
      document.body.appendChild(sp);
      setTimeout(() => sp.remove(), 700);
    });

    // inject sparkle keyframes if not already there
    if (!document.getElementById('sparkleKf')) {
      const style = document.createElement('style');
      style.id = 'sparkleKf';
      style.textContent = `
        @keyframes sparkleOut {
          0%   { opacity: 0.9; transform: translate(-50%, -50%) scale(1); }
          100% { opacity: 0; transform: translate(-50%, -120%) scale(0.3); }
        }
      `;
      document.head.appendChild(style);
    }
  }


  /* ── 8. YEAR CONFETTI BURST on load ── */
  window.addEventListener('load', () => {
    const confettiPieces = ['🌸', '🎉', '✨', '🎊', '💛', '🌷', '🥂', '💕'];
    for (let i = 0; i < 30; i++) {
      setTimeout(() => {
        const piece = document.createElement('div');
        piece.style.cssText = `
          position: fixed;
          left: ${Math.random() * 100}vw;
          top: -40px;
          z-index: 9990;
          font-size: ${1 + Math.random() * 1.2}rem;
          pointer-events: none;
          animation: confettiBurst ${2 + Math.random() * 3}s ease-in forwards;
        `;
        piece.textContent = confettiPieces[Math.floor(Math.random() * confettiPieces.length)];
        document.body.appendChild(piece);
        setTimeout(() => piece.remove(), 5000);
      }, i * 100);
    }

    if (!document.getElementById('confettiKf')) {
      const style = document.createElement('style');
      style.id = 'confettiKf';
      style.textContent = `
        @keyframes confettiBurst {
          0%   { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }
  });

})();