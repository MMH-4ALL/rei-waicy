/* ============================================================
   REI WAICY 2026 — Shared JavaScript
   ============================================================ */

// ---- Theme Management ----
function initTheme() {
  const stored = localStorage.getItem('rei-theme');
  if (stored) {
    document.documentElement.setAttribute('data-theme', stored);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    document.documentElement.setAttribute('data-theme', 'light');
  }
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('rei-theme', next);
}

// ---- Particles System ----
class Particle {
  constructor(canvas) {
    this.canvas = canvas;
    this.reset();
  }
  reset() {
    this.x = Math.random() * this.canvas.width;
    this.y = Math.random() * this.canvas.height;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = (Math.random() - 0.5) * 0.4;
    this.opacity = Math.random() * 0.5 + 0.2;
    this.color = ['0, 212, 255', '155, 93, 229', '255, 107, 157', '255, 154, 92'][Math.floor(Math.random() * 4)];
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > this.canvas.width || this.y < 0 || this.y > this.canvas.height) {
      this.reset();
    }
  }
  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
    ctx.fill();
  }
}

function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animId;
  let particles = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particles = Array.from({ length: 80 }, () => new Particle(canvas));
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(ctx); });
    // Draw connections
    particles.forEach((a, i) => {
      particles.slice(i + 1).forEach(b => {
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(0, 212, 255, ${0.08 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });
    });
    animId = requestAnimationFrame(animate);
  }

  resize();
  window.addEventListener('resize', resize);
  animate();

  // Expose for cleanup if needed
  window._particleCanvas = canvas;
  window._particleAnimId = animId;
}

// ---- Scroll Reveal ----
function initScrollReveal() {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
    observer.observe(el);
  });
}

// ---- Parallax ----
function initParallax() {
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    document.querySelectorAll('.parallax-bg').forEach(el => {
      const speed = parseFloat(el.dataset.speed || '0.3');
      el.style.transform = `translateY(${scrolled * speed}px)`;
    });
  });
}

// ---- Ripple Button Effect ----
document.addEventListener('click', e => {
  const btn = e.target.closest('.btn');
  if (!btn) return;

  const rect = btn.getBoundingClientRect();
  const ripple = document.createElement('span');
  ripple.className = 'ripple';
  const size = Math.max(rect.width, rect.height);
  ripple.style.width = ripple.style.height = size + 'px';
  ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
  ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
  btn.appendChild(ripple);
  setTimeout(() => ripple.remove(), 700);
});

// ---- Navbar Scroll Effect ----
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });
}

// ---- Mobile Nav Toggle ----
function initMobileNav() {
  const toggle = document.querySelector('.nav-mobile-toggle');
  const links = document.querySelector('.nav-links');
  if (!toggle || !links) return;
  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
    const spans = toggle.querySelectorAll('span');
    if (links.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  });
}

// ---- Expandable Sections ----
function initExpandables() {
  document.querySelectorAll('.expandable-header').forEach(header => {
    header.addEventListener('click', () => {
      const expandable = header.closest('.expandable');
      expandable.classList.toggle('open');
    });
  });
}

// ---- Tabs ----
function initTabs() {
  document.querySelectorAll('.tabs-container').forEach(container => {
    const btns = container.querySelectorAll('.tab-btn');
    const contents = container.querySelectorAll('.tab-content');

    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.tab;
        btns.forEach(b => b.classList.remove('active'));
        contents.forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        container.querySelector(`[data-tab-content="${target}"]`)?.classList.add('active');
      });
    });
  });
}

// ---- Page Transitions ----
function initPageTransition() {
  document.querySelectorAll('a[href$=".html"]').forEach(link => {
    link.addEventListener('click', e => {
      // Skip external links or anchors
      if (link.target === '_blank' || link.href.startsWith('http')) return;

      const transition = document.querySelector('.page-transition');
      if (!transition) return;

      e.preventDefault();
      transition.classList.add('active');

      setTimeout(() => {
        window.location.href = link.href;
      }, 500);
    });
  });
}

// ---- Static Stats (no animation) ----
// Stat values are set directly in HTML. No JS needed.

// ---- Easter Egg: Console Message ----
function initEasterEgg() {
  const origLog = console.log;
  let lastInput = '';

  document.addEventListener('keydown', e => {
    if (e.key.length === 1) lastInput += e.key.toLowerCase();
    else if (e.key === 'Backspace') lastInput = lastInput.slice(0, -1);
    if (lastInput.length > 20) lastInput = lastInput.slice(-20);

    if (lastInput.includes('rei')) {
      console.log('%c✨ Hey there! You found me. — Rei 💙', 'color: #00d4ff; font-size: 16px; font-weight: bold;');
      lastInput = '';
    }
  });

  console.log('%c✨ Rei — A Safe Personal AI Companion for Teens', 'color: #00d4ff; font-size: 18px; font-weight: bold;');
  console.log('%cType "rei" anywhere to say hello! 💙', 'color: #ff9a5c; font-size: 12px;');
}

// ---- Before/After Slider ----
function initBASlider(sliderEl) {
  const beforeWrap = sliderEl.querySelector('.ba-before-wrapper');
  const handle = sliderEl.querySelector('.ba-handle');
  if (!beforeWrap || !handle) return;

  let isDragging = false;

  function move(clientX) {
    const rect = sliderEl.getBoundingClientRect();
    let x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const pct = (x / rect.width) * 100;
    beforeWrap.style.width = pct + '%';
    handle.style.left = pct + '%';
  }

  handle.addEventListener('mousedown', e => { isDragging = true; e.preventDefault(); });
  document.addEventListener('mousemove', e => { if (isDragging) move(e.clientX); });
  document.addEventListener('mouseup', () => isDragging = false);

  handle.addEventListener('touchstart', e => { isDragging = true; });
  document.addEventListener('touchmove', e => { if (isDragging) move(e.touches[0].clientX); });
  document.addEventListener('touchend', () => isDragging = false);
}

// ---- Interactive Diagram Highlight ----
function initDiagramHighlight() {
  document.querySelectorAll('.diagram-box').forEach(box => {
    box.addEventListener('mouseenter', () => box.classList.add('highlighted'));
    box.addEventListener('mouseleave', () => box.classList.remove('highlighted'));
  });
}

// ---- Init All ----
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initParticles();
  initScrollReveal();
  initParallax();
  initNavbarScroll();
  initMobileNav();
  initExpandables();
  initTabs();
  initPageTransition();

  initEasterEgg();
  initDiagramHighlight();

  // Before/after sliders
  document.querySelectorAll('.ba-slider').forEach(initBASlider);

  // Active nav link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });

  // Close mobile nav on link click
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      document.querySelector('.nav-links')?.classList.remove('open');
    });
  });
});
