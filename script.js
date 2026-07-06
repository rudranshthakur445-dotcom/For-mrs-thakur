/* ============================================================
   FOR MRS. THAKUR ❤️ — script.js
   Pure Vanilla JavaScript — No frameworks, no dependencies
   ============================================================ */

'use strict';

/* ====================================================
   CONFIGURATION — Add your gallery image filenames here
   ==================================================== */
const GALLERY_IMAGES = [
  // Add filenames like: 'photo1.jpg', 'photo2.jpg', 'us1.png'
  // Example:
  // 'memories-1.jpg',
  // 'memories-2.jpg',
  // 'us-together.jpg',
];

// Optional captions matching the images above
const GALLERY_CAPTIONS = [
  // 'Our favourite evening',
  // 'That perfect day',
  // 'Us, always',
];

/* ====================================================
   PASSWORD SCREEN
   ==================================================== */
const CORRECT_PASSWORD = 'Mrs Thakur'; // Case-sensitive

function checkPassword() {
  const input = document.getElementById('pw-input');
  const error = document.getElementById('pw-error');
  const val   = input.value;

  if (val === CORRECT_PASSWORD) {
    // Success — play unlock animation then show loading
    input.classList.remove('shake');
    error.classList.remove('visible');
    document.getElementById('pw-btn').disabled = true;
    input.disabled = true;

    const card = document.querySelector('.pw-card');
    card.style.transition = 'transform 0.6s ease, opacity 0.6s ease';
    card.style.transform  = 'scale(1.05)';
    card.style.opacity    = '0';

    setTimeout(() => {
      document.getElementById('password-screen').classList.add('fade-out');
      setTimeout(() => {
        document.getElementById('password-screen').style.display = 'none';
        showLoadingScreen();
      }, 600);
    }, 600);

  } else {
    // Wrong password — shake
    input.classList.remove('shake');
    void input.offsetWidth; // reflow to restart animation
    input.classList.add('shake');
    error.classList.add('visible');
    setTimeout(() => input.classList.remove('shake'), 600);
    input.select();
  }
}

// Allow Enter key on password input
document.getElementById('pw-input').addEventListener('keydown', function(e) {
  if (e.key === 'Enter') checkPassword();
});

/* ====================================================
   PARTICLE GENERATOR (Password Screen)
   ==================================================== */
function generateParticles() {
  const container = document.getElementById('pw-particles');
  const count = 30;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.classList.add('pw-particle');
    p.style.left    = Math.random() * 100 + 'vw';
    p.style.setProperty('--dur',   (5 + Math.random() * 8)  + 's');
    p.style.setProperty('--delay', (Math.random() * 6)       + 's');
    p.style.width   = (2 + Math.random() * 4) + 'px';
    p.style.height  = p.style.width;
    if (Math.random() > 0.6) {
      p.textContent = '✦';
      p.style.width  = 'auto';
      p.style.height = 'auto';
      p.style.background = 'transparent';
      p.style.color  = Math.random() > 0.5 ? 'rgba(201,168,76,0.6)' : 'rgba(192,86,106,0.6)';
      p.style.fontSize = (8 + Math.random() * 10) + 'px';
    }
    container.appendChild(p);
  }
}

generateParticles();

/* ====================================================
   LOADING SCREEN
   ==================================================== */
const LOADING_QUOTES = [
  '"Every love story is beautiful, but ours is my favourite."',
  '"You are the finest, loveliest, tenderest, and most beautiful person I have ever known — and even that is an understatement."',
  '"In your arms is right where I want to be."',
  '"I love you to the moon and back, and then some."',
  '"You are my today and all of my tomorrows."',
  '"Wherever you are, it is my home."',
];

