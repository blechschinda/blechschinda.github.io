// Blechschinda – small progressive enhancements. The site works without JS.
(function () {
  "use strict";

  // Header shadow once the page is scrolled
  var header = document.querySelector("[data-header]");
  if (header) {
    var onScroll = function () { header.classList.toggle("is-scrolled", window.scrollY > 8); };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // Mobile menu
  var toggle = document.querySelector("[data-nav-toggle]");
  var nav = document.querySelector("[data-nav]");
  if (toggle && nav) {
    var setOpen = function (open) {
      toggle.setAttribute("aria-expanded", String(open));
      nav.classList.toggle("is-open", open);
    };
    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });
    // Close after choosing a link (needed for in-page anchors) or pressing Escape
    nav.addEventListener("click", function (e) { if (e.target.closest("a")) setOpen(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setOpen(false); });
  }

  // Über uns: Hochdeutsch / Boarisch switch
  var langButtons = document.querySelectorAll("[data-lang]");
  langButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var lang = btn.getAttribute("data-lang");
      langButtons.forEach(function (b) { b.setAttribute("aria-pressed", String(b === btn)); });
      document.querySelectorAll("[data-lang-text]").forEach(function (el) {
        el.hidden = el.getAttribute("data-lang-text") !== lang;
      });
    });
  });

  // Auftritte: mark past gigs and the next upcoming one (based on today's date in the browser)
  var gigs = document.querySelectorAll("[data-gigs] [data-date]");
  if (gigs.length) {
    var now = new Date();
    var today = now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0") + "-" + String(now.getDate()).padStart(2, "0");
    var nextFound = false;
    gigs.forEach(function (gig) {
      var status = gig.querySelector("[data-gig-status]");
      var date = gig.getAttribute("data-date");
      if (date < today) {
        gig.classList.add("is-past");
        if (status) status.textContent = "Vorbei";
      } else if (!nextFound) {
        nextFound = true;
        gig.classList.add("is-next");
        if (status) status.textContent = date === today ? "Heute" : "Als Nächstes";
      }
    });
    var done = document.querySelector("[data-gigs-done]");
    if (done && !nextFound) done.hidden = false;
  }

  // Galerie: lightbox
  var gallery = document.querySelector("[data-gallery]");
  var box = document.querySelector("[data-lightbox]");
  if (gallery && box && typeof box.showModal === "function") {
    var items = Array.prototype.slice.call(gallery.querySelectorAll(".gallery-item"));
    var img = box.querySelector("[data-lightbox-img]");
    var count = box.querySelector("[data-lightbox-count]");
    var current = 0;

    var show = function (i) {
      current = (i + items.length) % items.length;
      var item = items[current];
      img.src = item.getAttribute("href");
      img.alt = item.querySelector("img").alt;
      count.textContent = (current + 1) + " / " + items.length;
    };

    gallery.addEventListener("click", function (e) {
      var item = e.target.closest(".gallery-item");
      if (!item) return;
      e.preventDefault();
      show(items.indexOf(item));
      box.showModal();
    });
    box.querySelector("[data-lightbox-close]").addEventListener("click", function () { box.close(); });
    box.querySelector("[data-lightbox-prev]").addEventListener("click", function () { show(current - 1); });
    box.querySelector("[data-lightbox-next]").addEventListener("click", function () { show(current + 1); });
    // Click on the dark area closes
    box.addEventListener("click", function (e) { if (e.target === box) box.close(); });
    box.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") show(current - 1);
      if (e.key === "ArrowRight") show(current + 1);
    });
    // Swipe on touch screens
    var startX = null;
    box.addEventListener("touchstart", function (e) { startX = e.touches[0].clientX; }, { passive: true });
    box.addEventListener("touchend", function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
      startX = null;
    });
    box.addEventListener("close", function () { img.removeAttribute("src"); });
  }

  // Gentle fade-in of cards while scrolling
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var targets = document.querySelectorAll(".musician, .gig, .about-media, .about-text, .gallery li, .contact-list li");
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          el.classList.add("is-visible");
          io.unobserve(el);
          // Drop the helper classes afterwards so hover effects work normally
          setTimeout(function () { el.classList.remove("reveal", "is-visible"); }, 700);
        }
      });
    }, { rootMargin: "0px 0px -40px 0px" });
    targets.forEach(function (el) { el.classList.add("reveal"); io.observe(el); });
  }
})();
