/* =====================================================================
   Data Analysis Course · Landing page script
   ---------------------------------------------------------------------
   ★ EDIT YOUR SETTINGS HERE (one place for the whole page) ★
   - whatsappNumber : international format, digits only (no +, no spaces)
   - whatsappMessage: the message that appears pre-written in WhatsApp
   - price          : shown everywhere the page says the price
   - startDate      : shown everywhere the page says the start date
   ===================================================================== */
const CONFIG = {
  whatsappNumber: "96569651179",
  whatsappMessage: "مرحباً أستاذ عمرو، مهتم بالانضمام إلى كورس تحليل البيانات، وأريد معرفة تفاصيل التسجيل.",
  price: "7,500",
  currencyAr: "جنيه مصري",
  currencyEn: "EGP",
  startDate: "15 ديسمبر 2026",
  startDateEn: "15 December 2026"
};
/* ===================================================================== */

(function () {
  "use strict";
  document.documentElement.classList.remove("no-js");

  /* ---------- 1. WhatsApp link (built once from CONFIG) ---------- */
  const digits = String(CONFIG.whatsappNumber).replace(/\D/g, "");
  const WA_URL = "https://wa.me/" + digits + "?text=" + encodeURIComponent(CONFIG.whatsappMessage);

  document.querySelectorAll("[data-wa]").forEach(function (a) {
    a.setAttribute("href", WA_URL);
    a.setAttribute("target", "_blank");
    a.setAttribute("rel", "noopener noreferrer");
  });

  /* ---------- 2. Price and start date (filled from CONFIG) ---------- */
  const fill = function (sel, val) {
    document.querySelectorAll(sel).forEach(function (el) { el.textContent = val; });
  };
  fill("[data-price]", CONFIG.price);
  fill("[data-currency]", CONFIG.currencyAr);
  fill("[data-currency-en]", CONFIG.currencyEn);
  fill("[data-start]", CONFIG.startDate);
  fill("[data-start-en]", CONFIG.startDateEn);
  fill("[data-wa-number]", "+" + digits);
  fill("[data-year]", String(new Date().getFullYear()));

  /* ---------- 3. Google Analytics 4 tracking ----------
     The Google tag itself is installed in the <head> of index.html (page_view is automatic).
     Events sent from here (one listener each, so nothing is counted twice):
       whatsapp_click            every WhatsApp button      cta_location, cta_type (enroll | contact)
       generate_lead             enrollment buttons only    cta_location, value, currency
       curriculum_view           curriculum section reaches mid-screen (once per page load)
       curriculum_link_click     "المنهج" / "اكتشف تفاصيل الكورس"  cta_location
       curriculum_module_toggle  a module opened/closed     module_number, module_name, action
       curriculum_toggle_all     "open all / close all"     action
     Labels come from the HTML: data-wa="where", data-cta="enroll|contact", data-track="where". */
  const DEBUG = /[?&]debug_ga=1/.test(location.search);
  const lastSent = {};
  function trackEvent(name, params) {
    params = params || {};
    // De-duplicate: ignore the same event from the same place within 1 second (double taps / double clicks).
    const key = name + "|" + (params.cta_location || params.module_number || params.action || "");
    const now = Date.now();
    if (lastSent[key] && now - lastSent[key] < 1000) return;
    lastSent[key] = now;
    try {
      // GA4: sent directly (counted once in GA4)
      if (typeof window.gtag === "function") {
        window.gtag("event", name, Object.assign({ transport_type: "beacon" }, params));
      }
      // GTM: the same event as a dataLayer "Custom Event" (prefixed lp_), so tags you add later in
      // Google Tag Manager (e.g. Meta Pixel) can use it. It is NOT sent to GA4 a second time.
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(Object.assign({ event: "lp_" + name }, params));
    } catch (e) { /* tracking must never break the page */ }
    if (DEBUG && window.console) console.info("[GA4]", name, params);
  }
  window.trackEvent = trackEvent;

  const PRICE_VALUE = Number(String(CONFIG.price).replace(/[^\d.]/g, "")) || undefined;

  // WhatsApp buttons + enrollment CTAs (one delegated listener; works for mouse, touch and keyboard)
  document.addEventListener("click", function (e) {
    if (!e.target.closest) return;
    const wa = e.target.closest("[data-wa]");
    if (wa) {
      const where = wa.getAttribute("data-wa") || "unknown";
      const type = wa.getAttribute("data-cta") || "contact";
      trackEvent("whatsapp_click", { cta_location: where, cta_type: type, link_url: wa.href });
      if (type === "enroll") {
        trackEvent("generate_lead", { cta_location: where, value: PRICE_VALUE, currency: CONFIG.currencyEn });
      }
      return;
    }
    const link = e.target.closest('a[href="#curriculum"]');
    if (link) {
      trackEvent("curriculum_link_click", { cta_location: link.getAttribute("data-track") || "link" });
    }
  });

  // Curriculum: a module opened or closed by the visitor (clicks on the module header only,
  // so "open all / close all" below does not also fire 8 module events)
  document.querySelectorAll(".acc details > summary").forEach(function (s, i) {
    s.addEventListener("click", function () {
      const d = s.parentElement;
      const nameEl = s.querySelector(".ttl b");
      trackEvent("curriculum_module_toggle", {
        module_number: i + 1,
        module_name: nameEl ? nameEl.textContent.trim() : "",
        action: d.open ? "close" : "open"        // state before the browser toggles it
      });
    });
  });

  // Curriculum: section seen (once per page load)
  const curr = document.getElementById("curriculum");
  if (curr && "IntersectionObserver" in window) {
    const cio = new IntersectionObserver(function (entries) {
      if (entries.some(function (en) { return en.isIntersecting; })) {
        trackEvent("curriculum_view", {});
        cio.disconnect();
      }
    }, { rootMargin: "-45% 0px -45% 0px", threshold: 0 });   // fires when the section reaches the middle of the screen (works for any section height)
    cio.observe(curr);
  }

  /* ---------- 4. Mobile menu ---------- */
  const menuBtn = document.querySelector(".menu-btn");
  const nav = document.getElementById("site-nav");
  if (menuBtn && nav) {
    const setOpen = function (open) {
      nav.classList.toggle("open", open);
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
      menuBtn.setAttribute("aria-label", open ? "إغلاق القائمة" : "فتح القائمة");
    };
    menuBtn.addEventListener("click", function () { setOpen(!nav.classList.contains("open")); });
    nav.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", function () { setOpen(false); }); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setOpen(false); });
  }

  /* ---------- 5. Curriculum: "open all / close all" ---------- */
  const toggleAll = document.getElementById("toggle-all");
  if (toggleAll) {
    toggleAll.addEventListener("click", function () {
      const mods = document.querySelectorAll(".acc details");
      const anyClosed = Array.prototype.some.call(mods, function (d) { return !d.open; });
      mods.forEach(function (d) { d.open = anyClosed; });
      toggleAll.textContent = anyClosed ? "اقفل كل الموديولات" : "افتح كل الموديولات";
      toggleAll.setAttribute("aria-pressed", anyClosed ? "true" : "false");
      trackEvent("curriculum_toggle_all", { action: anyClosed ? "open_all" : "close_all" });
    });
  }

  /* ---------- 6. Gentle reveal on scroll (skipped if reduced motion) ---------- */
  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const items = document.querySelectorAll(".reveal");
  if (reduce || !("IntersectionObserver" in window)) {
    items.forEach(function (el) { el.classList.add("in"); });
  } else {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -40px 0px", threshold: 0.01 });
    items.forEach(function (el) { io.observe(el); });
  }
})();