function showLoadingScreen() {
  const screen = document.getElementById('loading-screen');
  const bar    = document.getElementById('loading-bar');
  const pct    = document.getElementById('loading-pct');
  const quote  = document.getElementById('loading-quote');

  screen.classList.remove('hidden');

  let progress  = 0;
  let quoteIdx  = 0;

  // Rotate quotes
  const quoteInterval = setInterval(() => {
    quote.style.opacity = '0';
    setTimeout(() => {
      quoteIdx = (quoteIdx + 1) % LOADING_QUOTES.length;
      quote.textContent  = LOADING_QUOTES[quoteIdx];
      quote.style.opacity = '1';
    }, 500);
  }, 2200);

  // Animate progress
  const interval = setInterval(() => {
    progress += Math.random() * 3 + 1;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      clearInterval(quoteInterval);

      bar.style.width = '100%';
      pct.textContent = '100%';

      setTimeout(() => {
        screen.classList.add('fade-out');
        setTimeout(() => {
          screen.style.display = 'none';
          showMainSite();
        }, 700);
      }, 600);
    }

    bar.style.width  = progress + '%';
    pct.textContent  = Math.floor(progress) + '%';
  }, 60);
}

/* ====================================================
   MAIN SITE REVEAL
   ==================================================== */
function showMainSite() {
  const site = document.getElementById('main-site');
  site.classList.remove('hidden');
  site.classList.add('fade-in-anim');

  // Show music player
  setTimeout(() => {
    const player = document.getElementById('music-player');
    player.classList.add('visible');
    autoPlayMusic();
  }, 800);

  // Init all features
  initScrollAnimations();
  initGallery();
  initQuoteCarousel();
  initPetals();
  initMusicPlayer();
  initEnvelope();
}

/* ====================================================
   MUSIC PLAYER  (with localStorage playback memory)
   ==================================================== */
let isPlaying = false;
let isMuted   = false;
const audio   = document.getElementById('audio');
const LS_TIME = 'mrs-thakur-music-time';
const LS_VOL  = 'mrs-thakur-music-vol';

function initMusicPlayer() {
  const slider = document.getElementById('volume-slider');
  const player = document.getElementById('music-player');

  // Restore saved volume
  const savedVol = parseFloat(localStorage.getItem(LS_VOL) || '0.7');
  audio.volume   = savedVol;
  slider.value   = savedVol;
  updateMuteIcon();

  // Volume slider
  slider.addEventListener('input', () => {
    audio.volume = parseFloat(slider.value);
    isMuted = false;
    audio.muted = false;
    localStorage.setItem(LS_VOL, slider.value);
    updateMuteIcon();
  });

  // Progress bar — click to seek
  document.getElementById('music-progress-bar').addEventListener('click', function(e) {
    const rect  = this.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    if (audio.duration) {
      audio.currentTime = ratio * audio.duration;
      saveTime();
    }
  });

  // Restore saved position once metadata loads
  audio.addEventListener('loadedmetadata', () => {
    document.getElementById('music-total').textContent = formatTime(audio.duration);
    const savedTime = parseFloat(localStorage.getItem(LS_TIME) || '0');
    if (savedTime > 0 && savedTime < audio.duration - 2) {
      audio.currentTime = savedTime;
    }
  });

  // Time update — save every 5 s
  let saveCounter = 0;
  audio.addEventListener('timeupdate', () => {
    updateProgress();
    if (++saveCounter % 5 === 0) saveTime();
  });

  // Save on pause
  audio.addEventListener('pause', () => {
    setPlayIcon(false);
    player.classList.remove('playing');
    saveTime();
  });

  audio.addEventListener('play', () => {
    setPlayIcon(true);
    player.classList.add('playing');
  });

  // Loop
  audio.addEventListener('ended', () => {
    audio.currentTime = 0;
    audio.play();
  });
}

function saveTime() {
  localStorage.setItem(LS_TIME, audio.currentTime.toFixed(2));
}

function autoPlayMusic() {
  const player = document.getElementById('music-player');
  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise.then(() => {
      isPlaying = true;
      setPlayIcon(true);
      player.classList.add('playing');
    }).catch(() => {
      // Autoplay blocked by browser — player shows paused state
      isPlaying = false;
      setPlayIcon(false);
      player.classList.remove('playing');
    });
  }
}

