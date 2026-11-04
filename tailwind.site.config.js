// Pre-builds the Tailwind CSS shared by every page except About (assets/css/site.css),
// replacing the render-blocking Tailwind CDN script. Rebuild after changing classes:
//   npx tailwindcss@3.4.17 -c tailwind.site.config.js -i assets/css/tailwind.in.css -o assets/css/site.css --minify
// then bump the ?v= on the <link> in each page (assets are cached for a year).
module.exports = {
  content: [
    "./index.html", "./contact.html", "./brand-identity.html", "./reels.html",
    "./campaign-design.html", "./performance-marketing.html", "./assets/js/**/*.js",
  ],
  theme: { extend: { fontFamily: {
    display: ["Space Grotesk", "sans-serif"], body: ["Inter", "sans-serif"], serif: ["Cormorant Garamond", "serif"], mono: ["JetBrains Mono", "monospace"],
  } } },
};
