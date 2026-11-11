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

## 5. Click tracking
Every WhatsApp button carries a label (`data-wa="hero"`, `"pricing"`, `"final"`, `"mobile-bar"`, …). Each click calls `trackEvent("whatsapp_click", { cta_location: … })`, which:
- logs the click in the browser console (F12 → Console);
- sends it to **Google Tag Manager / GA4** (`dataLayer` / `gtag`) and the **Meta Pixel** (`fbq`) automatically, **if** you add their code snippets to `index.html` later. Nothing is sent anywhere until you do.

## 6. What was tested (11 Nov 2026)
- **Desktop 1440 px, tablet 768 px, mobile 375 px:** no horizontal scrolling. Right-to-left layout is correct, and English terms keep their reading order.
- **All 8 WhatsApp buttons** open `https://wa.me/96569651179?text=…` with the exact pre-filled Arabic message (checked by decoding it), in a new tab.
- **Navigation:** the menu links scroll to their sections, and the mobile menu opens, closes, and closes itself after a link is tapped.
- **Interactive parts:** each curriculum module opens and closes, "open all / close all" works, and the FAQ items open and close.
- **Mobile layout:** the sticky bar (price + date + WhatsApp) appears and the floating button is hidden, so they don't overlap.
- **Click tracking:** logs `whatsapp_click` with the right location.

## 7. Content rules followed
- Curriculum, mini-projects, graduation project, schedule, tools, FAQ answers and the "not suitable if…" section come from the course prospectus.
- Weekly individual follow-up, assignment review, mock interview, price, start date and payment methods come from your brief.
- The page has no testimonials, no student counts, no countdowns or "limited seats", and no installment plans. It makes no job promise; the FAQ says so explicitly.
- The course company is not named; it is described as fictional.
- The instructor section uses your name, your title, 5 years of experience in Data Analytics (as you supplied) and the course's approach. It names no employers or degrees.
- The "Revenue −12%" dashboard in the Business section is labelled as illustrative numbers.
