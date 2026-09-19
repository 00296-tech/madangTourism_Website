/* ==========================================================================
   MADANG PROVINCE TOURISM — SCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => { // waits until the HTML is fully loaded/parsed before running any of the code inside

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year'); // grabs the empty <span id="year"> element in the footer
  if (yearEl) yearEl.textContent = new Date().getFullYear(); // if that element exists, fills it with the current four-digit year; CSS has no way to read the system date

  /* ---------- Mobile menu: toggle open/closed state across devices ---------- */
  const navToggle = document.getElementById('navToggle');
  const navBurger = document.getElementById('navBurger');
  const navLinks = document.getElementById('navLinks');
  const nav = document.querySelector('.nav');
  const faqDrawer = document.getElementById('faqDrawer');
  const faqToggle = document.querySelector('.nav__faq-toggle');
  const faqClose = document.querySelector('.faq__close');

  const setMenuState = (isOpen) => {
    if (!navToggle || !navBurger || !navLinks) return;

    navToggle.checked = isOpen;
    navBurger.classList.toggle('is-open', isOpen);
    navLinks.classList.toggle('is-open', isOpen);
    navBurger.setAttribute('aria-expanded', String(isOpen));
    navBurger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    nav?.classList.toggle('is-open', isOpen);
    document.body.classList.toggle('menu-open', isOpen);
  };

  const setFaqState = (isOpen) => {
    if (!faqDrawer) return;
    faqDrawer.classList.toggle('is-open', isOpen);
    faqDrawer.setAttribute('aria-hidden', String(!isOpen));
    document.body.classList.toggle('faq-open', isOpen);
    if (faqToggle) faqToggle.setAttribute('aria-expanded', String(isOpen));
  };

  if (navToggle && navBurger) {
    navBurger.addEventListener('click', () => {
      if (faqDrawer && faqDrawer.classList.contains('is-open')) {
        setFaqState(false);
      }
      setMenuState(!navToggle.checked);
    });

    navToggle.addEventListener('change', () => setMenuState(navToggle.checked));

    document.querySelectorAll('.nav__links .nav__link').forEach(link => {
      link.addEventListener('click', () => setMenuState(false));
    });

    document.addEventListener('click', (event) => {
      if (!navLinks || !navBurger) return;
      const clickedInsideNav = navLinks.contains(event.target) || navBurger.contains(event.target);
      if (navToggle.checked && !clickedInsideNav) {
        setMenuState(false);
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (navToggle.checked) setMenuState(false);
        if (faqDrawer && faqDrawer.classList.contains('is-open')) setFaqState(false);
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 760 && navToggle.checked) setMenuState(false);
    });
  }

  if (faqToggle) {
    faqToggle.addEventListener('click', () => {
      const shouldOpen = !faqDrawer?.classList.contains('is-open');
      setFaqState(shouldOpen);
      if (navToggle && navToggle.checked) setMenuState(false);
    });
  }

  if (faqClose) {
    faqClose.addEventListener('click', () => setFaqState(false));
  }

  const backToTopBtn = document.querySelector('#backToTop');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* ---------- Active nav link highlighting — homepage only ---------- */
  if (document.body.dataset.page === 'home') { // the three standalone sub-pages mark their own nav link active directly in CSS (see body[data-page="..."] rules in style.css), since it never changes; only the homepage has multiple in-page sections to track as the user scrolls
    const sections = ['home', 'discover', 'experiences', 'destinations', 'culture', 'plan'] // ids of the sections tracked by the nav
      .map(id => document.getElementById(id)) // converts each id string into the actual DOM element
      .filter(Boolean); // drops any that don't exist on this page
    const navLinkEls = document.querySelectorAll('.nav__link[href^="#"]'); // only the same-page anchor links can ever become "active" this way — Experiences, Culture and Accommodation are separate pages now

    const setActiveLink = () => { // figures out which section is currently in view and highlights the matching link
      let currentId = sections[0] ? sections[0].id : null; // defaults to the first section in case nothing else matches yet
      const scrollPos = window.scrollY + 140; // scroll position plus an offset, so a section counts as "active" a bit before it reaches the very top
      sections.forEach(section => { if (section.offsetTop <= scrollPos) currentId = section.id; }); // the last section the user has scrolled past becomes the current one
      navLinkEls.forEach(link => { link.classList.toggle('is-active', link.getAttribute('href') === '#' + currentId); }); // marks the one matching link active and clears the rest
    };
    setActiveLink(); // runs once immediately so the correct link is highlighted on page load
    window.addEventListener('scroll', setActiveLink, { passive: true }); // re-checks on every scroll; passive:true improves scroll performance
  }
});
