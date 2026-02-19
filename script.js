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

  // ---- Typing Animation ----
  var typingEl = document.getElementById('typing-text');
  var cursorEl = document.getElementById('typing-cursor');
  if (typingEl) {
    var phrases = [
      'business.',
      'clients.',
      'workflows.',
      'history.',
      'everything.'
    ];
    var phraseIdx = 0;
    var charIdx = 0;
    var isDeleting = false;
    var typeSpeed = 80;
    var deleteSpeed = 40;
    var pauseEnd = 2400;
    var pauseStart = 600;

    function tick() {
      var current = phrases[phraseIdx];
      if (!isDeleting) {
        charIdx++;
        typingEl.textContent = current.substring(0, charIdx);
        if (charIdx === current.length) {
          setTimeout(function () { isDeleting = true; tick(); }, pauseEnd);
          return;
        }
        setTimeout(tick, typeSpeed);
      } else {
        charIdx--;
        typingEl.textContent = current.substring(0, charIdx);
        if (charIdx === 0) {
          isDeleting = false;
          phraseIdx = (phraseIdx + 1) % phrases.length;
          setTimeout(tick, pauseStart);
          return;
        }
        setTimeout(tick, deleteSpeed);
      }
    }
    setTimeout(tick, 800);
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

  // ---- Interactive Compounding Growth Chart ----
  var growthChart = document.getElementById('growth-chart');
  var timeSlider = document.getElementById('time-slider');
  var knowledgeCounter = document.getElementById('knowledge-counter');
  var detailTime = document.getElementById('detail-time');
  var detailRecords = document.getElementById('detail-records');
  var detailTitle = document.getElementById('detail-title');
  var detailDesc = document.getElementById('detail-desc');

  var milestones = [
    { time: 'Day 1', records: 10, title: 'Foundation', desc: 'Your business profile, key clients, and active projects are structured. AI stops asking \u201cwhat do you do?\u201d' },
    { time: 'Week 1', records: 45, title: 'Pattern Recognition', desc: 'Client preferences, communication styles, and project workflows emerge. AI starts anticipating needs.' },
    { time: 'Month 1', records: 180, title: 'Institutional Knowledge', desc: 'Historical decisions, resolved issues, and proven approaches are captured. New team members onboard in minutes, not weeks.' },
    { time: 'Month 6', records: 2400, title: 'Deep Understanding', desc: 'AI knows your client\u2019s preferred communication channel, your team\u2019s velocity patterns, and which proposals close. It drafts content in your voice.' },
    { time: 'Year 1', records: 15000, title: 'Competitive Moat', desc: 'Your AI context layer contains insights no competitor can replicate. It\u2019s not just data \u2014 it\u2019s structured understanding of your unique business.' },
    { time: 'Year 2', records: 85000, title: 'Insurmountable Advantage', desc: 'A competitor starting now is two years behind. Your context layer feeds every new AI tool instantly. Theirs starts from scratch.' }
  ];

  function formatNumber(n) {
    if (n >= 1000) return (n / 1000).toFixed(n >= 10000 ? 0 : 1) + 'K';
    return n.toString();
  }

  function animateCounter(target, duration) {
    if (!knowledgeCounter) return;
    var start = parseInt(knowledgeCounter.dataset.current || '0');
    var startTime = performance.now();
    duration = duration || 800;

    function update(now) {
      var elapsed = now - startTime;
      var progress = Math.min(elapsed / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.round(start + (target - start) * eased);
      knowledgeCounter.textContent = current.toLocaleString();
      knowledgeCounter.dataset.current = current;
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  function updateMilestone(index) {
    if (!detailTime) return;
    var m = milestones[index];
    detailTime.textContent = m.time;
    detailRecords.textContent = formatNumber(m.records) + ' records';
    detailTitle.textContent = m.title;
    detailDesc.textContent = m.desc;
    animateCounter(m.records);

    // Highlight active dot
    var dots = document.querySelectorAll('.milestone-dot');
    dots.forEach(function (dot, i) {
      if (i === index) {
        dot.classList.add('active');
        dot.setAttribute('r', '9');
      } else {
        dot.classList.remove('active');
        dot.setAttribute('r', '6');
      }
    });
  }

  if (growthChart && timeSlider) {
    // Slider interaction
    timeSlider.addEventListener('input', function () {
      updateMilestone(parseInt(this.value));
    });

    // Click on dots
    var dots = document.querySelectorAll('.milestone-dot');
    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        var index = parseInt(this.getAttribute('data-index'));
        timeSlider.value = index;
        updateMilestone(index);
      });
    });

    // Scroll-triggered animation
    if ('IntersectionObserver' in window) {
      var chartObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !growthChart.classList.contains('active')) {
            growthChart.classList.add('active');
            animateCounter(milestones[0].records, 1200);
          }
        });
      }, { threshold: 0.3 });
      chartObserver.observe(growthChart);
    }
  }

  // ---- Interactive Honeycomb Module Showcase ----
  var moduleData = {
    core: {
      name: 'Core (Always Active)',
      modules: [
        { name: 'Brain Core', desc: 'Central intelligence hub — state management, context routing' },
        { name: 'Knowledge Base', desc: 'Structured business knowledge with full-text search' },
        { name: 'Conversation Capture', desc: 'Auto-captures every AI session in real-time' },
        { name: 'Entity Watchdog', desc: 'Monitors and updates client/partner/vendor records' }
      ]
    },
    deploy: {
      name: 'Development & Deploy',
      modules: [
        { name: 'GitHub Integration', desc: 'Repo management, PR workflows, issue tracking' },
        { name: 'Supabase Agent', desc: 'Database design, migrations, RLS policies' },
        { name: 'Stripe & Clerk', desc: 'Payments, auth, and SaaS scaffolding' },
        { name: 'GSD Orchestrator', desc: 'Structured project execution with wave parallelization' }
      ]
    },
    comms: {
      name: 'Communication',
      modules: [
        { name: 'Communications Hub', desc: 'Unified inbox across all channels' },
        { name: 'Gmail Integration', desc: 'Send, receive, and draft emails with context' },
        { name: 'Slack Agent', desc: 'Channel monitoring, bug-fixing from Slack' },
        { name: 'WhatsApp Gateway', desc: 'Business messaging with entity awareness' }
      ]
    },
    content: {
      name: 'Content Creation',
      modules: [
        { name: 'Content Factory', desc: 'Auto-generate blogs, social posts, newsletters' },
        { name: 'Remotion Studio', desc: 'Programmatic video creation and motion graphics' },
        { name: 'Slideshow Generator', desc: 'Slidev presentations from outlines' },
        { name: 'Digest Generator', desc: 'Weekly summaries from all activity sources' }
      ]
    },
    integrations: {
      name: 'Integrations',
      modules: [
        { name: 'MCP Manager', desc: 'Dynamic MCP server profiles and subprocess delegation' },
        { name: 'Supabase Agent', desc: 'Global database specialist, auto-detects projects' },
        { name: 'SaaS Agent', desc: 'Full-stack SaaS scaffolding (Clerk + Stripe + Supabase)' },
        { name: 'Chrome Automation', desc: 'Browser control for testing and web interaction' }
      ]
    },
    bizops: {
      name: 'Business & CRM',
      modules: [
        { name: 'Client Tracking', desc: 'Full client lifecycle with history and preferences' },
        { name: 'Time & Billing', desc: 'Automatic time tracking with timesheet reports' },
        { name: 'Spec & Implement', desc: 'Feature specs with structured implementation' },
        { name: 'Todo Aggregator', desc: 'Unified task view across all projects and entities' }
      ]
    },
    automation: {
      name: 'Setup & Automation',
      modules: [
        { name: 'Voice Input', desc: 'Voice-to-context with structured extraction' },
        { name: 'Notion Sync', desc: 'Two-way sync with Notion databases' },
        { name: 'Obsidian Archive', desc: 'Session archiving to Obsidian vault' }
      ]
    },
    all: {
      name: 'All Modules',
      modules: [
        { name: '27+ modules', desc: 'Organized into 7 categories. Every module feeds the context layer.' },
        { name: 'Install what you need', desc: 'Modular architecture — activate only the modules relevant to your business.' },
        { name: 'Context compounds', desc: 'The more modules active, the smarter every tool becomes.' }
      ]
    }
  };

  var hexCells = document.querySelectorAll('.hex-cell:not(.hex-cell-ghost)');
  var detailPanel = document.getElementById('module-detail-panel');
  var detailCategory = document.getElementById('detail-category');
  var detailCount = document.getElementById('detail-count');
  var detailModules = document.getElementById('detail-modules');

  function showModuleDetail(category) {
    var data = moduleData[category];
    if (!data) return;

    hexCells.forEach(function (c) { c.classList.remove('active'); });
    var activeCell = document.querySelector('.hex-cell[data-category="' + category + '"]');
    if (activeCell) activeCell.classList.add('active');

    detailPanel.classList.add('active');
    detailCategory.textContent = data.name;
    detailCount.textContent = data.modules.length + ' modules';

    detailModules.innerHTML = '';
    data.modules.forEach(function (mod, i) {
      var item = document.createElement('div');
      item.className = 'detail-module-item';
      item.style.animationDelay = (i * 0.06) + 's';
      item.innerHTML = '<div class="detail-module-dot"></div>' +
        '<div class="detail-module-info">' +
        '<div class="detail-module-name">' + mod.name + '</div>' +
        '<div class="detail-module-desc">' + mod.desc + '</div>' +
        '</div>';
      detailModules.appendChild(item);
    });
  }

  hexCells.forEach(function (cell) {
    cell.addEventListener('click', function () {
      var category = this.getAttribute('data-category');
      showModuleDetail(category);
    });
  });

  // ---- Interactive Hero Demo Tab Navigation ----
  var demoTabs = document.querySelectorAll('.demo-tab');
  var demoPanes = document.querySelectorAll('.demo-pane');

  function showDemoPane(paneName) {
    demoPanes.forEach(function (p) { p.classList.remove('active'); });
    var target = document.querySelector('.demo-pane[data-pane="' + paneName + '"]');
    if (target) target.classList.add('active');
  }

  demoTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var paneName = this.getAttribute('data-demo-tab');
      demoTabs.forEach(function (t) { t.classList.remove('active'); });
      tab.classList.add('active');
      showDemoPane(paneName);
    });
  });

  // ---- Project Drill-down Data ----
  var demoProjects = {
    bizbrain: {
      name: 'BizBrain OS', status: 'green', statusLabel: 'Active',
      tech: ['Vanilla JS', 'Tauri v2', 'Rust'],
      desc: 'Personal business intelligence OS. Local-first knowledge layer with desktop app and CLI tooling.',
      commits: 156, issues: 3, prs: 1, uptime: '99.9%',
      activity: [
        { icon: '\u{1F680}', bg: 'rgba(34,197,94,0.12)', text: '<strong>Deployed</strong> v1.2.0', time: '2h ago' },
        { icon: '\u{1F500}', bg: 'rgba(59,130,246,0.12)', text: '<strong>Merged PR #12</strong> \u2014 File watcher', time: '5h ago' },
        { icon: '\u{1F41B}', bg: 'rgba(239,68,68,0.12)', text: '<strong>Fixed #28</strong> \u2014 Tray icon bug', time: '1d ago' }
      ]
    },
    meridian: {
      name: 'Meridian CRM', status: 'green', statusLabel: 'Active',
      tech: ['Next.js 14', 'Supabase', 'Clerk', 'Tailwind'],
      desc: 'Client relationship management platform with team collaboration and pipeline tracking.',
      commits: 347, issues: 12, prs: 4, uptime: '99.7%',
      activity: [
        { icon: '\u2705', bg: 'rgba(34,197,94,0.12)', text: '<strong>Tests passing</strong> \u2014 94/94 specs', time: '1h ago' },
        { icon: '\u{1F500}', bg: 'rgba(59,130,246,0.12)', text: '<strong>Merged PR #47</strong> \u2014 Kanban drag-drop', time: '3h ago' },
        { icon: '\u{1F6E1}', bg: 'rgba(234,179,8,0.12)', text: '<strong>Updated</strong> RLS policies', time: '8h ago' }
      ]
    },
    atlas: {
      name: 'Atlas Analytics', status: 'green', statusLabel: 'Active',
      tech: ['React 19', 'D3.js', 'PostgreSQL', 'Express'],
      desc: 'Business analytics dashboard with real-time data visualization and custom report builder.',
      commits: 203, issues: 8, prs: 2, uptime: '99.5%',
      activity: [
        { icon: '\u{1F4CA}', bg: 'rgba(0,212,255,0.12)', text: '<strong>Added</strong> funnel visualization', time: '4h ago' },
        { icon: '\u{1F500}', bg: 'rgba(59,130,246,0.12)', text: '<strong>Merged PR #31</strong> \u2014 Query perf fix', time: '1d ago' }
      ]
    },
    beacon: {
      name: 'Beacon AI', status: 'yellow', statusLabel: 'Needs Attention',
      tech: ['Python', 'FastAPI', 'LangChain', 'Pinecone'],
      desc: 'AI assistant platform with RAG pipeline, conversation memory, and tool use.',
      commits: 89, issues: 15, prs: 6, uptime: '97.2%',
      activity: [
        { icon: '\u26A0', bg: 'rgba(234,179,8,0.12)', text: '<strong>Blocker:</strong> Pinecone rate limit', time: '30m ago' },
        { icon: '\u{1F500}', bg: 'rgba(59,130,246,0.12)', text: '<strong>Opened PR #19</strong> \u2014 Streaming', time: '2h ago' },
        { icon: '\u{1F41B}', bg: 'rgba(239,68,68,0.12)', text: '<strong>Investigating</strong> memory leak', time: '2d ago' }
      ]
    },
    novapay: {
      name: 'NovaPay', status: 'green', statusLabel: 'Active',
      tech: ['Next.js 14', 'Stripe', 'Redis', 'Prisma'],
      desc: 'Payment processing platform with subscription management and real-time webhooks.',
      commits: 412, issues: 5, prs: 1, uptime: '99.99%',
      activity: [
        { icon: '\u{1F4B3}', bg: 'rgba(34,197,94,0.12)', text: '<strong>Processed</strong> 2,847 txns today', time: '15m ago' },
        { icon: '\u{1F500}', bg: 'rgba(59,130,246,0.12)', text: '<strong>Merged PR #83</strong> \u2014 Sub pause/resume', time: '6h ago' }
      ]
    },
    cascade: {
      name: 'Cascade Docs', status: 'green', statusLabel: 'Active',
      tech: ['Next.js', 'MDX', 'Contentlayer', 'Vercel'],
      desc: 'Documentation platform with versioning, search, and interactive code examples.',
      commits: 134, issues: 2, prs: 0, uptime: '100%',
      activity: [
        { icon: '\u{1F4DD}', bg: 'rgba(0,212,255,0.12)', text: '<strong>Published</strong> 3 new API pages', time: '3h ago' },
        { icon: '\u{1F50D}', bg: 'rgba(59,130,246,0.12)', text: '<strong>Improved</strong> search indexing', time: '1d ago' }
      ]
    }
  };

  // ---- Project Card Click -> Detail View ----
  var demoDetailPane = document.getElementById('demo-project-detail');
  document.querySelectorAll('.demo-proj-card[data-project]').forEach(function (card) {
    card.addEventListener('click', function () {
      var projectId = this.getAttribute('data-project');
      var p = demoProjects[projectId];
      if (!p || !demoDetailPane) return;

      var html = '<button class="demo-detail-back" id="demo-back-btn">\u2190 Back to Projects</button>';
      html += '<div class="demo-detail-head"><span class="demo-proj-health ' + p.status + '" style="width:10px;height:10px"></span><span class="demo-detail-name">' + p.name + '</span><span class="demo-detail-badge ' + p.status + '">' + p.statusLabel + '</span></div>';
      html += '<div class="demo-detail-stats"><div class="demo-detail-stat"><div class="demo-detail-stat-num">' + p.commits + '</div><div class="demo-detail-stat-lbl">commits</div></div><div class="demo-detail-stat"><div class="demo-detail-stat-num">' + p.issues + '</div><div class="demo-detail-stat-lbl">issues</div></div><div class="demo-detail-stat"><div class="demo-detail-stat-num">' + p.prs + '</div><div class="demo-detail-stat-lbl">PRs</div></div><div class="demo-detail-stat"><div class="demo-detail-stat-num" style="color:#22c55e">' + p.uptime + '</div><div class="demo-detail-stat-lbl">uptime</div></div></div>';
      html += '<div class="demo-detail-desc">' + p.desc + '</div>';
      html += '<div class="demo-proj-tags" style="margin-bottom:14px">' + p.tech.map(function (t) { return '<span class="demo-tag">' + t + '</span>'; }).join('') + '</div>';
      html += '<div class="demo-detail-section"><div class="demo-detail-section-title">Recent Activity</div>';
      p.activity.forEach(function (a) {
        html += '<div class="demo-detail-activity"><div class="demo-detail-activity-icon" style="background:' + a.bg + '">' + a.icon + '</div><div class="demo-detail-activity-text">' + a.text + '</div><div class="demo-detail-activity-time">' + a.time + '</div></div>';
      });
      html += '</div>';
      html += '<div class="demo-detail-actions"><span class="demo-btn-sm accent">Open Repo</span><span class="demo-btn-sm green">Run Tests</span><span class="demo-btn-sm gray">Deploy</span><span class="demo-btn-sm gray">View Logs</span></div>';

      demoDetailPane.innerHTML = html;
      showDemoPane('project-detail');

      document.getElementById('demo-back-btn').addEventListener('click', function () {
        showDemoPane('projects');
      });
    });
  });

})();