function togglePlay() {
  if (isPlaying) {
    audio.pause();
    isPlaying = false;
  } else {
    audio.play();
    isPlaying = true;
  }
  setPlayIcon(isPlaying);
}

function setPlayIcon(playing) {
  const icon  = document.getElementById('play-icon');
  const vinyl = document.getElementById('music-vinyl-icon');
  icon.className = playing ? 'fas fa-pause' : 'fas fa-play';
  vinyl.classList.toggle('spinning', playing);
  vinyl.classList.toggle('paused',  !playing);
}

function toggleMute() {
  isMuted     = !isMuted;
  audio.muted = isMuted;
  updateMuteIcon();
}

function updateMuteIcon() {
  const icon = document.getElementById('mute-icon');
  const vol  = audio.volume;
  if (isMuted || vol === 0)   icon.className = 'fas fa-volume-mute';
  else if (vol < 0.5)         icon.className = 'fas fa-volume-down';
  else                        icon.className = 'fas fa-volume-up';
}

function updateProgress() {
  if (!audio.duration) return;
  const pct = (audio.currentTime / audio.duration) * 100;
  document.getElementById('music-progress-fill').style.width = pct + '%';
  document.getElementById('music-current').textContent = formatTime(audio.currentTime);
}

function formatTime(secs) {
  if (isNaN(secs) || !isFinite(secs)) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

/* ====================================================
   LOVE LETTER — ENVELOPE & TYPEWRITER
   ==================================================== */
const LETTER_LINES = [
  { text: 'Dear Mrs. Thakur ❤️,',       style: 'greeting', pauseAfter: 520 },
  { text: '',                             style: 'blank',   pauseAfter: 280 },
  { text: 'If I had one more life,',      style: 'body',    pauseAfter: 80  },
  { text: 'I would still react to your story just to fall in love with you again.', style: 'body', pauseAfter: 420 },
  { text: '',                             style: 'blank',   pauseAfter: 260 },
  { text: 'Thank you for every smile.',   style: 'body',    pauseAfter: 80  },
  { text: 'Every late-night call.',       style: 'body',    pauseAfter: 80  },
  { text: 'Every memory.',               style: 'body',    pauseAfter: 80  },
  { text: 'Every fight.',                style: 'body',    pauseAfter: 80  },
  { text: 'Every patch-up.',             style: 'body',    pauseAfter: 80  },
  { text: 'Every hug.',                  style: 'body',    pauseAfter: 440 },
  { text: '',                             style: 'blank',   pauseAfter: 260 },
  { text: 'You are not just my love...',  style: 'body',    pauseAfter: 80  },
  { text: 'You are my peace,',           style: 'body',    pauseAfter: 80  },
  { text: 'my comfort,',                 style: 'body',    pauseAfter: 80  },
  { text: 'my safest place,',            style: 'body',    pauseAfter: 80  },
  { text: 'and my forever.',             style: 'body',    pauseAfter: 440 },
  { text: '',                             style: 'blank',   pauseAfter: 260 },
  { text: 'No matter what happens,',     style: 'body',    pauseAfter: 80  },
  { text: 'I will always choose you.',   style: 'body',    pauseAfter: 520 },
  { text: '',                             style: 'blank',   pauseAfter: 260 },
  { text: 'I Love You Forever ❤️',       style: 'closing', pauseAfter: 300 },
  { text: '',                             style: 'blank',   pauseAfter: 200 },
  { text: '— Rudransh',                  style: 'sign',    pauseAfter: 0   },
];

let letterOpen       = false;
let typewriterTimer  = null;
let petalInterval    = null;

function initEnvelope() {
  // Close on backdrop click
  document.getElementById('letter-modal').addEventListener('click', function(e) {
    if (e.target === this || e.target.classList.contains('letter-modal-bg')) {
      closeLetter();
    }
  });
  // Keyboard close
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && letterOpen) closeLetter();
  });
}

