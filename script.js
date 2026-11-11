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

  /* ---------- 3. Click tracking ----------
     Every WhatsApp button has data-wa="where-it-is" (hero, pricing, final…).
     Each click is logged to the browser console and, if you later add
     Google Analytics / Google Tag Manager / Meta Pixel, sent there too. */
  function trackEvent(name, params) {
    params = params || {};
    try {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(Object.assign({ event: name }, params));       // Google Tag Manager
      if (typeof window.gtag === "function") window.gtag("event", name, params); // Google Analytics 4
      if (typeof window.fbq === "function") window.fbq("track", "Contact", params); // Meta Pixel
    } catch (e) { /* tracking must never break the button */ }
    if (window.console && console.info) console.info("[track]", name, params);
  }
  window.trackEvent = trackEvent;

  document.addEventListener("click", function (e) {
    const a = e.target.closest ? e.target.closest("[data-wa]") : null;
    if (!a) return;
    trackEvent("whatsapp_click", { cta_location: a.getAttribute("data-wa") || "unknown" });
  });

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
