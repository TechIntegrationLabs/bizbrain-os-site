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

})();
