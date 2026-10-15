/* =====================================================================
   DevMediaWorx — SHARED LAYOUT
   Header, mobile menu, footer, floating buttons and background are
   written once here and injected into every page.
   To add or rename a page, edit NAV below.
   ===================================================================== */
(function () {
  var C = window.CONFIG;
  var NAV = [
    { href: 'index.html',    label: 'Home' },
    { href: 'services.html', label: 'Services' },
    { href: 'work.html',     label: 'Work' },
    { href: 'process.html',  label: 'Process' },
    { href: 'why-us.html',   label: 'Why us' },
    { href: 'contact.html',  label: 'Contact' }
  ];
  var current = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  if (current === '' || current.indexOf('.') === -1) current = 'index.html';

  var ICONS = {
    wa: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.4-.5c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.2-.3-.3-.6-.4zM12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2z"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>',
    facebook: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 8h3V4h-3c-2.8 0-4 1.7-4 4.2V10H7v4h3v8h4v-8h3l1-4h-4V8.6c0-.4.3-.6.6-.6z"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.5 3.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM3 9h3v12H3zM9 9h3v1.7c.5-.9 1.7-1.9 3.6-1.9 3.4 0 4.4 2.1 4.4 5.2V21h-3v-6.3c0-1.6-.3-3-2.1-3s-2.4 1.3-2.4 3V21H9z"/></svg>',
    tiktok: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 3c.3 2.2 1.6 3.6 3.8 3.8v3.1c-1.4.1-2.7-.3-3.8-1v6.2c0 3.6-2.9 5.9-6 5.9a5.9 5.9 0 0 1-1-11.7v3.2a2.7 2.7 0 1 0 1.9 2.6V3z"/></svg>',
    youtube: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 8.2a3 3 0 0 0-2.1-2.1C18 5.6 12 5.6 12 5.6s-6 0-7.9.5A3 3 0 0 0 2 8.2 31 31 0 0 0 1.6 12c0 1.3.1 2.5.4 3.8a3 3 0 0 0 2.1 2.1c1.9.5 7.9.5 7.9.5s6 0 7.9-.5a3 3 0 0 0 2.1-2.1c.3-1.3.4-2.5.4-3.8s-.1-2.5-.4-3.8zM10 15V9l5.2 3z"/></svg>',
    behance: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8.5 11.2c1.2-.5 1.8-1.4 1.8-2.6C10.3 6.3 8.6 5.5 6.6 5.5H1v13h5.8c2.2 0 4.2-1.1 4.2-3.5 0-1.5-.8-2.5-2.5-2.8zM3.7 7.7h2.4c.9 0 1.7.3 1.7 1.3s-.6 1.4-1.6 1.4H3.7zm2.6 8.5H3.7v-3.5h2.7c1.1 0 1.8.5 1.8 1.7s-.8 1.8-1.9 1.8zM17.6 8.7c-3 0-4.9 2.1-4.9 4.9 0 2.9 1.8 4.9 4.9 4.9 2.3 0 3.8-1 4.5-3.2h-2.3c-.2.8-1.3 1.2-2.1 1.2-1.5 0-2.4-.9-2.4-2.4h7c.2-3-1.4-5.4-4.7-5.4zm-2.3 4c.1-1.2.9-2 2.2-2s1.9.8 2 2zM15 6h5.2v1.4H15z"/></svg>'
  };
  window.DMW = window.DMW || {};
  window.DMW.icons = ICONS;

  function wa(msg) {
    var src = window.DMW.sourceLabel ? window.DMW.sourceLabel() : '';
    var text = msg + (src ? '\n\n(Source: ' + src + ')' : '');
    return 'https://wa.me/' + C.contact.whatsapp + '?text=' + encodeURIComponent(text);
  }
  window.DMW.waLink = wa;

  var brand = '<a class="brand" href="index.html" aria-label="DevMediaWorx home"><img src="assets/img/icon.png" alt="" width="50" height="40"><img src="assets/img/wordmark.png" alt="DevMediaWorx" style="height:22px;width:auto"></a>';

  /* Background atmosphere */
  var atmos = '<div class="atmos" aria-hidden="true"><div class="blob b1"></div><div class="blob b2"></div><div class="blob b3"></div></div><div class="grain" aria-hidden="true"></div><canvas id="particles" aria-hidden="true"></canvas><div class="progress" aria-hidden="true"></div><div class="cursor" aria-hidden="true"></div>';

  /* Intro curtain */
  var curtain = '<div class="curtain" aria-hidden="true"><div class="panel top"></div><div class="panel bot"></div><div class="mark"><img src="assets/img/icon.png" alt="" width="140" height="111"><span>DEVELOPMENT · MEDIA · TECHNOLOGY</span></div></div>';

  /* Header */
  var links = NAV.filter(function (n) { return n.href !== 'index.html'; }).map(function (n) {
    return '<a href="' + n.href + '"' + (n.href === current ? ' aria-current="page"' : '') + '>' + n.label + '</a>';
  }).join('');
  var header = '<a class="skip" href="#main">Skip to content</a>' +
    '<header class="header" data-section="header"><div class="wrap nav">' + brand +
    '<nav class="nav-links" aria-label="Main">' + links + '</nav>' +
    '<div class="nav-cta"><a class="btn btn-primary btn-sm magnetic" href="contact.html" data-cta="Start a project"><span class="btn-label">Start a project</span>' + ICONS.arrow + '</a>' +
    '<button class="burger" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-menu"><span></span><span></span></button></div>' +
    '</div></header>';

  var mm = '<div class="mobile-menu" id="mobile-menu" data-section="mobile-menu"><nav aria-label="Mobile">' +
    NAV.map(function (n, i) { return '<a href="' + n.href + '"' + (n.href === current ? ' aria-current="page"' : '') + '><small>0' + (i + 1) + '</small>' + n.label + '</a>'; }).join('') +
    '</nav><div class="mm-foot"><a class="btn btn-wa" href="' + wa("Hi DevMediaWorx, I'd like to discuss a project.") + '" target="_blank" rel="noopener">' + ICONS.wa + 'WhatsApp</a>' +
    '<a class="btn btn-ghost" href="tel:' + C.contact.phone + '">' + ICONS.phone + C.contact.phoneDisplay + '</a></div></div>';

  /* Footer */
  var socials = Object.keys(C.social).filter(function (k) { return C.social[k]; }).map(function (k) {
    return '<a href="' + C.social[k] + '" target="_blank" rel="noopener" aria-label="' + k + '" data-social="' + k + '">' + ICONS[k] + '</a>';
  }).join('');
  var footer = '<footer class="footer" data-section="footer"><div class="wrap"><div class="foot-grid">' +
    '<div class="foot-brand">' + brand + '<p>Websites, apps, business systems and video production from one team in Cairo, for clients in Egypt, the Gulf and Europe.</p>' + (socials ? '<div class="socials">' + socials + '</div>' : '') + '</div>' +
    '<div><h4>Company</h4><ul>' + NAV.map(function (n) { return '<li><a href="' + n.href + '">' + n.label + '</a></li>'; }).join('') + '</ul></div>' +
    '<div><h4>Services</h4><ul><li><a href="services.html#web">Websites</a></li><li><a href="services.html#apps">Mobile apps</a></li><li><a href="services.html#systems">Business systems</a></li><li><a href="services.html#video">Video production</a></li><li><a href="services.html#marketing">Marketing &amp; ads</a></li><li><a href="services.html#events">Event production</a></li></ul></div>' +
    '<div><h4>Contact</h4><ul>' +
    '<li><a href="' + wa("Hi DevMediaWorx, I'd like to discuss a project.") + '" target="_blank" rel="noopener">WhatsApp ' + C.contact.whatsappDisplay + '</a></li>' +
    '<li><a href="tel:' + C.contact.phone + '">' + C.contact.phoneDisplay + '</a></li>' +
    '<li><a href="mailto:' + C.contact.email + '">' + C.contact.email + '</a></li>' +
    '<li><span style="color:var(--muted)">' + C.contact.address + '</span></li></ul></div>' +
    '</div><div class="foot-bottom"><span>© ' + new Date().getFullYear() + ' DevMediaWorx. All rights reserved.</span><span class="mono">DEVELOPMENT · MEDIA · TECHNOLOGY SOLUTIONS</span></div></div></footer>';

  /* Floating WhatsApp + call */
  var floating = '<div class="floating" data-section="floating">' +
    '<a class="fab call" href="tel:' + C.contact.phone + '" aria-label="Call ' + C.contact.phoneDisplay + '">' + ICONS.phone + '</a>' +
    '<a class="fab wa" href="' + wa("Hi DevMediaWorx, I'd like to discuss a project.") + '" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">' + ICONS.wa + '</a></div>';

  var body = document.body;
  body.insertAdjacentHTML('afterbegin', atmos + curtain + header + mm);
  body.insertAdjacentHTML('beforeend', footer + floating);

  /* Fill any [data-c] placeholders in page content with CONFIG values */
  document.querySelectorAll('[data-c]').forEach(function (el) {
    var k = el.dataset.c, v = k.split('.').reduce(function (o, p) { return o && o[p]; }, C);
    if (v != null) el.textContent = v;
  });
  document.querySelectorAll('[data-wa]').forEach(function (a) {
    a.href = wa(a.dataset.wa || "Hi DevMediaWorx, I'd like to discuss a project.");
    a.target = '_blank'; a.rel = 'noopener';
  });
  document.querySelectorAll('[data-tel]').forEach(function (a) { a.href = 'tel:' + C.contact.phone; });
  document.querySelectorAll('[data-mail]').forEach(function (a) { a.href = 'mailto:' + C.contact.email; });
  document.querySelectorAll('[data-maplink]').forEach(function (a) { a.href = C.contact.mapLink; a.target = '_blank'; a.rel = 'noopener'; });
})();
