# DevMediaWorx website

Static multi-page site. Upload the whole folder to any hosting (cPanel, Netlify, Vercel, Hostinger). No build step.

## Pages
| File | Page |
|---|---|
| index.html | Home |
| services.html | Services (tabs on desktop, accordion on mobile; deep links like `services.html#video`) |
| work.html | Portfolio with filters |
| process.html | Five-stage process |
| why-us.html | Why us |
| contact.html | Contact form, channels, location and map |

## Where to edit what
| What | File |
|---|---|
| WhatsApp, phone, email, address, hours, map, social links, tracking IDs, form destination | `assets/js/config.js` |
| Header, menu, footer, floating buttons (shared by all pages) | `assets/js/layout.js` |
| All styling (colors, fonts, spacing) | `assets/css/style.css` (tokens at the top) |
| Tabs, carousel, filters, FAQ, form logic | `assets/js/main.js` |
| Animations (data-anim system, curtain, cursor, particles) | `assets/js/motion.js` |
| GTM, GA4, Meta Pixel, Google Ads, TikTok, consent banner, UTM capture | `assets/js/tracking.js` (event list at the top) |
| Page text | each `.html` file |

## Before going live
1. Fill the tracking IDs in `config.js` (each tag loads only when its ID is set).
2. Replace placeholder images: search the HTML for `images.unsplash.com` and `PLACEHOLDER IMAGE`. Put your files in `assets/img/` and change the `--img:url(...)`.
3. Add `assets/img/og-image.jpg` (1200×630) for link previews.
4. Confirm the address, hours and map pin in `config.js`.
5. Optional: to receive the form by email, set `form.mode: 'endpoint'` and paste a Formspree (or similar) URL.

## Libraries (in `assets/vendor/`, no CDN needed)
GSAP 3.15 (ScrollTrigger, SplitText, CustomEase, Observer), Lenis 1.3, Swiper 14, flag-icons (country flags).

## Animations
Add `data-anim="rise"` (or chars, words, lines, flip, stagger, count, draw, wipe, scale, line) to any element. Optional `data-delay` and `data-dur`.