function openLetter() {
  if (letterOpen) return;
  letterOpen = true;

  const env   = document.getElementById('envelope');
  const modal = document.getElementById('letter-modal');
  const typed = document.getElementById('letter-typed');
  const cursor= document.getElementById('letter-cursor');

  // 1. Open flap + raise paper peek
  env.classList.add('opening', 'open');

  // 2. After flap lifts, show modal
  setTimeout(() => {
    typed.textContent = '';
    cursor.classList.remove('done');
    modal.classList.add('open');
    spawnModalPetals();

    // 3. Start typewriter after paper slides in
    setTimeout(() => startTypewriter(typed, cursor), 600);
  }, 750);
}

function closeLetter() {
  if (!letterOpen) return;
  letterOpen = false;

  const env   = document.getElementById('envelope');
  const modal = document.getElementById('letter-modal');

  // Stop typewriter
  clearTimeout(typewriterTimer);
  clearInterval(petalInterval);

  // Fade modal out
  modal.classList.remove('open');

  // Reset envelope after modal fades
  setTimeout(() => {
    env.classList.remove('open', 'opening');
    // Clear petals
    document.getElementById('letter-petals-layer').innerHTML = '';
  }, 650);
}

function startTypewriter(container, cursor) {
  let lineIdx = 0;
  let charIdx = 0;

  // Auto-scroll the paper as text grows
  const paper = document.querySelector('.letter-paper');

  function typeNext() {
    if (lineIdx >= LETTER_LINES.length) {
      // Finished — leave cursor blinking
      cursor.classList.add('done');
      return;
    }

    const line = LETTER_LINES[lineIdx];

    // Blank lines: just insert a newline and move on
    if (line.style === 'blank') {
      container.textContent += '\n';
      lineIdx++;
      charIdx = 0;
      typewriterTimer = setTimeout(typeNext, line.pauseAfter);
      return;
    }

    if (charIdx < line.text.length) {
      // Type one character
      if (charIdx === 0) {
        // First char of a new line: prepend newline (except very first line)
        if (container.textContent.length > 0) {
          container.textContent += '\n';
        }
        // Apply line style by wrapping in a span
        // Actually, simpler: just append text — styling applied globally via CSS
      }
      container.textContent += line.text[charIdx];
      charIdx++;

      // Scroll to bottom
      paper.scrollTop = paper.scrollHeight;

      // Speed: greeting/closing a bit slower, body text fast
      const speed = line.style === 'greeting' ? 55
                  : line.style === 'closing'  ? 65
                  : line.style === 'sign'     ? 80
                  : 32;

      typewriterTimer = setTimeout(typeNext, speed);
    } else {
      // Line done — pause before next
      lineIdx++;
      charIdx = 0;
      typewriterTimer = setTimeout(typeNext, line.pauseAfter);
    }
  }

  typeNext();
}

function spawnModalPetals() {
  const layer   = document.getElementById('letter-petals-layer');
  layer.innerHTML = '';
  const symbols = ['🌹', '🌸', '✿', '❀', '❤', '♡', '✦'];
  const colors  = [
    'rgba(192,86,106,0.55)', 'rgba(220,120,140,0.5)',
    'rgba(201,168,76,0.45)', 'rgba(240,180,190,0.5)',
    'rgba(192,86,106,0.4)',
  ];

  for (let i = 0; i < 22; i++) {
    const p = document.createElement('div');
    p.classList.add('modal-petal');
    p.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    p.style.setProperty('--pl',     (Math.random() * 100) + '%');
    p.style.setProperty('--pd',     (6 + Math.random() * 9) + 's');
    p.style.setProperty('--pdelay', (Math.random() * 8)     + 's');
    p.style.setProperty('--ps',     (11 + Math.random() * 14) + 'px');
    p.style.setProperty('--pc',     colors[Math.floor(Math.random() * colors.length)]);
    layer.appendChild(p);
  }
}

