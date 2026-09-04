/* FCC BRONX — shared behaviour for all variations.
   Progressive enhancement only; every page works with this file removed. */

(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ---------------------------------------------------------------------
     Mobile navigation toggle
     Markup contract:
       <button class="nav-toggle" aria-controls="site-nav" aria-expanded="false">
       <nav id="site-nav">
     --------------------------------------------------------------------- */
  function initNav() {
    const toggle = document.querySelector(".nav-toggle");
    const nav = toggle && document.getElementById(toggle.getAttribute("aria-controls"));
    if (!toggle || !nav) return;

    const setOpen = (open) => {
      toggle.setAttribute("aria-expanded", String(open));
      nav.classList.toggle("is-open", open);
      document.body.classList.toggle("nav-open", open);
      const label = toggle.querySelector("[data-label]");
      if (label) label.textContent = open ? "Close" : "Menu";
    };

    toggle.addEventListener("click", () => {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    nav.addEventListener("click", (e) => {
      if (e.target.closest("a")) setOpen(false);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        toggle.focus();
      }
    });
  }

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
     Fill <time data-year> and any [data-year] with the current year
     --------------------------------------------------------------------- */
  function initYear() {
    const year = String(new Date().getFullYear());
    document.querySelectorAll("[data-year]").forEach((el) => {
      el.textContent = year;
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initNav();
    initReveal();
    initMarquee();
    initHeaderState();
    initYear();
  });
})();
