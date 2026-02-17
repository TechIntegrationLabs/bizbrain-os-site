/**
 * BizBrain OS Landing Page - Enhanced Scripts
 * Theme, scroll progress, active nav, rotating text,
 * FAQ accordion, back-to-top, floating CTA, counters,
 * parallax, tilt effects, marquee duplication
 */

(function () {
  'use strict';

  // ---- DOM Elements ----
  var themeToggle = document.getElementById('theme-toggle');
  var copyBtn = document.getElementById('copy-btn');
  var installCommand = document.getElementById('install-command');
  var mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  var navLinks = document.getElementById('nav-links');
  var nav = document.getElementById('nav');
  var scrollProgress = document.getElementById('scroll-progress');
  var backToTop = document.getElementById('back-to-top');
  var floatingCTA = document.getElementById('floating-cta');
  var scrollIndicator = document.getElementById('scroll-indicator');
  var rotatingText = document.getElementById('rotating-text');

  // ---- Theme Toggle ----
  function getPreferredTheme() {
    var stored = localStorage.getItem('bizbrain-theme');
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('bizbrain-theme', theme);
  }

  setTheme(getPreferredTheme());

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var current = document.documentElement.getAttribute('data-theme');
      setTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  // ---- Copy to Clipboard ----
  if (copyBtn && installCommand) {
    copyBtn.addEventListener('click', function () {
      var text = installCommand.textContent.trim();
      navigator.clipboard.writeText(text).then(function () {
        copyBtn.classList.add('copied');
        setTimeout(function () { copyBtn.classList.remove('copied'); }, 2000);
      }).catch(function () {
        var textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
          document.execCommand('copy');
          copyBtn.classList.add('copied');
          setTimeout(function () { copyBtn.classList.remove('copied'); }, 2000);
        } catch (e) { /* silent */ }
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

    navLinks.querySelectorAll('.nav-link').forEach(function (link) {
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

  // ---- Scroll Progress Bar ----
  function updateScrollProgress() {
    if (!scrollProgress) return;
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = progress + '%';
  }

  // ---- Active Nav Section Tracking ----
  var navSectionLinks = document.querySelectorAll('.nav-link[data-section]');
  var sectionObserver;

  function setupSectionObserver() {
    if (!('IntersectionObserver' in window)) return;

    var sections = [];
    navSectionLinks.forEach(function (link) {
      var sectionId = link.getAttribute('data-section');
      var section = document.getElementById(sectionId);
      if (section) sections.push({ el: section, link: link });
    });

    sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          navSectionLinks.forEach(function (l) { l.classList.remove('active'); });
          var matchLink = document.querySelector('.nav-link[data-section="' + entry.target.id + '"]');
          if (matchLink) matchLink.classList.add('active');
        }
      });
    }, { rootMargin: '-30% 0px -60% 0px', threshold: 0 });

    sections.forEach(function (s) { sectionObserver.observe(s.el); });
  }

  setupSectionObserver();

  // ---- Nav background on scroll ----
  function handleNavScroll() {
    if (!nav) return;
    if (window.scrollY > 20) {
      nav.classList.add('scrolled');
      nav.style.borderBottomColor = 'var(--border)';
    } else {
      nav.classList.remove('scrolled');
      nav.style.borderBottomColor = 'var(--nav-border)';
    }
  }

  // ---- Back to Top Button ----
  function handleBackToTop() {
    if (!backToTop) return;
    if (window.scrollY > 600) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }

  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ---- Floating CTA ----
  function handleFloatingCTA() {
    if (!floatingCTA) return;
    var hero = document.getElementById('hero');
    var community = document.getElementById('community');
    if (!hero || !community) return;

    var heroBottom = hero.getBoundingClientRect().bottom;
    var communityTop = community.getBoundingClientRect().top;

    if (heroBottom < -100 && communityTop > window.innerHeight) {
      floatingCTA.classList.add('visible');
    } else {
      floatingCTA.classList.remove('visible');
    }
  }

  // ---- Scroll Indicator ----
  function handleScrollIndicator() {
    if (!scrollIndicator) return;
    if (window.scrollY > 100) {
      scrollIndicator.classList.add('hidden');
    } else {
      scrollIndicator.classList.remove('hidden');
    }
  }

  // ---- Scroll-based Fade-in Animations ----
  function handleScrollAnimations() {
    var elements = document.querySelectorAll('.animate-in');
    var windowHeight = window.innerHeight;
    elements.forEach(function (el) {
      var rect = el.getBoundingClientRect();
      if (rect.top < windowHeight * 0.88) {
        el.classList.add('visible');
      }
    });
  }

  // ---- Combined Scroll Handler ----
  handleScrollAnimations();
  handleNavScroll();
  handleBackToTop();
  handleFloatingCTA();
  handleScrollIndicator();
  updateScrollProgress();

  var scrollRAF;
  window.addEventListener('scroll', function () {
    if (scrollRAF) return;
    scrollRAF = requestAnimationFrame(function () {
      handleScrollAnimations();
      handleNavScroll();
      handleBackToTop();
      handleFloatingCTA();
      handleScrollIndicator();
      updateScrollProgress();
      scrollRAF = null;
    });
  }, { passive: true });

  // ---- Animated Counters ----
  function animateCounters() {
    var stats = document.querySelectorAll('.stat-value[data-target]');
    stats.forEach(function (stat) {
      if (stat.dataset.animated) return;
      var rect = stat.getBoundingClientRect();
      if (rect.top > window.innerHeight * 0.95) return;

      stat.dataset.animated = 'true';
      var target = parseInt(stat.dataset.target);
      var suffix = stat.dataset.suffix || '';
      var duration = 2000;
      var start = performance.now();

      function update(now) {
        var elapsed = now - start;
        var progress = Math.min(elapsed / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 4);
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

  // ---- Rotating Text in Hero ----
  if (rotatingText) {
    var phrases = ['Your Business', 'Your Clients', 'Your Projects', 'Your Workflows', 'Your History'];
    var phraseIndex = 0;
    rotatingText.classList.add('fade-in');

    setInterval(function () {
      rotatingText.classList.remove('fade-in');
      rotatingText.classList.add('fade-out');

      setTimeout(function () {
        phraseIndex = (phraseIndex + 1) % phrases.length;
        rotatingText.textContent = phrases[phraseIndex];
        rotatingText.classList.remove('fade-out');
        rotatingText.classList.add('fade-in');
      }, 300);
    }, 3000);
  }

  // ---- FAQ Accordion ----
  var faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function (item) {
    var question = item.querySelector('.faq-question');
    if (!question) return;

    question.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');

      // Close all others
      faqItems.forEach(function (other) {
        other.classList.remove('open');
        var btn = other.querySelector('.faq-question');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });

      // Toggle current
      if (!isOpen) {
        item.classList.add('open');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });

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

  // ---- Duplicate Marquee for Infinite Scroll ----
  var marqueeTrack = document.querySelector('.marquee-track');
  if (marqueeTrack) {
    var items = marqueeTrack.innerHTML;
    marqueeTrack.innerHTML = items + items;
  }

})();