/* ====================================================
   HERO PETALS
   ==================================================== */
function initPetals() {
  const container = document.getElementById('hero-petals');
  const symbols   = ['❤', '✿', '❀', '✦', '♡'];

  for (let i = 0; i < 18; i++) {
    const petal = document.createElement('div');
    petal.classList.add('petal');
    petal.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    petal.style.setProperty('--left',  (Math.random() * 100) + '%');
    petal.style.setProperty('--dur',   (6 + Math.random() * 10) + 's');
    petal.style.setProperty('--delay', (Math.random() * 10)     + 's');
    petal.style.setProperty('--size',  (10 + Math.random() * 16) + 'px');
    petal.style.color  = Math.random() > 0.4 ? 'rgba(192,86,106,0.6)' : 'rgba(201,168,76,0.5)';
    container.appendChild(petal);
  }
}

/* ====================================================
   SCROLL ANIMATIONS — Intersection Observer
   ==================================================== */
function initScrollAnimations() {
  const targets = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .promise-item');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el    = entry.target;
        const delay = el.dataset.delay ? parseInt(el.dataset.delay) : 0;
        setTimeout(() => el.classList.add('visible'), delay);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

  targets.forEach(el => observer.observe(el));
}

/* ====================================================
   GALLERY  (manifest.json auto-load + masonry + swipe)
   ==================================================== */
let lightboxImages = [];
let currentLbIndex = 0;

/* --------------------------------------------------
   initGallery — tries manifest.json first,
   falls back to the GALLERY_IMAGES array above
   -------------------------------------------------- */
async function initGallery() {
  const grid  = document.getElementById('gallery-grid');
  const empty = document.getElementById('gallery-empty');

  let images = []; // [{src, caption}]

  // 1 — Try to load assets/gallery/manifest.json
  try {
    const res = await fetch('assets/gallery/manifest.json');
    if (res.ok) {
      const data = await res.json();
      // Accepts: ["file.jpg", ...] or [{src, caption}, ...]
      const raw = Array.isArray(data) ? data : (data.images || []);
      images = raw.map((entry, i) =>
        typeof entry === 'string'
          ? { src: 'assets/gallery/' + entry, caption: data.captions?.[i] || '' }
          : { src: 'assets/gallery/' + (entry.src || entry.file || entry), caption: entry.caption || '' }
      );
    }
  } catch (_) { /* no manifest — fall through */ }

  // 2 — Fall back to in-script GALLERY_IMAGES array
  if (images.length === 0 && GALLERY_IMAGES.length > 0) {
    images = GALLERY_IMAGES.map((src, i) => ({
      src: 'assets/gallery/' + src,
      caption: GALLERY_CAPTIONS[i] || ''
    }));
  }

  if (images.length === 0) {
    showGalleryPlaceholders(grid);
    return;
  }

  empty.style.display = 'none';
  buildGallery(grid, images);
}

function buildGallery(grid, images) {
  lightboxImages = [];

  images.forEach((img, index) => {
    // Card
    const item = document.createElement('div');
    item.classList.add('gallery-item');
    item.style.animationDelay = Math.min(index * 70, 600) + 'ms';

    // Image with lazy loading
    const el = document.createElement('img');
    el.loading = 'lazy';
    el.alt     = img.caption || `Memory ${index + 1}`;
    el.src     = img.src;
    el.onerror = () => {
      item.remove();
      lightboxImages[index] = null;
    };

    // Hover overlay
    const overlay = document.createElement('div');
    overlay.classList.add('gallery-overlay');
    overlay.innerHTML = `<div class="gallery-overlay-icon"><i class="fas fa-expand-alt"></i></div>`;

    item.appendChild(el);
    item.appendChild(overlay);

    const captionIdx = lightboxImages.length;
    item.addEventListener('click', () => openLightbox(captionIdx));
    grid.appendChild(item);

    lightboxImages.push({ src: img.src, caption: img.caption || el.alt });
  });
}

