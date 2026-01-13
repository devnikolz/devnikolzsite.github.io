(function() {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim();
    if (all) {
      return [...document.querySelectorAll(el)];
    } else {
      return document.querySelector(el);
    }
  };

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all);
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener));
      } else {
        selectEl.addEventListener(type, listener);
      }
    }
  };

  /**
   * Scrolls to top smoothly
   */
  const scrollto = (el) => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  /**
   * Mobile nav toggle
   */
  on('click', '.mobile-nav-toggle', function(e) {
    select('#navbar').classList.toggle('navbar-mobile');
    this.classList.toggle('bi-list');
    this.classList.toggle('bi-x');
  });

  /**
   * Navigation click handler (desktop + mobile)
   */
  on('click', '#navbar .nav-link', function(e) {
    let section = select(this.hash);
    if (section) {
      e.preventDefault();

      let navbar = select('#navbar');
      let header = select('#header');
      let sections = select('section', true);
      let navlinks = select('#navbar .nav-link', true);

      // Update active link
      navlinks.forEach(item => item.classList.remove('active'));
      this.classList.add('active');

      // Close mobile menu
      if (navbar.classList.contains('navbar-mobile')) {
        navbar.classList.remove('navbar-mobile');
        let toggle = select('.mobile-nav-toggle');
        toggle.classList.toggle('bi-list');
        toggle.classList.toggle('bi-x');
      }

      // Special case: back to header/home
      if (this.hash === '#header') {
        header.classList.remove('header-top');
        sections.forEach(s => s.classList.remove('section-show'));
        localStorage.setItem('lastSection', '#header');
        scrollto(this.hash);
        return;
      }

      // Normal section navigation
      header.classList.add('header-top');

      setTimeout(() => {
        sections.forEach(s => s.classList.remove('section-show'));
        section.classList.add('section-show');
      }, 350);

      scrollto(this.hash);

      // Remember this section
      localStorage.setItem('lastSection', this.hash);
    }
  }, true);

  /**
   * On page load - restore last section or default to About
   */
  window.addEventListener('load', () => {
    const header = select('#header');
    const sections = select('section', true);
    const navlinks = select('#navbar .nav-link', true);

    // Get saved section (or fallback to #about)
    let targetHash = localStorage.getItem('lastSection') || '#about';

    // URL hash has highest priority (direct link / bookmark)
    if (window.location.hash) {
      targetHash = window.location.hash;
    }

    const targetSection = select(targetHash);

    if (targetSection) {
      // Show header bar
      header.classList.add('header-top');

      // Clean up everything first
      sections.forEach(s => s.classList.remove('section-show'));
      navlinks.forEach(link => link.classList.remove('active'));

      // Activate correct section + nav link
      targetSection.classList.add('section-show');

      const activeLink = select(`#navbar .nav-link[href="${targetHash}"]`);
      if (activeLink) {
        activeLink.classList.add('active');
      }

      // Small delay for smooth visual transition
      setTimeout(() => {
        scrollto(targetHash);
      }, 100);
    } else {
      // Fallback if hash/section doesn't exist
      localStorage.setItem('lastSection', '#about');
    }
  });

  // ─────────────────────────────────────────────────────────────
  // The rest of your code (skills, sliders, isotope, lightbox, etc.)
  // remains exactly the same ↓
  // ─────────────────────────────────────────────────────────────

  /**
   * Skills animation
   */
  let skillsContent = select('.skills-content');
  if (skillsContent) {
    new Waypoint({
      element: skillsContent,
      offset: '80%',
      handler: function(direction) {
        let progress = select('.progress .progress-bar', true);
        progress.forEach(el => {
          el.style.width = el.getAttribute('aria-valuenow') + '%';
        });
      }
    });
  }

  /**
   * Testimonials slider
   */
  new Swiper('.testimonials-slider', {
    speed: 600,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    slidesPerView: 'auto',
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    },
    breakpoints: {
      320: { slidesPerView: 1, spaceBetween: 20 },
      1200: { slidesPerView: 3, spaceBetween: 20 }
    }
  });

  /**
   * Portfolio isotope and filter
   */
  window.addEventListener('load', () => {
    let portfolioContainer = select('.portfolio-container');
    if (portfolioContainer) {
      let portfolioIsotope = new Isotope(portfolioContainer, {
        itemSelector: '.portfolio-item',
        layoutMode: 'fitRows'
      });

      let portfolioFilters = select('#portfolio-flters li', true);
      on('click', '#portfolio-flters li', function(e) {
        e.preventDefault();
        portfolioFilters.forEach(el => el.classList.remove('filter-active'));
        this.classList.add('filter-active');
        portfolioIsotope.arrange({ filter: this.getAttribute('data-filter') });
      }, true);
    }
  });

  /**
   * Portfolio lightbox
   */
  const portfolioLightbox = GLightbox({ selector: '.portfolio-lightbox' });

  /**
   * Portfolio details lightbox
   */
  const portfolioDetailsLightbox = GLightbox({
    selector: '.portfolio-details-lightbox',
    width: '90%',
    height: '90vh'
  });

  /**
   * Portfolio details slider
   */
  new Swiper('.portfolio-details-slider', {
    speed: 400,
    loop: true,
    autoplay: { delay: 5000, disableOnInteraction: false },
    pagination: { el: '.swiper-pagination', type: 'bullets', clickable: true }
  });

  /**
   * Pure Counter
   */
  new PureCounter();

})();