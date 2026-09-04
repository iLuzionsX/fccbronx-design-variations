/* FCC BRONX — shared behaviour for all variations.
   Progressive enhancement only; every page works with this file removed.
   Navigation is always visible (no hamburger), so there is no menu logic here. */

(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ---------------------------------------------------------------------
     Scroll reveal for elements with .reveal
     --------------------------------------------------------------------- */
  function initReveal() {
    const items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
    );

    items.forEach((el) => io.observe(el));
  }

  /* ---------------------------------------------------------------------
     Marquee: duplicate the track content once so the -50% translate loops
     seamlessly regardless of viewport width.
     --------------------------------------------------------------------- */
  function initMarquee() {
    document.querySelectorAll(".marquee__track").forEach((track) => {
      if (track.dataset.cloned) return;
      track.insertAdjacentHTML("beforeend", track.innerHTML);
      track.dataset.cloned = "true";
      track.setAttribute("aria-hidden", "true");
    });
  }

  /* ---------------------------------------------------------------------
     Header shadow / compact state once the page is scrolled
     --------------------------------------------------------------------- */
  function initHeaderState() {
    const header = document.querySelector(".site-header");
    if (!header) return;
    const update = () => header.classList.toggle("is-scrolled", window.scrollY > 24);
    update();
    window.addEventListener("scroll", update, { passive: true });
  }

  /* ---------------------------------------------------------------------
     Fill any [data-year] with the current year
     --------------------------------------------------------------------- */
  function initYear() {
    const year = String(new Date().getFullYear());
    document.querySelectorAll("[data-year]").forEach((el) => {
      el.textContent = year;
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initReveal();
    initMarquee();
    initHeaderState();
    initYear();
  });
})();