function showGalleryPlaceholders(grid) {
  const placeholders = [
    { icon: 'fa-camera-retro', label: 'Your Photo Here'    },
    { icon: 'fa-heart',        label: 'A Memory Together'  },
    { icon: 'fa-image',        label: 'A Special Moment'   },
    { icon: 'fa-star',         label: 'A Beautiful Day'    },
    { icon: 'fa-sun',          label: 'Our Adventure'      },
    { icon: 'fa-moon',         label: 'A Quiet Evening'    },
  ];

  placeholders.forEach((ph, i) => {
    const item = document.createElement('div');
    item.classList.add('gallery-item');
    item.style.animationDelay = (i * 80) + 'ms';
    item.style.cursor = 'default';
    item.style.minHeight = '160px';
    item.innerHTML = `
      <div style="width:100%;height:160px;display:flex;flex-direction:column;
        align-items:center;justify-content:center;gap:12px;">
        <i class="fas ${ph.icon}" style="font-size:32px;color:rgba(201,168,76,0.2)"></i>
        <span style="font-family:'Lato',sans-serif;font-size:0.68rem;letter-spacing:0.12em;
          text-transform:uppercase;color:rgba(253,246,236,0.12);">${ph.label}</span>
      </div>`;
    grid.appendChild(item);
  });

  document.getElementById('gallery-empty').style.display = 'none';
}

/* ---------- LIGHTBOX ---------- */
function openLightbox(index) {
  const validImages = lightboxImages.filter(Boolean);
  if (validImages.length === 0) return;
  // Find the actual index in the filtered array
  const real = lightboxImages.slice(0, index + 1).filter(Boolean).length - 1;
  currentLbIndex = Math.max(0, real);
  updateLightbox(false);
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}

function lightboxNext() {
  const valid = lightboxImages.filter(Boolean);
  currentLbIndex = (currentLbIndex + 1) % valid.length;
  updateLightbox(true);
}

function lightboxPrev() {
  const valid = lightboxImages.filter(Boolean);
  currentLbIndex = (currentLbIndex - 1 + valid.length) % valid.length;
  updateLightbox(true);
}

function updateLightbox(animate) {
  const img     = document.getElementById('lb-img');
  const caption = document.getElementById('lb-caption');
  const counter = document.getElementById('lb-counter');
  const valid   = lightboxImages.filter(Boolean);
  const current = valid[currentLbIndex];
  if (!current) return;

  const swap = () => {
    img.src = current.src;
    img.alt = current.caption;
    caption.textContent = current.caption;
    counter.textContent = `${currentLbIndex + 1} of ${valid.length}`;
    img.classList.remove('fading');
  };

  if (animate) {
    img.classList.add('fading');
    setTimeout(swap, 220);
  } else {
    swap();
  }
}

/* --- Lightbox event listeners --- */
document.getElementById('lb-close').addEventListener('click', closeLightbox);
document.getElementById('lb-next').addEventListener('click', lightboxNext);
document.getElementById('lb-prev').addEventListener('click', lightboxPrev);

document.getElementById('lightbox').addEventListener('click', function(e) {
  if (e.target === this || e.target.classList.contains('lb-backdrop')) closeLightbox();
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (!document.getElementById('lightbox').classList.contains('open')) return;
  if (e.key === 'Escape')     closeLightbox();
  if (e.key === 'ArrowRight') lightboxNext();
  if (e.key === 'ArrowLeft')  lightboxPrev();
});

// Touch / swipe support
(function attachSwipe() {
  const lb = document.getElementById('lightbox');
  let touchStartX = 0;
  let touchStartY = 0;

  lb.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  lb.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 48) {
      dx < 0 ? lightboxNext() : lightboxPrev();
    }
  }, { passive: true });
})();

/* ====================================================
   QUOTE CAROUSEL
   ==================================================== */
