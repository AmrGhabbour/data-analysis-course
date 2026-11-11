# Data Analysis Course: landing page

A complete landing page in Arabic (right-to-left). It is built from three plain files and needs no frameworks, no build step and no server code.

```
Landing_Page/
├── index.html      ← all page text (sections, curriculum, FAQ)
├── style.css       ← colours, fonts, layout (desktop / tablet / mobile)
├── script.js       ← ★ SETTINGS: WhatsApp number, message, price, start date ★
├── assets/img/     ← photos (WebP + JPG fallback), favicon, social-share image
├── preview/        ← screenshots of the finished page (desktop + mobile)
└── README.md
```

## How to view the page on your computer
Double-click `index.html` to open it in Chrome or Edge. Everything works offline except the Google Fonts (Cairo + Inter); without internet the page falls back to the system font.

---

## 1. Change the WhatsApp number, message, price or start date
Open `script.js` in any text editor (Notepad works; **VS Code** is easier). The settings are at the very top:

```js
const CONFIG = {
  whatsappNumber: "96569651179",
  whatsappMessage: "مرحباً أستاذ عمرو، مهتم بالانضمام إلى كورس تحليل البيانات، وأريد معرفة تفاصيل التسجيل.",
  price: "7,500",
  currencyAr: "جنيه مصري",
  currencyEn: "EGP",
  startDate: "15 ديسمبر 2026",
  startDateEn: "15 December 2026"
};
```

- **WhatsApp number:** use the international format with **digits only**: country code + number, with no `+`, no spaces and no leading zero. Egypt example: `201001234567`. Every WhatsApp button on the page (header, hero, instructor, pricing, final section, footer, floating button, mobile bar) updates automatically. The message is URL-encoded for you.
- **Price / start date:** change the text between the quotes. Every place on the page that shows the price or the date updates automatically.
- Save the file and refresh the browser.

