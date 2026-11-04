# WebGrow360 — Website

A marketing site for **WebGrow360** (Branding · Advertising · Marketing). Plain HTML + pre-built Tailwind CSS + GSAP/Lenis (CDN), with one small PHP endpoint for the contact form. Live at https://webgrow360.online (Hostinger).

## Pages
- `index.html` — landing page (hero, services, reels, industry portfolio with rotate/stack scroll, analytics, clients, testimonials, process, tech stack, solutions, CTA). Includes **Soul Mode** (☯) — a full-screen "Narrative Canvas" experience.
- `about.html` — About: Our Story (map of India + Agartala pin, scroll timeline), Mission, Core Values bento, Why WebGrow360, stats tickers, Leadership cards, closing CTA. Includes Organization JSON-LD.
  - Behaviour lives in `components/about/` (`about.js` — plain JS effects; `leadership.js` — React + Framer Motion from esm.sh). Team data is the `TEAM` array in `leadership.js`.
  - It has its own pre-built Tailwind CSS (`assets/css/about.css`). After changing classes in `about.html` or `components/about/`, rebuild with:
    `npx tailwindcss@3.4.17 -c tailwind.config.js -i assets/css/tailwind.in.css -o assets/css/about.css --minify`
  - The map is generated from Datameet's open India state boundaries (official boundaries).
- `contact.html` — Contact page with the enquiry form (name, email, phone, service, message). Submissions go to `api/enquiry.php`, which validates them and saves them to MongoDB Atlas (database `DigitalMarketing_webgrow360-DB`, collection `Marketing_enqueries_webgrow360`). Service pages link to it with the service pre-selected, e.g. `contact.html?service=reels`.
- Service pages, linked from the four "What we do" cards on the home page:
  `brand-identity.html`, `reels.html`, `campaign-design.html`, `performance-marketing.html`.
  Each has a hero, deliverables, image grid, process, "built for", FAQ, next-service link and CTA.

## Styling, fonts and icons
- All other pages share pre-built Tailwind CSS in `assets/css/site.css` (no Tailwind CDN). After changing classes in those pages, rebuild and bump the `?v=` on the `<link>` (assets are cached for a year):
  `npx tailwindcss@3.4.17 -c tailwind.site.config.js -i assets/css/tailwind.in.css -o assets/css/site.css --minify`
- Fonts are self-hosted in `assets/fonts/` (declared in `assets/css/fonts.css`); the tech-stack logos are local SVGs in `assets/icons/`.

## Contact form backend (MongoDB)
- `api/enquiry.php` needs the PHP **mongodb** extension (hPanel → Advanced → PHP Configuration → Extensions) and `api/config.php` with the Atlas credentials. Copy `api/config.example.php` to `api/config.php` and fill it in. `api/config.php` is git-ignored and blocked from the web by `api/.htaccess`; never commit it.
- The MongoDB Atlas Network Access list must allow the Hostinger server.

## Assets
- `assets/webgrow360-mark.webp` — WebGrow360 brand mark (same as realestate.webgrow360.online); also the favicon. The "WEBGROW360 / ONLINE" wordmark is live text, so it adapts to light and soul mode.

- `assets/services/` — service page images (`<page>-1.webp` hero, `-2`/`-3` grid). Stock photos from Unsplash (free to use under the Unsplash License); swap any file for a generated image by keeping the same name.

## Run locally
Open `index.html` in a browser, or serve the folder:
```bash
python3 -m http.server 3000
# http://localhost:3000
```

## Deploy (Hostinger)
The site is hosted on Hostinger shared hosting (`webgrow360.online`). Upload the site files (everything except `README.md`, `netlify.toml`, `tailwind*.config.js` and the raw videos in `assets/services/*.mp4`), and make sure `api/config.php` is on the server. `.htaccess` gives clean URLs (`/about`), redirects www to the bare domain, and sets cache headers. `robots.txt` and `sitemap.xml` are at the root.

The PHP form endpoint does not run on the python dev server above, so test the form on the live site.

## Contact
Connect@team.webgrow360.online · +91 89743 32863
