/* ============================================
   HIGHWAY SENIOR SCHOOL - Main JavaScript
   "With Pride and Dignity, Endeavour to Excel"
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Preloader ──
  const preloader = document.querySelector('.preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.classList.add('hidden');
        document.body.style.overflow = '';
      }, 1500);
    });
    // Fallback
    setTimeout(() => {
      preloader.classList.add('hidden');
      document.body.style.overflow = '';
    }, 4000);
  }

  // ── Sticky Header ──
  const header = document.querySelector('.site-header');
  if (header) {
    const handleHeaderScroll = () => {
      if (window.scrollY > 80) {
        header.classList.remove('transparent');
        header.classList.add('scrolled');
      } else {
        header.classList.add('transparent');
        header.classList.remove('scrolled');
      }
    };
    handleHeaderScroll();
    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  }

  // ── Mobile Navigation ──
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileOverlay = document.querySelector('.mobile-nav-overlay');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  function closeMobileNav() {
    mobileToggle?.classList.remove('active');
    mobileNav?.classList.remove('open');
    mobileOverlay?.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileNav.classList.contains('open');
      if (isOpen) {
        closeMobileNav();
      } else {
        mobileToggle.classList.add('active');
        mobileNav.classList.add('open');
        mobileOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  }

  mobileOverlay?.addEventListener('click', closeMobileNav);
  mobileLinks.forEach(link => link.addEventListener('click', closeMobileNav));

  // ── Hero Carousel ──
  const heroSlides = document.querySelectorAll('.hero-slide');
  const heroDots = document.querySelectorAll('.hero-dot');
  let currentSlide = 0;
  let heroInterval;
  let isHeroPaused = false;

  function goToSlide(index) {
    heroSlides.forEach(s => s.classList.remove('active'));
    heroDots.forEach(d => d.classList.remove('active'));
    currentSlide = index;
    if (currentSlide >= heroSlides.length) currentSlide = 0;
    if (currentSlide < 0) currentSlide = heroSlides.length - 1;
    heroSlides[currentSlide]?.classList.add('active');
    heroDots[currentSlide]?.classList.add('active');
  }

  function nextSlide() {
    goToSlide(currentSlide + 1);
  }

  function startHeroAutoplay() {
    heroInterval = setInterval(() => {
      if (!isHeroPaused) nextSlide();
    }, 6000);
  }

  if (heroSlides.length > 0) {
    goToSlide(0);
    startHeroAutoplay();

    heroDots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        goToSlide(i);
        clearInterval(heroInterval);
        startHeroAutoplay();
      });
    });

    const heroCarousel = document.querySelector('.hero-carousel');
    heroCarousel?.addEventListener('mouseenter', () => isHeroPaused = true);
    heroCarousel?.addEventListener('mouseleave', () => isHeroPaused = false);
  }

  // ── Animated Counter ──
  const counters = document.querySelectorAll('[data-count]');
  let countersAnimated = false;

  function animateCounters() {
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-count'));
      const suffix = counter.getAttribute('data-suffix') || '';
      const prefix = counter.getAttribute('data-prefix') || '';
      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;

      const updateCounter = () => {
        current += step;
        if (current >= target) {
          counter.textContent = prefix + target.toLocaleString() + suffix;
          return;
        }
        counter.textContent = prefix + Math.floor(current).toLocaleString() + suffix;
        requestAnimationFrame(updateCounter);
      };

      updateCounter();
    });
    countersAnimated = true;
  }

  // ── Scroll Reveal ──
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));

  // Counter observer
  const statsBar = document.querySelector('.stats-bar');
  if (statsBar && counters.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersAnimated) {
          animateCounters();
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    counterObserver.observe(statsBar);
  }

  // ── News Carousel ──
  const newsCarousel = document.querySelector('.news-carousel');
  const newsPrev = document.querySelector('.news-nav-btn.prev');
  const newsNext = document.querySelector('.news-nav-btn.next');
  let newsOffset = 0;

  function getNewsCardWidth() {
    const card = document.querySelector('.news-card');
    if (!card) return 380;
    const style = getComputedStyle(card);
    return card.offsetWidth + parseInt(style.marginRight || 0) + 32;
  }

  function getVisibleCards() {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  }

  function updateNewsCarousel(direction) {
    if (!newsCarousel) return;
    const totalCards = document.querySelectorAll('.news-card').length;
    const visible = getVisibleCards();
    const maxOffset = totalCards - visible;
    
    if (direction === 'next' && newsOffset < maxOffset) {
      newsOffset++;
    } else if (direction === 'prev' && newsOffset > 0) {
      newsOffset--;
    }

    const cardWidth = getNewsCardWidth();
    newsCarousel.style.transform = `translateX(-${newsOffset * cardWidth}px)`;
  }

  newsPrev?.addEventListener('click', () => updateNewsCarousel('prev'));
  newsNext?.addEventListener('click', () => updateNewsCarousel('next'));

  // ── Back to Top ──
  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }, { passive: true });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ── Department Tabs ──
  const deptTabs = document.querySelectorAll('.dept-tab');
  const deptPanels = document.querySelectorAll('.dept-panel');

  deptTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-dept');

      deptTabs.forEach(t => t.classList.remove('active'));
      deptPanels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      document.getElementById(target)?.classList.add('active');
    });
  });

  // ── Gallery Filter ──
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      galleryItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          item.style.display = '';
          setTimeout(() => { item.style.opacity = '1'; item.style.transform = 'scale(1)'; }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.8)';
          setTimeout(() => { item.style.display = 'none'; }, 300);
        }
      });
    });
  });

  // ── Lightbox ──
  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = lightbox?.querySelector('img');
  const lightboxClose = document.querySelector('.lightbox-close');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img && lightbox && lightboxImg) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeLightbox() {
    lightbox?.classList.remove('active');
    document.body.style.overflow = '';
  }

  lightboxClose?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  // ── Performance Bar Chart Animation ──
  const bars = document.querySelectorAll('.bar');
  if (bars.length) {
    const barObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const height = bar.getAttribute('data-height');
          bar.style.height = height + '%';
          barObserver.unobserve(bar);
        }
      });
    }, { threshold: 0.3 });

    bars.forEach(bar => {
      bar.style.height = '0%';
      barObserver.observe(bar);
    });
  }

  // ── Active nav link highlighting ──
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ── Form handling ──
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = 'Sending...';
      btn.disabled = true;

      setTimeout(() => {
        btn.textContent = '✓ Message Sent!';
        btn.style.background = '#4caf50';
        contactForm.reset();

        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.background = '';
          btn.disabled = false;
        }, 3000);
      }, 1500);
    });
  }

  // ── Newsletter form ──
  const newsletterForms = document.querySelectorAll('.newsletter-form');
  newsletterForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input');
      if (input) {
        input.value = '';
        input.placeholder = '✓ Subscribed!';
        setTimeout(() => {
          input.placeholder = 'Your email address';
        }, 3000);
      }
    });
  });

  // ── Lazy loading images ──
  const lazyImages = document.querySelectorAll('img[data-src]');
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    }, { rootMargin: '200px' });

    lazyImages.forEach(img => imageObserver.observe(img));
  } else {
    lazyImages.forEach(img => {
      img.src = img.dataset.src;
    });
  }

  // ── Smooth scroll for anchor links ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      e.preventDefault();
      const target = document.querySelector(targetId);
      if (target) {
        const headerHeight = header ? header.offsetHeight : 0;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });

});
