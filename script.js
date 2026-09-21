/* ==========================================================================
   MADANG PROVINCE TOURISM — SCRIPT
   ========================================================================== */

/* Shared behaviour for the Madang tourism site.
   The script updates the footer year, handles mobile navigation state,
   manages the optional FAQ drawer, and highlights the active nav link on
   the home page as the user scrolls through each anchor section.
*/
document.addEventListener('DOMContentLoaded', () => { // waits until the HTML is fully loaded before the interactive logic runs

  /* ---------- Footer year ---------- */
  /* The year element is used to display the current year in the footer automatically. */
  const yearEl = document.getElementById('year'); // gets the footer year placeholder so it can be filled with the current date
  /* If the footer year element exists, populate it with the current four-digit year. */
  if (yearEl) yearEl.textContent = new Date().getFullYear(); // keeps the footer copyright year current without hard-coding it into the markup

  /* ---------- Mobile menu: toggle open/closed state across devices ---------- */
  /* These variables store the mobile menu elements and controls for responsive navigation. */
  const navToggle = document.getElementById('navToggle'); // checkbox used to track the visible mobile menu state
  const navBurger = document.getElementById('navBurger'); // burger icon button controlling the menu for small screens
  const navLinks = document.getElementById('navLinks'); // the nav menu itself, which gets the open/closed class toggled
  const nav = document.querySelector('.nav'); // main header element, used for header-specific open state styling
  const faqDrawer = document.getElementById('faqDrawer'); // optional drawer that is only present when the FAQ feature is included in the page
  const faqToggle = document.querySelector('.nav__faq-toggle'); // optional trigger for opening the FAQ drawer from the top navigation
  const faqClose = document.querySelector('.faq__close'); // optional close button inside the FAQ drawer

  /* Keeps the menu state in sync across the checkbox, burger icon and nav panel. */
  const setMenuState = (isOpen) => { // defines a helper that opens or closes the mobile menu consistently
    /* If the required menu elements are missing, stop processing immediately. */
    if (!navToggle || !navBurger || !navLinks) return; // exits early if the mobile navigation structure is not present

    /* Update the checkbox state to match the current menu visibility. */
    navToggle.checked = isOpen; // sets the hidden checkbox to reflect the menu's open or closed state
    /* Toggle the burger icon styling to show the menu as open or closed. */
    navBurger.classList.toggle('is-open', isOpen); // adds or removes the visual open state on the burger button
    /* Toggle the nav panel visibility class for the mobile overlay menu. */
    navLinks.classList.toggle('is-open', isOpen); // adds or removes the open-state class from the navigation list
    /* Update the ARIA expanded property for accessibility. */
    navBurger.setAttribute('aria-expanded', String(isOpen)); // exposes the current menu state to assistive technologies
    /* Update the burger button label so screen readers know whether the menu is open or closed. */
    navBurger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu'); // changes the accessible label based on the menu state
    /* Toggle a header class used for styling when the mobile menu is open. */
    nav?.classList.toggle('is-open', isOpen); // adds or removes the header open-state class if the nav exists
    /* Prevent the page from scrolling while the mobile menu is open. */
    document.body.classList.toggle('menu-open', isOpen); // adds or removes the body class that locks background scrolling
  };

  /* Updates the FAQ drawer open state and locks page scrolling when it is visible. */
  const setFaqState = (isOpen) => { // defines a helper for opening and closing the FAQ panel
    /* If the FAQ drawer does not exist on this page, exit early. */
    if (!faqDrawer) return; // stops processing when the FAQ drawer is not present
    /* Toggle the open class to reveal or hide the drawer content. */
    faqDrawer.classList.toggle('is-open', isOpen); // adds or removes the open state from the FAQ drawer
    /* Expose the hidden state to assistive technologies. */
    faqDrawer.setAttribute('aria-hidden', String(!isOpen)); // sets aria-hidden to true when the drawer is closed
    /* Allow or block scrolling while the FAQ panel is open. */
    document.body.classList.toggle('faq-open', isOpen); // toggles the body class used to prevent page scrolling
    /* Keep the FAQ trigger button state aligned with the drawer visibility. */
    if (faqToggle) faqToggle.setAttribute('aria-expanded', String(isOpen)); // updates the FAQ trigger's expanded attribute
  };

  /* Only attach menu event listeners when the mobile navigation elements are present. */
  if (navToggle && navBurger) { // checks whether the mobile menu controls exist before wiring events
    /* Clicking the burger button opens or closes the menu. */
    navBurger.addEventListener('click', () => { // listens for clicks on the hamburger button
      /* If the FAQ drawer is open, close it before toggling the mobile menu. */
      if (faqDrawer && faqDrawer.classList.contains('is-open')) { // checks whether the FAQ drawer is currently open
        setFaqState(false); // closes the FAQ drawer to avoid overlapping overlays
      }
      /* Toggle the menu using the current checked state of the hidden checkbox. */
      setMenuState(!navToggle.checked); // flips the menu state to its opposite value
    });

    /* Listen for changes to the hidden checkbox that tracks menu state. */
    navToggle.addEventListener('change', () => setMenuState(navToggle.checked)); // updates the visible menu when the checkbox changes

    /* Close the mobile menu when any nav link is clicked. */
    document.querySelectorAll('.nav__links .nav__link').forEach(link => { // selects each navigation link inside the menu
      link.addEventListener('click', () => setMenuState(false)); // closes the menu after a link is activated
    });

    /* Close the mobile menu when the user clicks outside of the nav area. */
    document.addEventListener('click', (event) => { // listens for clicks anywhere on the page
      /* Exit if the nav elements are missing. */
      if (!navLinks || !navBurger) return; // confirms the nav panel and burger button exist before processing the click
      /* Calculate whether the click happened inside the navigation region. */
      const clickedInsideNav = navLinks.contains(event.target) || navBurger.contains(event.target); // true when the click happens inside the nav or on the burger button
      /* If the menu is open and the user clicked outside, close it. */
      if (navToggle.checked && !clickedInsideNav) { // checks whether the menu is open and the click happened outside the nav
        setMenuState(false); // closes the menu
      }
    });

    /* Close the mobile menu and FAQ drawer when the Escape key is pressed. */
    document.addEventListener('keydown', (e) => { // listens for keyboard input
      /* Only respond when Escape is pressed. */
      if (e.key === 'Escape') { // checks whether the pressed key is Escape
        /* Close the menu if it is open. */
        if (navToggle.checked) setMenuState(false); // closes the mobile menu when open
        /* Close the FAQ drawer if it is open. */
        if (faqDrawer && faqDrawer.classList.contains('is-open')) setFaqState(false); // closes the FAQ drawer when it is open
      }
    });

    /* Reset the mobile menu when the viewport becomes wide enough for the desktop layout. */
    window.addEventListener('resize', () => { // listens for resize events
      /* If the screen is wide enough and the menu was open, close it. */
      if (window.innerWidth > 760 && navToggle.checked) setMenuState(false); // closes the menu on larger screens to keep layout consistent
    });
  }

  /* Attach the FAQ open/close behaviour only when the FAQ toggle exists. */
  if (faqToggle) { // checks whether the FAQ toggle button exists on the page
    /* Clicking the FAQ trigger toggles the drawer open and closes the mobile menu if needed. */
    faqToggle.addEventListener('click', () => { // listens for clicks on the FAQ trigger
      /* Invert the current FAQ drawer state. */
      const shouldOpen = !faqDrawer?.classList.contains('is-open'); // determines whether the FAQ drawer should open or close
      /* Set the new drawer state. */
      setFaqState(shouldOpen); // opens or closes the FAQ drawer according to the computed value
      /* Close the mobile menu if it is open to avoid overlap. */
      if (navToggle && navToggle.checked) setMenuState(false); // closes the mobile menu when the FAQ drawer opens
    });
  }

  /* Attach the FAQ close button listener when the close control exists. */
  if (faqClose) { // checks whether the FAQ close button is present
    faqClose.addEventListener('click', () => setFaqState(false)); // closes the FAQ drawer when the user clicks the close button
  }

  /* ---------- Back to top button ---------- */
  const backToTopBtn = document.querySelector('#backToTop'); // finds the floating back-to-top button element
  if (backToTopBtn) { // checks whether the element exists before adding behavior
    /* Scroll the page to the top smoothly when the user clicks the button. */
    backToTopBtn.addEventListener('click', () => { // listens for a click on the back-to-top control
      /* Use smooth scrolling for a polished page transition. */
      window.scrollTo({ // scrolls the window to a new vertical position
        top: 0, // sets the scroll position to the top of the page
        behavior: 'smooth' // animates the scroll rather than jumping immediately
      });
    });
  }

  /* ---------- Active nav link highlighting — homepage only ---------- */
  /* The home page has multiple in-page sections, so the active nav item should update as the user scrolls. */
  if (document.body.dataset.page === 'home') { // the three standalone sub-pages mark their own nav link active directly in CSS, since it never changes; only the homepage has multiple in-page sections to track as the user scrolls
    /* Store the sections that can be matched to nav links. */
    const sections = ['home', 'discover', 'experiences', 'destinations', 'culture', 'plan'] // ids of the sections tracked by the nav
      .map(id => document.getElementById(id)) // converts each id string into the actual DOM element
      .filter(Boolean); // drops any that don't exist on this page
    /* Collect the homepage nav links that should receive the active state. */
    const navLinkEls = document.querySelectorAll('.nav__link[href^="#"]'); // only the same-page anchor links can ever become "active" this way — Experiences, Culture and Accommodation are separate pages now

    /* Determine which section is currently nearest to the top of the viewport. */
    const setActiveLink = () => { // figures out which section is currently in view and highlights the matching link
      /* Start with the first section in case no section is active yet. */
      let currentId = sections[0] ? sections[0].id : null; // defaults to the first section in case nothing else matches yet
      /* Use a small offset so the section is considered active slightly before it reaches the very top. */
      const scrollPos = window.scrollY + 140; // scroll position plus an offset, so a section counts as "active" a bit before it reaches the very top
      /* Update the active section based on which section offset is less than or equal to the current scroll position. */
      sections.forEach(section => { if (section.offsetTop <= scrollPos) currentId = section.id; }); // the last section the user has scrolled past becomes the current one
      /* Toggle the active class on the matching nav link and remove it from the others. */
      navLinkEls.forEach(link => { link.classList.toggle('is-active', link.getAttribute('href') === '#' + currentId); }); // marks the one matching link active and clears the rest
    };
    /* Run the active nav logic immediately so the correct section is highlighted on page load. */
    setActiveLink(); // runs once immediately so the correct link is highlighted on page load
    /* Recalculate the active section whenever the page is scrolled. */
    window.addEventListener('scroll', setActiveLink, { passive: true }); // re-checks on every scroll; passive:true improves scroll performance
  }
});
