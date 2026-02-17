/**
 * BizBrain OS Landing Page - Scripts
 * Minimal JS: theme toggle, smooth scroll, copy, animations, mobile menu
 */

(function () {
  'use strict';

  // ---- DOM Elements ----
  const themeToggle = document.getElementById('theme-toggle');
  const copyBtn = document.getElementById('copy-btn');
  const installCommand = document.getElementById('install-command');
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const navLinks = document.getElementById('nav-links');
  const nav = document.getElementById('nav');

  // ---- Theme Toggle ----
  function getPreferredTheme() {
    const stored = localStorage.getItem('bizbrain-theme');
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('bizbrain-theme', theme);
  }

  // Initialize theme
  setTheme(getPreferredTheme());

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      const current = document.documentElement.getAttribute('data-theme');
      setTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  // ---- Copy to Clipboard ----
  if (copyBtn && installCommand) {
    copyBtn.addEventListener('click', function () {
      const text = installCommand.textContent.trim();
      navigator.clipboard.writeText(text).then(function () {
        copyBtn.classList.add('copied');
        setTimeout(function () {
          copyBtn.classList.remove('copied');
        }, 2000);
      }).catch(function () {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
          document.execCommand('copy');
          copyBtn.classList.add('copied');
          setTimeout(function () {
            copyBtn.classList.remove('copied');
          }, 2000);
        } catch (e) {
          // silently fail
        }
        document.body.removeChild(textarea);
      });
    });
  }

  // ---- Mobile Menu ----
  if (mobileMenuToggle && navLinks) {
    mobileMenuToggle.addEventListener('click', function () {
      mobileMenuToggle.classList.toggle('active');
      navLinks.classList.toggle('open');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    // Close mobile menu when clicking a link
    var links = navLinks.querySelectorAll('.nav-link');
    links.forEach(function (link) {
      link.addEventListener('click', function () {
        mobileMenuToggle.classList.remove('active');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ---- Smooth Scroll for Anchor Links ----
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;

      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var offset = nav ? nav.offsetHeight : 64;
        var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  // ---- Scroll-based Fade-in Animations ----
  function handleScrollAnimations() {
    var elements = document.querySelectorAll('.animate-in');
    var windowHeight = window.innerHeight;

    elements.forEach(function (el) {
      var rect = el.getBoundingClientRect();
      var threshold = windowHeight * 0.88;

      if (rect.top < threshold) {
        el.classList.add('visible');
      }
    });
  }

  // Run on load and scroll
  handleScrollAnimations();
  var scrollTimeout;
  window.addEventListener('scroll', function () {
    if (scrollTimeout) return;
    scrollTimeout = requestAnimationFrame(function () {
      handleScrollAnimations();
      scrollTimeout = null;
    });
  }, { passive: true });

  // ---- Nav background on scroll ----
  function handleNavScroll() {
    if (!nav) return;
    if (window.scrollY > 20) {
      nav.style.borderBottomColor = 'var(--border)';
    } else {
      nav.style.borderBottomColor = 'var(--nav-border)';
    }
  }

  handleNavScroll();
  window.addEventListener('scroll', handleNavScroll, { passive: true });

  // ---- Animated Counters ----
  function animateCounters() {
    var stats = document.querySelectorAll('.stat-value');
    stats.forEach(function (stat) {
      if (stat.dataset.animated) return;
      var rect = stat.getBoundingClientRect();
      if (rect.top > window.innerHeight * 0.95) return;

      var text = stat.textContent.trim();
      var match = text.match(/^(\d+)([+%]?)$/);
      if (!match) return;

      stat.dataset.animated = 'true';
      var target = parseInt(match[1]);
      var suffix = match[2] || '';
      var duration = 1800;
      var start = performance.now();

      function update(now) {
        var elapsed = now - start;
        var progress = Math.min(elapsed / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        stat.textContent = Math.round(target * eased) + suffix;
        if (progress < 1) requestAnimationFrame(update);
      }

      stat.textContent = '0' + suffix;
      requestAnimationFrame(update);
    });
  }

  animateCounters();
  window.addEventListener('scroll', function () {
    requestAnimationFrame(animateCounters);
  }, { passive: true });

  // ---- Mouse Parallax on Hero Glow ----
  var heroGlow = document.querySelector('.hero-glow');
  if (heroGlow) {
    var parallaxFrame;
    document.addEventListener('mousemove', function (e) {
      if (parallaxFrame) return;
      parallaxFrame = requestAnimationFrame(function () {
        var x = (e.clientX / window.innerWidth - 0.5) * 40;
        var y = (e.clientY / window.innerHeight - 0.5) * 30;
        heroGlow.style.transform = 'translateX(calc(-50% + ' + x + 'px)) translateY(' + y + 'px)';
        parallaxFrame = null;
      });
    });
  }

  // ---- Tilt Effect on Feature Cards ----
  var featureCards = document.querySelectorAll('.feature-card');
  featureCards.forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - 0.5;
      var y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = 'translateY(-4px) perspective(800px) rotateX(' + (-y * 4) + 'deg) rotateY(' + (x * 4) + 'deg)';
    });
    card.addEventListener('mouseleave', function () {
      card.style.transform = '';
    });
  });

})();