**Two optional extra places** (they don't affect the visitor, but keep them in sync):
- The search-engine data near the top of `index.html` (`"price": "7500"` and `"startDate": "2026-12-15"`, inside `<script type="application/ld+json">`) and the page `description` line.
- Every WhatsApp `href="https://wa.me/96569651179"` in `index.html` is only a fallback for browsers with JavaScript switched off. You can search-and-replace the number there too.

## 2. Edit the curriculum
In `index.html`, find the comment `CURRICULUM ACCORDION`. Each module is one block:

```html
<details class="mod">
  <summary> … <b>Module name (English)</b><span>Arabic tagline</span> … <span class="les">10 lessons</span> … </summary>
  <div class="body">
    … الموديول ده عن إيه؟ → <p>description</p>
    … هتطلع منه قادر على → <ul><li>outcome</li>…</ul>
    … الأدوات → <span class="chip en">Tool</span>…
    … الدروس → <ul class="topics"><li>Lesson title</li>…</ul>
    <div class="proj"><b>مشروع الموديول:</b> mini-project text</div>
  </div>
</details>
```

- To **change text**, edit the words between the tags and leave the tags themselves alone.
- To **add a lesson**, copy one `<li>…</li>` line inside `<ul class="topics">`.
- To **add a module**, copy one whole `<details class="mod"> … </details>` block.
- The first module opens by default (`<details class="mod" open>`); remove `open` to start it closed.
- English inside Arabic text: wrap it in `<span class="en">…</span>` if punctuation ends up on the wrong side (for example `1M+`).

FAQ entries work the same way: in the `id="faq"` section, each `<details><summary>Question</summary><div class="a"><p>Answer</p></div></details>` block is one question.

## 3. Replace the photos
Replace the files in `assets/img/` and **keep the same file names**. Each photo has a `.webp` (small and fast) and a `.jpg` (fallback), so replace both:

| File | Used in | Size |
|---|---|---|
| `amr-hero` | first section | 760 × 845 |
| `amr-about` | "About the instructor" | 520 × 825 |
| `amr-avatar` | final section (circle) | 240 × 240 |
| `og-cover.jpg` | preview image when the link is shared on WhatsApp/Facebook | 1200 × 630 |

The free tool https://squoosh.app converts a photo to WebP.

## 4. Publish free with GitHub Pages
1. Create a free account at https://github.com and sign in.
2. Click **+ → New repository**. Name it, for example, `data-analysis-course`, select **Public**, then click **Create repository**.
3. On the new repository page, click **uploading an existing file**. Drag in **the contents** of the `Landing_Page` folder (`index.html`, `style.css`, `script.js`, the `assets` folder, and optionally `preview` and `README.md`), not the folder itself. Then click **Commit changes**.
4. Go to **Settings → Pages**. Under **Build and deployment → Source**, choose **Deploy from a branch**, then select **Branch: `main`** and **folder `/ (root)`**, and click **Save**.
5. After 1–2 minutes the page is live at `https://YOUR-USERNAME.github.io/data-analysis-course/` (the link appears at the top of the Pages settings).
6. **To update later:** open the file on GitHub, click the ✏️ pencil, edit, then **Commit changes**. Or upload the changed file again. The site refreshes within a minute or two.
7. **Social preview image:** after publishing, open `index.html` and replace `content="assets/img/og-cover.jpg"` with the full URL, for example `https://YOUR-USERNAME.github.io/data-analysis-course/assets/img/og-cover.jpg`. WhatsApp and Facebook need the full address to show the image.
8. **Custom domain (optional):** in **Settings → Pages → Custom domain**, enter your domain and follow GitHub's DNS instructions.

## 5. Google Analytics 4 + Google Tag Manager (`G-MVC9TPSBH3`, `GTM-W5QJJRKM`)
**Where it is installed:** at the very top of `<head>` in `index.html` there are two Google scripts sharing one `dataLayer`:
- **Google Tag Manager** `GTM-W5QJJRKM`: your container, ready for any tags you add later in GTM.
- **Google Analytics 4** `G-MVC9TPSBH3`: sends `page_view` and the events below directly.

Why both: your GTM container doesn't contain a GA4 tag yet, and with the GTM snippet alone **nothing reached GA4** (tested). Each ID is loaded only once, so nothing is double-counted. Tested: one `page_view` per visit.

⚠️ **Do not add a "Google tag" or "GA4 Event" tag for `G-MVC9TPSBH3` inside GTM.** GA4 already receives everything directly, so every visit and click would be counted twice.

To change an ID, replace it everywhere it appears in that `<head>` block (the GA4 ID appears twice). The event code lives in `script.js`, section 3.

**For GTM:** every event below is also pushed to the `dataLayer` as a Custom Event with the prefix `lp_` (`lp_whatsapp_click`, `lp_generate_lead`, `lp_curriculum_module_toggle`, …), with the same parameters as Data Layer Variables. Use these as triggers for non-GA4 tags, for example a Meta Pixel "Lead" on `lp_generate_lead`.

**Events sent** (each from one listener, so nothing is counted twice):

| Event | When | Parameters |
|---|---|---|
| `page_view` | every page load (automatic) | standard |
| `whatsapp_click` | **any** WhatsApp button | `cta_location` (header, hero, instructor, pricing, final, footer, floating, mobile-bar), `cta_type` (`enroll` / `contact`), `link_url` |
| `generate_lead` | **enrollment** buttons only ("احجز مكانك…": header, hero, pricing, final, mobile-bar) | `cta_location`, `value` (the price from CONFIG), `currency` |
| `curriculum_view` | the curriculum section reaches the middle of the screen (once per visit to the page) | none |
| `curriculum_link_click` | "المنهج" in the menu or "اكتشف تفاصيل الكورس" | `cta_location` (header-nav / hero-details) |
| `curriculum_module_toggle` | a visitor opens or closes a module | `module_number`, `module_name`, `action` (open / close) |
| `curriculum_toggle_all` | "افتح / اقفل كل الموديولات" | `action` (open_all / close_all) |

An enrollment-button click sends `whatsapp_click` **and** `generate_lead` on purpose: the first counts all WhatsApp clicks, and the second counts enrollment intent only. They are two different events, not a duplicate. Repeated clicks on the same button within 1 second (double taps) are counted once.

**One-time setup in GA4** (Admin, at analytics.google.com):
1. **Admin → Events:** after the first real visits, `generate_lead` appears. Toggle **Mark as key event** so enrollment clicks show up as conversions.
2. **Admin → Custom definitions → Create custom dimension** (scope **Event**) for `cta_location`, `cta_type`, `module_name` and `action`, so they appear in reports. Data shows from the moment each one is created.
3. **Admin → Data streams → your stream → Configure tag settings → Define internal traffic**, then add a **Data filter** if you want to exclude your own visits.

**How to check it is working:** open the page with `?debug_ga=1` at the end of the address (for example `https://YOUR-USERNAME.github.io/data-analysis-course/?debug_ga=1`), then open **GA4 → Admin → DebugView**. Click the buttons and open modules, and the events appear within seconds. Normal reports take up to 24–48 hours to fill.

**Single place for events:** `trackEvent(name, params)` in `script.js` sends every event to GA4 and the GTM dataLayer.

## 6. What was tested (11 Nov 2026)
- **Desktop 1440 px, tablet 768 px, mobile 375 px:** no horizontal scrolling. Right-to-left layout is correct, and English terms keep their reading order.
- **All 8 WhatsApp buttons** open `https://wa.me/96569651179?text=…` with the exact pre-filled Arabic message (checked by decoding it), in a new tab.
- **Navigation:** the menu links scroll to their sections, and the mobile menu opens, closes, and closes itself after a link is tapped.
- **Interactive parts:** each curriculum module opens and closes, "open all / close all" works, and the FAQ items open and close.
- **Mobile layout:** the sticky bar (price + date + WhatsApp) appears and the floating button is hidden, so they don't overlap.
- **Google Analytics 4 + GTM:** both load; exactly one `page_view` reaches G-MVC9TPSBH3, and the `lp_` events appear in the dataLayer for GTM. On desktop and mobile (375 px), every event in section 5 fires once with the right parameters, including real taps on a module and on the mobile sticky bar. A double click is counted once, and "open all" does not also fire 8 module events.

## 7. Content rules followed
- Curriculum, mini-projects, graduation project, schedule, tools, FAQ answers and the "not suitable if…" section come from the course prospectus.
- Weekly individual follow-up, assignment review, mock interview, price, start date and payment methods come from your brief.
- The page has no testimonials, no student counts, no countdowns or "limited seats", and no installment plans. It makes no job promise; the FAQ says so explicitly.
- The course company is not named; it is described as fictional.
- The instructor section uses your name, your title, 5 years of experience in Data Analytics (as you supplied) and the course's approach. It names no employers or degrees.
- The "Revenue −12%" dashboard in the Business section is labelled as illustrative numbers.
