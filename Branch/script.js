/* ==========================================================================
   MADANG PROVINCE TOURISM — SCRIPT
   Handles: sticky nav + scroll state, mobile menu, tide-line scroll progress,
   active-link highlighting, reveal-on-scroll, accordion FAQ, plan cards,
   back-to-top. Vanilla JS, no dependencies.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => { // waits until the HTML is fully loaded/parsed before running any of the code inside
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches; // checks the user's OS setting for reduced motion and stores true/false
  const currentPage = document.body.getAttribute('data-page'); // reads which page this is ("home", "experiences", or "accommodation") from the <body> tag, set per-file in the HTML

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year'); // grabs the empty <span id="year"> element in the footer
  if (yearEl) yearEl.textContent = new Date().getFullYear(); // if that element exists, fills it with the current four-digit year

  /* ---------- Sticky nav scroll state ---------- */
  const nav = document.getElementById('siteNav'); // grabs the <header> nav element by its id
  const setNavState = () => { // defines a function that checks scroll position and updates the nav's appearance
    if (window.scrollY > 40) nav.classList.add('is-scrolled'); // if scrolled down more than 40px, add the "scrolled" style class
    else nav.classList.remove('is-scrolled'); // otherwise remove that class, restoring the transparent nav state
  };
  setNavState(); // runs the check once immediately in case the page loads already scrolled
  window.addEventListener('scroll', setNavState, { passive: true }); // re-runs the check every time the user scrolls; passive:true improves scroll performance

  /* ---------- Mobile hamburger menu ---------- */
  const burger = document.getElementById('navBurger'); // grabs the hamburger button element
  const navLinksEl = document.getElementById('navLinks'); // grabs the nav links container (the slide-in panel on mobile)

  function closeMenu() { // defines a reusable function to close the mobile menu
    navLinksEl.classList.remove('is-open'); // removes the class that slides the panel into view
    burger.classList.remove('is-open'); // removes the class that turns the hamburger icon into an X
    burger.setAttribute('aria-expanded', 'false'); // updates the accessibility attribute to say the menu is now closed
    document.body.style.overflow = ''; // restores normal page scrolling (in case it was locked while the menu was open)
  }
  function openMenu() { // defines a reusable function to open the mobile menu
    navLinksEl.classList.add('is-open'); // adds the class that slides the panel into view
    burger.classList.add('is-open'); // adds the class that turns the hamburger icon into an X
    burger.setAttribute('aria-expanded', 'true'); // updates the accessibility attribute to say the menu is now open
    document.body.style.overflow = 'hidden'; // locks page scrolling behind the open mobile menu
  }

  burger.addEventListener('click', () => { // listens for clicks/taps on the hamburger button
    const isOpen = navLinksEl.classList.contains('is-open'); // checks whether the menu is currently open
    isOpen ? closeMenu() : openMenu(); // toggles: closes it if open, opens it if closed
  });

  navLinksEl.querySelectorAll('.nav__link').forEach(link => { // selects every individual nav link inside the menu
    link.addEventListener('click', closeMenu); // closes the mobile menu automatically whenever a link is clicked
  });

  document.addEventListener('keydown', (e) => { // listens for any key press anywhere on the page
    if (e.key === 'Escape') closeMenu(); // closes the mobile menu if the user presses the Escape key
  });

  /* ---------- Tide line: scroll progress fill ---------- */
  const tideFill = document.getElementById('tideFill'); // grabs the div that visually fills in as a scroll-progress bar
  function updateTide() { // defines a function that recalculates how full the tide bar should be
    const scrollTop = window.scrollY; // how many pixels the user has scrolled down from the top
    const docHeight = document.documentElement.scrollHeight - window.innerHeight; // total scrollable distance (full page height minus one viewport height)
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0; // converts scroll position into a percentage, guarding against dividing by zero
    tideFill.style.width = pct + '%'; // applies that percentage as the fill bar's width
  }
  updateTide(); // runs once immediately so the bar is correct even before any scrolling happens
  window.addEventListener('scroll', updateTide, { passive: true }); // recalculates the fill every time the user scrolls
  window.addEventListener('resize', updateTide); // recalculates the fill if the window is resized (page height may change)

  /* ---------- Smooth scroll for in-page links (native CSS handles most; this ensures menu closes) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => { // selects every link on the page whose href starts with "#" (an in-page anchor link)
    anchor.addEventListener('click', (e) => { // listens for clicks on each of those anchor links
      const targetId = anchor.getAttribute('href'); // reads the href value, e.g. "#experiences"
      if (targetId.length > 1) { // only proceeds if it's a real target and not just a bare "#"
        const target = document.querySelector(targetId); // finds the element on the page matching that id
        if (target) { // only proceeds if a matching element was actually found
          e.preventDefault(); // stops the browser's default instant-jump behavior so we can control it manually
          const offset = 80; // number of pixels to leave clear above the target, so the fixed nav doesn't cover it
          const top = target.getBoundingClientRect().top + window.scrollY - offset; // calculates the exact scroll position needed
          window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' }); // scrolls there smoothly, or instantly if the user prefers reduced motion
          history.pushState(null, '', targetId); // updates the URL in the address bar to include the section's id, without reloading the page
        }
      }
    });
  });

  /* ---------- Active nav link highlighting ---------- */
  const navLinkEls = Array.from(document.querySelectorAll('.nav__link')); // gathers all nav link elements into a plain array, used by both approaches below

  if (currentPage === 'home') { // on the homepage, the active link should track which section is currently scrolled into view
    const sections = ['home', 'discover', 'experiences', 'destinations', 'culture', 'plan'] // lists the ids of every major section tracked by the nav
      .map(id => document.getElementById(id)) // converts each id string into the actual DOM element
      .filter(Boolean); // removes any entries that came back null (in case an id doesn't exist on the page)

    function setActiveLink() { // defines a function that figures out which section is currently in view
      let currentId = sections[0] ? sections[0].id : null; // defaults to the first section's id in case nothing else matches yet
      const scrollPos = window.scrollY + 140; // current scroll position plus an offset, so a section is considered "active" a bit before it reaches the very top

      sections.forEach(section => { // loops through every tracked section
        if (section.offsetTop <= scrollPos) currentId = section.id; // if the user has scrolled past this section's top, mark it as the current one
      });

      navLinkEls.forEach(link => { // loops through every nav link
        const isActive = link.getAttribute('href') === '#' + currentId; // checks whether this link points to the currently active section
        link.classList.toggle('is-active', isActive); // adds or removes the "active" styling class accordingly
      });
    }
    setActiveLink(); // runs once immediately so the correct link is highlighted on page load
    window.addEventListener('scroll', setActiveLink, { passive: true }); // re-checks which link should be active every time the user scrolls
  } else if (currentPage) { // on a standalone sub-page (experiences or accommodation), the active link never changes with scrolling
    navLinkEls.forEach(link => { // loops through every nav link once
      const isActive = link.getAttribute('data-page') === currentPage; // checks whether this link's data-page matches the current page
      link.classList.toggle('is-active', isActive); // marks that one link active and leaves the rest alone
    });
  }

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll('.reveal'); // selects every element marked with the "reveal" class (sections that should fade in)
  if ('IntersectionObserver' in window && !prefersReducedMotion) { // only use the fancy scroll animation if the browser supports it and the user hasn't asked for reduced motion
    const revealObserver = new IntersectionObserver((entries) => { // creates an observer that watches elements enter/leave the viewport
      entries.forEach(entry => { // loops through each element being watched
        if (entry.isIntersecting) { // checks if this element has scrolled into view
          entry.target.classList.add('is-visible'); // adds the class that triggers the CSS fade/slide-in transition
          revealObserver.unobserve(entry.target); // stops watching this element since it only needs to animate in once
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }); // triggers when 12% of the element is visible, with a small margin adjustment

    revealEls.forEach(el => revealObserver.observe(el)); // tells the observer to start watching each reveal element
  } else { // fallback for browsers without IntersectionObserver, or when reduced motion is preferred
    revealEls.forEach(el => el.classList.add('is-visible')); // simply shows all sections immediately without animating
  }

  /* ---------- FAQ accordion ---------- */
  const accordionTriggers = document.querySelectorAll('.accordion__trigger'); // selects every clickable FAQ question button
  accordionTriggers.forEach(trigger => { // loops through each question button
    trigger.addEventListener('click', () => { // listens for a click on this specific question
      const item = trigger.closest('.accordion__item'); // finds the enclosing FAQ item (question + answer pair)
      const panel = item.querySelector('.accordion__panel'); // finds this item's answer panel
      const isOpen = trigger.getAttribute('aria-expanded') === 'true'; // checks whether this question is currently expanded

      // close others for a clean single-open accordion
      accordionTriggers.forEach(other => { // loops through every question button again
        if (other !== trigger) { // skips the one that was just clicked
          other.setAttribute('aria-expanded', 'false'); // marks every other question as collapsed
          other.closest('.accordion__item').querySelector('.accordion__panel').hidden = true; // hides every other answer panel
        }
      });

      trigger.setAttribute('aria-expanded', String(!isOpen)); // flips this question's expanded state (true becomes false, false becomes true)
      panel.hidden = isOpen; // shows the panel if it was closed, or hides it if it was already open
    });
  });

  /* ---------- Plan Your Trip cards ---------- */
  const planDetails = { // an object storing the expanded title/body text for each of the six plan cards, keyed by their data-plan value
    'getting-there': { // entry for the "Getting There" card
      title: 'Getting There', // heading shown in the detail panel
      body: 'Madang is generally reached by domestic flight from major PNG hubs, with local road and boat transport available for onward travel around the province. Confirm current routes and schedules directly with airlines before booking.' // detail paragraph text
    },
    'where-to-stay': { // entry for the "Where to Stay" card
      title: 'Where to Stay', // heading text
      body: 'Accommodation ranges from beachfront resorts near Madang Town to smaller guesthouses, dive lodges and island-based stays. Availability and pricing vary by season, so check directly with providers.', // detail paragraph text
      link: 'accommodation.html#stay', linkText: 'See the full Accommodation & Food guide', // optional cross-page link rendered below the paragraph
      externalLink: 'https://www.madangresort.com/thingstodo', externalLinkText: 'Visit Madang Resort' // optional external reference link, rendered as a second button alongside the cross-page link
    },
    'things-to-do': { // entry for the "Things to Do" card
      title: 'Things to Do', // heading text
      body: 'Diving and snorkelling, island hopping, rainforest walks, fishing trips and cultural visits are commonly arranged through local operators and guesthouses once you arrive.', // detail paragraph text
      link: 'experiences.html', linkText: 'Browse all Experiences & Adventures' // optional cross-page link rendered below the paragraph
    },
    'best-time': { // entry for the "Best Time to Visit" card
      title: 'Best Time to Visit', // heading text
      body: 'Papua New Guinea has a tropical climate year-round. Conditions can vary seasonally, so it is worth checking current weather patterns and local advice as you plan your dates.' // detail paragraph text
    },
    'local-experiences': { // entry for the "Local Experiences" card
      title: 'Local Experiences', // heading text
      body: 'Community-run tours, homestays and village visits offer a closer look at daily life in Madang. Booking through local guides helps ensure your visit directly supports the community.' // detail paragraph text
    },
    'travel-tips': { // entry for the "Travel Tips" card
      title: 'Travel Tips', // heading text
      body: 'Check current visa requirements, travel advisories and health guidance from official sources before you travel, and reconfirm transport and accommodation bookings close to your departure date.' // detail paragraph text
    }
  }; // end of the planDetails lookup object

  const planCards = document.querySelectorAll('.plan-card'); // selects all six clickable plan card buttons
  const planDetail = document.getElementById('planDetail'); // selects the empty panel that will display the clicked card's details

  planCards.forEach(card => { // loops through each plan card
    card.addEventListener('click', () => { // listens for a click on this specific card
      const key = card.getAttribute('data-plan'); // reads the card's data-plan attribute (e.g. "getting-there")
      const data = planDetails[key]; // looks up the matching title/body text from the planDetails object
      const isAlreadyOpen = card.getAttribute('aria-expanded') === 'true'; // checks whether this card is already showing its details

      planCards.forEach(c => c.setAttribute('aria-expanded', 'false')); // resets every card to the "not expanded" state first

      if (isAlreadyOpen) { // if the clicked card was already open before this click
        planDetail.hidden = true; // hide the detail panel entirely (acts as a toggle-off)
        return; // stop here, skipping the code below that would reopen it
      }

      card.setAttribute('aria-expanded', 'true'); // marks this card as the currently expanded one
      const linkHtml = data.link ? `<a class="btn btn--outline-light" href="${data.link}">${data.linkText}</a>` : ''; // builds an optional CTA button if this entry has a cross-page link, otherwise an empty string
      const externalLinkHtml = data.externalLink ? `<a class="btn btn--outline-light" href="${data.externalLink}" target="_blank" rel="noopener noreferrer">${data.externalLinkText}</a>` : ''; // builds an optional second button for an external reference link, opened in a new tab since it leaves the site
      planDetail.innerHTML = `<h4>${data.title}</h4><p>${data.body}</p>${linkHtml}${externalLinkHtml}`; // fills the detail panel with this card's heading, paragraph, and any optional link buttons
      planDetail.hidden = false; // makes the detail panel visible
    });
  });

  /* ---------- Back to top ---------- */
  const backToTop = document.getElementById('backToTop'); // grabs the floating "back to top" button
  function toggleBackToTop() { // defines a function that shows/hides the button based on scroll position
    backToTop.classList.toggle('is-visible', window.scrollY > 600); // adds the visible class once the user has scrolled past 600px, removes it otherwise
  }
  toggleBackToTop(); // runs once immediately in case the page loads already scrolled down
  window.addEventListener('scroll', toggleBackToTop, { passive: true }); // re-checks visibility every time the user scrolls
  backToTop.addEventListener('click', () => { // listens for a click on the back-to-top button
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' }); // scrolls to the very top of the page, smoothly unless reduced motion is preferred
  });
}); // closes the DOMContentLoaded callback function