function initQuoteCarousel() {
  const slides = document.querySelectorAll('.quote-slide');
  const dotsContainer = document.getElementById('quote-dots');
  let current = 0;
  let autoTimer;

  // Create dots
  slides.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.classList.add('qdot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToQuote(i));
    dotsContainer.appendChild(dot);
  });

  function goToQuote(index) {
    slides[current].classList.remove('active');
    dotsContainer.querySelectorAll('.qdot')[current].classList.remove('active');
    current = index;
    slides[current].classList.add('active');
    dotsContainer.querySelectorAll('.qdot')[current].classList.add('active');
    resetTimer();
  }

  function nextQuote() {
    goToQuote((current + 1) % slides.length);
  }

  function resetTimer() {
    clearInterval(autoTimer);
    autoTimer = setInterval(nextQuote, 4500);
  }

  resetTimer();
}

/* ====================================================
   SMOOTH SCROLL for anchor links
   ==================================================== */
document.querySelectorAll('.scroll-link').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ====================================================
   PARALLAX — subtle hero parallax on scroll
   ==================================================== */
window.addEventListener('scroll', () => {
  const hero  = document.querySelector('.hero-bg');
  const scrollY = window.scrollY;
  if (hero && scrollY < window.innerHeight) {
    hero.style.transform = `translateY(${scrollY * 0.3}px)`;
  }
}, { passive: true });

/* ====================================================
   CURSOR TRAIL (desktop only)
   ==================================================== */
if (window.matchMedia('(pointer: fine)').matches) {
  const trail = [];
  const MAX   = 8;
  const SYMBOLS = ['❤', '✦', '✿'];

  for (let i = 0; i < MAX; i++) {
    const el = document.createElement('div');
    el.style.cssText = `
      position:fixed;pointer-events:none;z-index:9000;
      font-size:10px;opacity:0;transition:opacity 0.5s;
      color:rgba(201,168,76,0.5);
    `;
    el.textContent = SYMBOLS[i % SYMBOLS.length];
    document.body.appendChild(el);
    trail.push({ el, x: 0, y: 0 });
  }

  let mouseX = -200, mouseY = -200;
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX; mouseY = e.clientY;
  }, { passive: true });

  let trailTick = 0;
  setInterval(() => {
    const t   = trail[trailTick % MAX];
    t.x = mouseX; t.y = mouseY;
    t.el.style.left    = (t.x - 6) + 'px';
    t.el.style.top     = (t.y - 6) + 'px';
    t.el.style.opacity = '0.6';
    t.el.style.fontSize = (8 + Math.random() * 6) + 'px';
    setTimeout(() => { t.el.style.opacity = '0'; }, 400);
    trailTick++;
  }, 80);
}

/* ====================================================
   FLOATING HEARTS on click (desktop)
   ==================================================== */
document.addEventListener('click', (e) => {
  if (e.target.closest('#password-screen') || e.target.closest('#loading-screen')) return;
  const heart  = document.createElement('div');
  const symbols = ['❤', '♡', '✦'];
  heart.textContent = symbols[Math.floor(Math.random() * symbols.length)];
  heart.style.cssText = `
    position:fixed;
    left:${e.clientX}px;
    top:${e.clientY}px;
    pointer-events:none;
    z-index:9999;
    font-size:${14 + Math.random() * 10}px;
    color:${Math.random() > 0.5 ? 'rgba(201,168,76,0.7)' : 'rgba(192,86,106,0.7)'};
    animation: clickHeartRise 1s ease forwards;
  `;
  document.body.appendChild(heart);
  setTimeout(() => heart.remove(), 1000);
});

// Inject keyframe for click hearts
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes clickHeartRise {
    0%   { transform: translate(-50%,-50%) scale(0) rotate(0deg); opacity: 1; }
    60%  { opacity: 1; }
    100% { transform: translate(${(Math.random()-0.5)*60}px, -80px) scale(1.5) rotate(${(Math.random()-0.5)*40}deg); opacity: 0; }
  }
`;
document.head.appendChild(styleSheet);
